from pymongo import MongoClient
from flask import Flask, jsonify, render_template, request, send_file, url_for
from flask_cors import CORS
from gridfs import GridFS
from bson import ObjectId, Binary
from datetime import datetime
from io import BytesIO
import os
import pandas as pd
import traceback
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask_socketio import SocketIO, emit

import disease_detection
import drug_recommendation
import environmental_factors
import generate_report
import lifestyle_suggestion


app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017/")
db = client["sicksensedb"]
user_profiles = db["userProfile"]
doctor_profiles = db["doctorProfile"]
fs = GridFS(db)
socketio = SocketIO(app, cors_allowed_origins="*")

USER = "sicksense.app@gmail.com"
PASSWORD = "hsar kxyi dwsp auwz"

@app.route('/profile/<email>', methods=['GET'])
def get_user_info(email):
    user = user_profiles.find_one({"email": email})
    print(user)
    if user:        
        user["email"] = str(user["email"])
        return jsonify(user), 200
    return jsonify({"message": "User not found"}), 404



@app.route('/profile', methods=['POST'])
def save_user_info():

    data = request.json
    print(data)
    
    if not data or "email" not in data:
        return jsonify({"error": "Missing 'email' in request data"}), 400
    
    user_id = data["email"]
    
    existing_user = user_profiles.find_one({"email": user_id})
    
    if existing_user:
        user_profiles.update_one({"email": user_id}, {"$set": data})
        return jsonify({"message": "User data updated successfully"}), 200
    
    else:
        user_profiles.insert_one(data)
        return jsonify({"message": "New user created successfully"}), 201



def getfile_id(email):
    user = user_profiles.find_one({"email": email})
    if user and "file_id" in user:
            return ObjectId(user["file_id"])
    else:
        return None

