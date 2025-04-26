from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from ultralytics import YOLO
import os
from pathlib import Path
import uuid
import cv2
import threading

app = Flask(__name__, static_folder='static')
CORS(app)

# Configuration
PROJECT_ROOT = Path(__file__).parent.resolve()
MODEL_PATH = PROJECT_ROOT / "models" / "best.pt"
UPLOAD_FOLDER = PROJECT_ROOT / "data" / "uploads"
RESULTS_FOLDER = PROJECT_ROOT / "static" / "results"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)

# Load YOLO model
try:
    model = YOLO(str(MODEL_PATH))
    print("✓ Model loaded successfully")
except Exception as e:
    print(f"✗ Model loading failed: {e}")
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

# API Routes
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

@app.route('/api/upload', methods=['POST'])
def handle_upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not model:
        return jsonify({'error': 'Model not loaded'}), 500
    
    # Validate file type
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ['.jpg', '.jpeg', '.png']:
        return jsonify({'error': 'Invalid file type'}), 400
    
    # Process file
    unique_id = uuid.uuid4().hex
    filename = f"{unique_id}{file_ext}"
    result_filename = f"result_{unique_id}.jpg"
    
    try:
        # Save uploaded file
        file.save(str(UPLOAD_FOLDER / filename))
        
        # Run detection
        results = model(str(UPLOAD_FOLDER / filename))
        
        # Save result
        results[0].save(str(RESULTS_FOLDER / result_filename))
        
        # Get detected classes
        detected_classes = []
        if results and len(results) > 0:
            detected_classes = list(results[0].names.values())
        
        return jsonify({
            'result_url': f"/static/results/{result_filename}",
            'detected_classes': detected_classes
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/video_feed')
def video_feed():
    return Response(generate_frames(),
                  mimetype='multipart/x-mixed-replace; boundary=frame')

# Serve static files
@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)