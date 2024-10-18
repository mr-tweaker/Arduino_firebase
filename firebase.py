import serial
import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

# Initialize Firebase
cred = credentials.Certificate("/Firebase/serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://arduinor3sensordata-default-rtdb.asia-southeast1.firebasedatabase.app/'
})

# Set up serial connection
ser = serial.Serial('COM3', 9600)  # Replace 'COM3' with your Arduino's port

def read_and_upload():
    while True:
        if ser.in_waiting:
            line = ser.readline().decode('utf-8').strip()
            try:
                data = json.loads(line)
                # Upload data to Firebase
                ref = db.reference('sensor_data')
                ref.push(data)
                print(f"Uploaded: {data}")
            except json.JSONDecodeError:
                print(f"Error decoding JSON: {line}")

if __name__ == "__main__":
    read_and_upload()