@app.route('/diagnosis/<email>', methods=['POST'])
def diagnosis(email):
    try:
        user = user_profiles.find_one({"email": email})

        data = request.json
        
        symptoms = data.get("symptoms", [])
        city = user['city']

        diet = data.get("diet", "")
        if diet == "Healthy":
            diet = 0
        elif diet == "Balanced":
            diet = 0.5
        else:
            diet = 1

        drink = data.get("drink", "")
        if drink == "Never":
            drink = 0
        elif drink == "Occassional":
            drink = 0.5
        else:
            drink = 1
            
        smoke = data.get("smoke", "")
        if smoke == "Never":
            smoke = 0
        elif smoke == "Occassional":
            smoke = 0.5
        else:
            smoke = 1

        sleep_duration = int(data.get("sleepDuration", ""))
        exercise_hours = int(data.get("exerciseHours", ""))

        print(symptoms)
        print(city)
        print(drink)
        print(smoke)
        print(diet)
        print(sleep_duration)
        print(exercise_hours, "\n")

        temperature, humidity, aqi = environmental_factors.get_factors(city)
        temperature = temperature - 273.15

        print(temperature)
        print(humidity)
        print(aqi, "\n")

        file_id = getfile_id(email)    
        file_data = fs.get(file_id)

        # Read the CSV file into a Pandas DataFrame
        csv_content = file_data.read()
        dna_data = pd.read_csv(BytesIO(csv_content))

        disease_association = pd.read_csv(r"./Database/Disease/DiseaseAssociation.csv")
        disease_features = pd.merge(dna_data, disease_association, on='rsid')

        prs_values = disease_detection.get_dna_prs(disease_features)
        print("\n", prs_values, "\n")

        genetic_risk = disease_detection.get_genetic_risk(disease_features, prs_values)
        print(genetic_risk, "\n")

        environmental_risk = disease_detection.get_environmental_risk(temperature, humidity, aqi)
        print(environmental_risk, "\n")

        lifestyle_risk = disease_detection.get_lifestyle_risk(diet, drink, smoke, exercise_hours, sleep_duration)
        print(lifestyle_risk, "\n")

        disease_risk = disease_detection.get_disease_risk(genetic_risk, environmental_risk, lifestyle_risk)
        print(disease_risk, "\n")

        disease_insights = {disease: round(disease_risk[disease]) for disease in disease_risk} 

        drug_association = pd.read_csv(r"./Database/Drug/DrugAssociation.csv")
        drug_features = pd.merge(dna_data, drug_association, on='rsid')

        drug_insights = drug_recommendation.get_drug_efficacy(drug_features, disease_insights)
        print(drug_insights, "\n")

        lifestyle_insights = lifestyle_suggestion.get_lifestyle_changes(disease_insights)
        print(lifestyle_insights, "\n")

        symptom_association = pd.read_csv(r"./Database/Disease/DiseaseSymptoms.csv")
        disease_symptoms = {
            row['disease']: f"Symptoms of {row['disease']} include {', '.join([symptom for symptom in row[1:] if pd.notna(symptom)]).lower()}."
            for _, row in symptom_association.iterrows()
        }
        print(disease_symptoms, "\n")


        disease_descriptions = {
            'Alzheimer\'s Disease': r"Alzheimer's disease is a brain disorder that gradually destroys memory and thinking skills, and eventually, the ability to carry out daily tasks. It's the most common form of dementia in older adults, accounting for at least two-thirds of cases in people aged 65 and older.",
            'Asthma': r"Asthma is a chronic lung disease that causes inflammation and tightening of the muscles around the airways, making breathing difficult.",
            'Breast Cancer': r"Breast cancer is a disease that occurs when breast tissue cells grow out of control and form tumors. It can affect both men and women, but it's rare in men.",
            'Coronary Artery Disease': r"Coronary artery disease (CAD), also known as coronary heart disease or ischemic heart disease, is a common condition that occurs when the arteries supplying blood to the heart become narrowed or blocked.", 
            'Diabetes Mellitus Type 1': r"Type 1 diabetes mellitus, also known as type 1 diabetes or T1DM, is an autoimmune disease that occurs when the body's immune system destroys the pancreas' insulin-producing cells.", 
            'Diabetes Mellitus Type 2': r"Type 2 diabetes mellitus (T2DM) is a common disease that occurs when the body has high blood sugar levels due to insulin resistance and a relative lack of insulin.",
            'Ischemic Stroke': r"An ischemic stroke is a type of stroke that occurs when a blood vessel in the brain becomes blocked, preventing blood flow to the brain.",
            'Lung Carcinoma': r"Lung carcinoma, also known as lung cancer, is a malignant tumor that starts in the lungs. It's a leading cause of cancer deaths in the United States, and is responsible for more deaths in women than breast cancer.",
            'Parkinson\'s Disease': r"Parkinson's disease is a brain disorder that causes movement problems, and can also impact mental health, sleep, and pain.", 
            'Pulmonary Fibrosis': r"Pulmonary fibrosis is a disease where there is scarring of the lungs—called fibrosis—which makes it difficult to breathe. This is because the scarring causes the tissues in the lungs to get thick and stiff and makes it hard to absorb oxygen into the bloodstream."
        }

        if user:
            patient_data = {
                "name": user.get("name", "N/A"),
                "phone": user.get("mobile", "N/A"),
                "email": user.get("email", "N/A"),
                "age": user.get("age", "N/A"),
                "weight": user.get("weight", "N/A"),
                "height": user.get("height", "N/A"),
                "pastIllnesses": user.get("illness", "N/A"),
                "currentMedication": user.get("medication", "N/A")
            }
        else:
            patient_data = {}


        disease_insights = {disease: {'description': disease_descriptions[disease], 'prs': round(prs_values[disease], 4), 'risk': f'{round(disease_risk[disease]*100, 2)}%'} for disease in disease_insights if disease_insights[disease] == 1}
        print(disease_insights, "\n")

        import random
        drug_insights = {disease: {'drug': drug_insights[disease][0], 'dosage': f"Initial dose of {random.choice(['162-325', '60-125'])} mg once, maintainance dose of {random.choice(['75-100', '50-65'])} mg daily for lifelong duration.", 'other_drugs': ", ".join(drug_insights[disease][1:])} for disease in drug_insights}
        print(drug_insights, "\n")

        lifestyle_insights = {disease: {'symptoms': disease_symptoms[disease], 'present_lifestyle': random.choice(["Unhealthy diet, Lack of exercise, Excessive alcoholism", "Unhealthy Diet, Lack of Exercise", "Excessive smoking"]), 'change_lifestyle': ", ".join(lifestyle_insights[disease])} for disease in lifestyle_insights}
        print(lifestyle_insights, "\n")

        patient_data['disease_detection'] = disease_insights
        patient_data['drug_recommendation'] = drug_insights
        patient_data['lifestyle_recommendation'] = lifestyle_insights


        pdf_io = BytesIO()
        generate_report.create_report(pdf_io, patient_data)
        pdf_io.seek(0)

        pdf_path = './GeneratedReports/personalized_health_report.pdf'
        with open(pdf_path, 'wb') as f:
            f.write(pdf_io.read())
        
        file_url = url_for('download_report', filename='personalized_health_report.pdf', _external=True)
        return {"message": "Data submitted successfully.", "file_url": file_url}, 200
    
    except Exception as e:
        print(f"Error: {str(e)}")  
        return "An error occurred while processing the file", 500


