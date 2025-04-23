from flask import Flask, render_template, Response
import cv2
from ultralytics import YOLO
import threading
import os

# Initialize Flask app
app = Flask(__name__)

# Configure upload folder
UPLOAD_FOLDER = 'data/uploads'
RESULTS_FOLDER = 'static/results'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)

# Load the trained model
model = YOLO("models/best1.pt")  # Update path if needed
print("Model loaded successfully.")

# ... (keep your existing webcam code) ...

# Route for image upload
@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return redirect(request.url)
    
    file = request.files['file']
    if file.filename == '':
        return redirect(request.url)
    
    if file:
        # Save uploaded file
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)
        
        # Process image
        results = model(filepath)
        
        # Save result
        result_path = os.path.join(RESULTS_FOLDER, 'result.jpg')
        results[0].save(result_path)
        
        return redirect(url_for('result', filename='result.jpg'))

# Route to show result
@app.route('/result/<filename>')
def result(filename):
    return render_template('result.html', result_image=url_for('static', filename=f'results/{filename}'))

# Load the trained model
model = YOLO("models/best1.pt")
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