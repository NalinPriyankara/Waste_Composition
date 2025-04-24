from flask import Flask, render_template, Response, request, redirect, url_for
import cv2
from ultralytics import YOLO
import threading
import os
from pathlib import Path
import uuid

# Initialize Flask app
app = Flask(__name__, static_folder='static')

# Configure paths
PROJECT_ROOT = Path(__file__).parent.resolve()
MODEL_PATH = PROJECT_ROOT / "models" / "best1.pt"
UPLOAD_FOLDER = PROJECT_ROOT / "data" / "uploads"
RESULTS_FOLDER = PROJECT_ROOT / "static" / "results"

# Create folders if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)

# Load model with verification
try:
    model = YOLO(str(MODEL_PATH))
    print(f"✓ Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    print(f"✗ Error loading model: {e}")
    model = None

# Webcam feed generator
def generate_frames():
    camera = cv2.VideoCapture(0)
    while True:
        success, frame = camera.read()
        if not success:
            break
        if model:
            results = model(frame, conf=0.3)
            frame = results[0].plot()
        ret, buffer = cv2.imencode('.jpg', frame)
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

# Routes
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/webcam')
def webcam():
    return render_template('webcam.html')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                  mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/upload', methods=['GET', 'POST'])
def upload_image():
    if request.method == 'POST':
        if 'file' not in request.files:
            return redirect(request.url)
        
        file = request.files['file']
        if file.filename == '':
            return redirect(request.url)
        
        if file and model:
            # Generate unique filename
            unique_id = uuid.uuid4().hex
            file_ext = os.path.splitext(file.filename)[1].lower()
            
            # Validate file extension
            if file_ext not in ['.jpg', '.jpeg', '.png']:
                return "Invalid file type. Please upload an image (JPG/JPEG/PNG)", 400
                
            filename = f"{unique_id}{file_ext}"
            
            # Save uploaded file
            filepath = UPLOAD_FOLDER / filename
            file.save(str(filepath))
            
            # Process image
            try:
                results = model(str(filepath))
                # Save result
                result_filename = f"result_{unique_id}.jpg"
                result_path = RESULTS_FOLDER / result_filename
                results[0].save(str(result_path))
                return redirect(url_for('result', filename=result_filename))
            except Exception as e:
                return f"Error processing image: {str(e)}", 500
    
    return render_template('upload.html')

@app.route('/result/<filename>')
def result(filename):
    return render_template('result.html', 
                         result_image=url_for('static', filename=f'results/{filename}'))

if __name__ == '__main__':
    app.run(debug=True, threaded=True, host='0.0.0.0', port=5000)