# @app.route('/get_reports/<email>', methods=['GET'])
# def get_reports(email):
#     try:
#         # Fetch the user from MongoDB by email
#         user = user_profiles.find_one({"email": email})

#         # If user is not found
#         if not user or "report_history" not in user:
#             return jsonify({"message": "No reports found for this user"}), 404

#         reports = user["report_history"]
#         report_data = []

#         for report in reports:
#             report_data.append({
#                 "date": report["date"],
#                 "pdf": url_for('download_report', filename=report["pdf_file_name"], _external=True)
#             })

#         return jsonify(report_data), 200

#     except Exception as e:
#         return jsonify({"message": str(e)}), 500


@app.route('/download_report/<filename>', methods=['GET'])
def download_report(filename):
    return send_file(os.path.join('./GeneratedReports', filename), mimetype='application/pdf', as_attachment=True)



@app.route("/personeldetail", methods=["POST"])
def manage_personel_detail():
    try:
        
        data = request.json
        emailid = data.get("email")

        if not emailid:
            return jsonify({"success": False, "message": "Email is required"}), 400

        
        update_fields = {
            "name": data.get("name"),
            "mobile": data.get("mobile"),
            "age": data.get("age"),
            "weight": data.get("weight"),
            "height": data.get("height"),
            "dob": data.get("dob"),
            "gender": data.get("gender"),
            "allergies": data.get("allergies"),
            "illness": data.get("illness"),
            "medication": data.get("medication"),
            "date": data.get("date"),
            "time": data.get("time"),
            "location": data.get("location"),
        }

        update_fields = {k: v for k, v in update_fields.items() if v is not None}

        user_exists = user_profiles.find_one({"email": emailid})

        if user_exists:
            user_profiles.update_one(
                {"email": emailid},
                {"$set": update_fields},
                upsert=True  
            )
            message = "User details updated successfully"
        else:
            update_fields["email"] = emailid  
            user_profiles.insert_one(update_fields)
            message = "User details added successfully"

        return jsonify({"success": True, "message": message})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@app.route("/appointmentdetail", methods=["POST"])
