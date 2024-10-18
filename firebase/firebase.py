import os
import serial
import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

# Get the directory of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))

# Construct the path to the service account key file
key_path = os.path.join(current_dir, "serviceAccountKey.json")

# Initialize Firebase
cred = credentials.Certificate(key_path)
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://arduinor3sensordata-default-rtdb.asia-southeast1.firebasedatabase.app/'
})

# Set up serial connection
ser = serial.Serial('COM3', 9600)  # Replace 'COM3' with your Arduino's port if needed

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
            except Exception as e:
                print(f"Error uploading to Firebase: {e}")

if __name__ == "__main__":
    try:
        print("Starting data collection and upload...")
        read_and_upload()
    except KeyboardInterrupt:
        print("\nScript terminated by user.")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        ser.close()
        print("Serial connection closed.")