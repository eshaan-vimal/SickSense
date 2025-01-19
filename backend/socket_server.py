from flask import Flask
from flask_socketio import SocketIO, emit


app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on("connect")
def on_connect():
    print("Client connected")
    emit("connection-success", {"message": "Successfully connected to the server!"})

@socketio.on("disconnect")
def on_disconnect():
    print("Client disconnected")

@socketio.on("start-call")
def handle_start_call(data):
    try:
        print(f"Doctor started call: {data}")
        emit("call-started", data, broadcast=True)
    except Exception as e:
        print(f"Error in start-call event: {e}")

@socketio.on("end-call")
def handle_end_call(data):
    try:
        print(f"Doctor ended call: {data}")
        emit("call-ended", data, broadcast=True)
    except Exception as e:
        print(f"Error in end-call event: {e}")

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=3001, debug=True)