def appointment_detail():
    try:
        data = request.json
        emailid = data.get("email")
        date = data.get("date")
        time = data.get("time")
        location = data.get("location")

        if not emailid or not date or not time:
            return jsonify({"success": False, "message": "Missing required fields: email, date, or time"}), 400

        
        user_profiles.update_one(
            {"email": emailid},  
            {"$set": {"date": date, "time": time, "location": location}},  
            upsert=True  
        )

        return jsonify({"success": True, "message": "Appointment details updated successfully"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@app.route("/sendalldetails", methods=['GET'])
def send_all_details():
    try:
        
        users = list(user_profiles.find())

        for user in users:
            user["_id"] = str(user["_id"])

        return jsonify({"success": True, "data": users})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
    

@app.route("/senddetails/<emailid>", methods=['GET'])
def send_details(emailid):
    try:
        users = list(user_profiles.find({"email": emailid}))
        
        for user in users:
            user["_id"] = str(user["_id"])

        return jsonify({"success": True, "data": users})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
    


def send_email(recipient, subject, html_content):
    try:

        msg = MIMEMultipart()
        msg['From'] = f"SickSense Support <{USER}>"
        msg['To'] = recipient
        msg['Subject'] = subject

        msg.attach(MIMEText(html_content, 'html'))
    
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(USER, PASSWORD)
            server.sendmail(USER, recipient, msg.as_string())
            
        return True
    
    except Exception as e:
        import traceback
        print("Error traceback:", traceback.format_exc())
        print(f"Error sending email: {e}")

        return False


@app.route("/sendapprovemail/<emailid>", methods=["POST"])
def send_approve_email(emailid):
    try:
        
        user_profiles.update_one(
            {"email": emailid}, 
            {"$set": {"status": "approved"}},  
            upsert=True 
        )

        
        html_content = f"""
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #4CAF50; text-align: center;">Appointment Request Approved</h2>
                <p>Dear <b>{emailid.split('@')[0]}</b>,</p>
                <p>We are delighted to inform you that your appointment request with <b>SickSense</b> has been <b>approved</b>. Please find the details below:</p>
                <ul style="line-height: 1.6; padding-left: 20px;">
                    <li><b>Email:</b> {emailid}</li>
                    <li><b>Status:</b> Approved</li>
                </ul>
                <p>We look forward to assisting you and ensuring your experience with us is seamless and beneficial. If you have any specific requirements or questions, please feel free to reach out to our team prior to your appointment.</p>
                <p><b>Next Steps:</b> You will receive further details regarding the appointment schedule and preparations, if any, in a separate email. Please keep an eye on your inbox.</p>
                <p>Thank you for choosing <b>SickSense</b>. We value your trust and are committed to providing you with the highest quality of service.</p>
                <p style="margin-top: 20px;">Warm regards,<br>
                <b>SickSense Support Team</b></p>
                <hr style="border: none; border-top: 1px solid #ddd; margin-top: 20px;">
                <p style="font-size: 12px; color: #777;">This email was sent by SickSense. If you have questions or concerns, please contact us at <a href="mailto:support@SickSense.com" style="color: #4CAF50;">support@SickSense.com</a>.</p>
            </div>
        """
        
        if send_email(emailid, "Your Appointment Result with SickSense", html_content):
            return jsonify({"success": True, "message": "Email sent successfully"})
        else:
            return jsonify({"success": False, "message": "Failed to send email"})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)})


@app.route("/sendrejectmail/<emailid>", methods=["POST"])
def send_reject_email(emailid):
    print(emailid)
    try:
        
        user_profiles.update_one(
            {"email": emailid},  
            {"$set": {"status": "rejected"}},  
            upsert=True  
        )

        
        html_content = f"""
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #D32F2F; text-align: center;">Appointment Request Update</h2>
                <p>Dear <b>{emailid.split('@')[0]}</b>,</p>
                <p>We hope this email finds you well. We regret to inform you that your recent appointment request with <b>SickSense</b> has been <b>rejected</b>. 
                Please find the details below:</p>
                <ul style="line-height: 1.6; padding-left: 20px;">
                    <li><b>Email:</b> {emailid}</li>
                    <li><b>Status:</b> Rejected</li>
                </ul>
                <p><b>Reason for Rejection:</b> Unfortunately, your request did not meet the necessary criteria at this time. This could be due to scheduling conflicts, missing information, or other factors. 
                We recommend reviewing the appointment requirements or contacting our team for clarification.</p>
                <p>If you believe this is a mistake or require further information, please do not hesitate to reach out to our support team. We are here to assist you and address any concerns.</p>
                <p style="margin-top: 20px;">Thank you for your understanding and interest in our services. We encourage you to reapply in the future or get in touch to explore alternative options.</p>
                <p>Best regards,<br>
                <b>SickSense Support Team</b></p>
                <hr style="border: none; border-top: 1px solid #ddd; margin-top: 20px;">
                <p style="font-size: 12px; color: #777;">This email was sent by SickSense. If you have questions or concerns, please contact us at <a href="mailto:support@SickSense.com" style="color: #D32F2F;">support@SickSense.com</a>.</p>
            </div>
        """
        
        if send_email(emailid, "Your Appointment Request with SickSense", html_content):
            return jsonify({"success": True, "message": "Rejection email sent successfully"})
        else:
            return jsonify({"success": False, "message": "Failed to send rejection email"})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
    

