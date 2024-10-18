**Live Link:**

https://mr-tweaker.github.io/Arduino_firebase/

# Arduino Sensor Data Project

This project collects sensor data from an Arduino device and displays it in real-time on a web interface. It uses Firebase for data storage and retrieval.

## Features

- Collects heart rate, temperature, and humidity data from Arduino sensors
- Uploads data to Firebase Realtime Database
- Displays latest sensor readings and historical data on a web interface
- Provides real-time recommendations based on sensor readings

## Project Structure

- `firebase/firebase.py`: Python script to read data from Arduino and upload to Firebase
- `index.html`: Main HTML file for the web interface
- `app.js`: JavaScript file handling Firebase integration and data display
- `styles.css`: CSS file for styling the web interface

## Setup and Installation

1. Set up an Arduino with appropriate sensors (heart rate, temperature, humidity).
2. Install required Python libraries:
   ```
   pip install pyserial firebase-admin
   ```
3. Set up a Firebase project and download the `serviceAccountKey.json`.
4. Place the `serviceAccountKey.json` in the `firebase` directory.
5. Update the Firebase configuration in `app.js` with your project details.
6. Connect the Arduino to your computer and update the COM port in `firebase.py` if necessary.

## Usage

1. Run the Python script to start collecting and uploading data:
   ```
   python firebase/firebase.py
   ```
2. Open `index.html` in a web browser to view the data display.

## Web Interface

The web interface displays:
- Latest sensor readings
- Historical data in a table format
- Recommendations based on current readings

## Dependencies

- Firebase
- PySerial
- Firebase Admin SDK (Python)

## Future Improvements

- Add user authentication
- Implement data visualization with charts
- Extend sensor types and recommendations

## License

[Add your chosen license here]
