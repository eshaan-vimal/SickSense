from flask import Flask, request, jsonify
from flask_cors import CORS 


app = Flask(__name__)
CORS(app)

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']
    
    if username == 'patient' and password == '12345678':
        return jsonify({'status': 'success', 'message': 'Login successful'}), 200
    else:
        return jsonify({'status': 'error', 'message': 'Invalid credentials'}), 401

# @app.route('/predict', methods=['POST'])
# def predict_disease():
#     data = request.json
#     symptoms = data['symptoms']
#     location = data['location']
#     lifestyle = data['lifestyle']
#     # Use your ML model for disease prediction
#     prediction = "Sample disease prediction result"
#     return jsonify({'status': 'success', 'prediction': prediction})

if __name__ == '__main__':
    app.run(debug=True)