@app.route('/upload-snp/<emailid>', methods=['POST'])
def upload_snp(emailid):
    if 'file' not in request.files:
        return jsonify({"error": "File is required"}), 400

    file = request.files['file']
        
    try:
        
        file_id = fs.put(file, filename=file.filename, metadata={"email": emailid})

        user_profiles.update_one(
            {"email": emailid},
            {"$set": {"file_id": str(file_id)}}
        )
        message = "File uploaded and user data updated successfully"

        return jsonify({"message": message, "file_id": str(file_id)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/doctors', methods=['GET'])
def get_doctors():
    doctors = doctor_profiles.find({}, {'_id': 0, 'rank': 1, 'name': 1, 'specialty': 1})
    return jsonify(list(doctors))


# @app.route('/api/add-patient', methods=['POST'])
# def add_patient():
#     try:
#         data = request.json
#         rank = data.get("rank")
#         user_id = data.get("userId") 

#         user = user_profiles.find_one({"userId": user_id}, {"_id": 0, "name": 1, "email": 1, "mobile": 1})

#         if not user:
#             return jsonify({"success": False, "message": "User not found."}), 404

#         result = doctor_profiles.update_one(
#             {"rank": rank}, 
#             {"$push": {"patients": user}}  
#         )

#         if result.modified_count > 0:
#             return jsonify({"success": True, "message": "Patient added successfully."}), 200
#         else:
#             return jsonify({"success": False, "message": "Doctor not found."}), 404

#     except Exception as e:
#         return jsonify({"success": False, "message": str(e)}), 500


@app.route('/api/add-patient', methods=['POST'])
def add_patient():
    try:
        data = request.json
        rank = data.get("rank")
        user_id = data.get("userId")

        # Find the doctor
        doctor = doctor_profiles.find_one({"rank": rank}, {"_id": 0, "name": 1, "email": 1})
        if not doctor:
            return jsonify({"success": False, "message": "Doctor not found."}), 404

        # Find the user
        user = user_profiles.find_one({"userId": user_id}, {"_id": 0, "name": 1, "email": 1, "mobile": 1})
        if not user:
            return jsonify({"success": False, "message": "User not found."}), 404

        # Update the user's `doctors` array
        user_update_result = user_profiles.update_one(
            {"userId": user_id},
            {"$addToSet": {"doctors": doctor}}
        )

        if user_update_result.matched_count == 0:
            return jsonify({"success": False, "message": "Failed to update user doctors."}), 500

        # Add the user details to the doctor's `patients` array
        doctor_update_result = doctor_profiles.update_one(
            {"rank": rank},
            {"$addToSet": {"patients": user}}  # Ensure no duplicate patients
        )

        if doctor_update_result.matched_count == 0:
            return jsonify({"success": False, "message": "Failed to update doctor's patients."}), 500

        return jsonify({"success": True, "message": "Contact recorded successfully."}), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

    

@app.route('/api/user/<user_id>/contacted-doctors', methods=['GET'])
def get_contacted_doctors(user_id):
    try:
        user = user_profiles.find_one({"userId": user_id}, {"_id": 0, "doctors": 1})
        if not user or "doctors" not in user:
            return jsonify([]), 200
        return jsonify(user["doctors"]), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@app.route('/api/doctor/<doctor_id>/patients', methods=['GET'])
def get_doctor_patients(doctor_id):
    try:
        doctor = doctor_profiles.find_one({"_id": ObjectId(doctor_id)}, {"_id": 0, "patients": 1})
        if not doctor or "patients" not in doctor:
            return jsonify({"patients": []}), 200
        return jsonify({"patients": doctor["patients"]}), 200
    except Exception as e:
        print(f"Error fetching patients: {e}")
        return jsonify({"success": False, "message": str(e)}), 500
    

# When a new client connects
@socketio.on("connect")
def on_connect():
    print("Client connected")

# When a client disconnects
@socketio.on("disconnect")
def on_disconnect():
    print("Client disconnected")

# When the doctor starts a call
@socketio.on("start-call")
def handle_start_call():
    print("Doctor started call")
    # Broadcast "call-started" to ALL connected clients.
    # In a real-world scenario, you might only emit to a specific room/patient.
    emit("call-started", broadcast=True)

# When the doctor ends a call
@socketio.on("end-call")
def handle_end_call():
    print("Doctor ended call")
    emit("call-ended", broadcast=True)





if __name__ == '__main__':
    app.run(debug=True)
    socketio.run(app, host="0.0.0.0", port=3001)