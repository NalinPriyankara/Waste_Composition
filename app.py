from flask import Flask, render_template, Response
import cv2
from ultralytics import YOLO
import threading

# Initialize Flask app
app = Flask(__name__)

# Load the trained model
model = YOLO("models/best.pt")
print("Model loaded successfully.")

# Global variables for webcam feed
camera = cv2.VideoCapture(0)  # 0 is usually the default webcam
lock = threading.Lock()

# Function to generate frames with detection
def generate_frames():
    while True:
        with lock:
            # Capture frame-by-frame
            success, frame = camera.read()
            if not success:
                break

            # Perform inference on the captured frame
            results = model(frame, conf=0.3)  # Lower confidence threshold
            print("Detection results:", results)  # Debug output

            # Annotate the frame with bounding boxes
            annotated_frame = results[0].plot()

            # Encode the frame as JPEG
            ret, buffer = cv2.imencode('.jpg', annotated_frame)
            frame = buffer.tobytes()

        # Yield the frame in byte format
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

# Route for the webcam page
@app.route('/webcam')
def webcam():
    return render_template('webcam.html')

# Route to stream the webcam feed
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

# Home route
@app.route('/')
def home():
    return render_template('index.html')

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, threaded=True)