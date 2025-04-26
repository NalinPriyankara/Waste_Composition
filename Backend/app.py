from flask import Flask, request, jsonify, Response, send_from_directory
from flask_cors import CORS
from ultralytics import YOLO
import cv2
import os
from pathlib import Path
import uuid
import numpy as np
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder='static')
CORS(app)

# Configuration
PROJECT_ROOT = Path(__file__).parent.resolve()
MODEL_PATH = PROJECT_ROOT / "models" / "best.pt"
UPLOAD_FOLDER = PROJECT_ROOT / "data" / "uploads"
RESULTS_FOLDER = PROJECT_ROOT / "static" / "results"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)

# Load YOLO model with verification
try:
    model = YOLO(str(MODEL_PATH))
    logger.info(f"✓ Model loaded successfully from {MODEL_PATH}")
    logger.info(f"Model classes: {model.names}")
except Exception as e:
    logger.error(f"✗ Model loading failed: {e}")
    model = None

def validate_image(image_path):
    """Verify the image can be properly loaded"""
    try:
        img = cv2.imread(str(image_path))
        if img is None:
            raise ValueError("Failed to read image file")
        return img
    except Exception as e:
        logger.error(f"Image validation failed: {e}")
        raise

def process_detection(image, filename):
    """Process image through YOLO model and save results"""
    try:
        # Convert color space (BGR to RGB)
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Run detection with lower confidence threshold for webcam
        results = model(image_rgb, conf=0.25)
        
        if not results or len(results) == 0:
            logger.warning("No detections found in image")
            return None, []
        
        # Generate unique result filename
        result_filename = f"result_{uuid.uuid4().hex}.jpg"
        result_path = RESULTS_FOLDER / result_filename
        
        # Save annotated image
        results[0].save(str(result_path))
        
        # Extract detected classes with confidence > threshold
        detected_classes = []
        boxes = results[0].boxes
        if boxes and len(boxes) > 0:
            detected_classes = [
                results[0].names[int(cls)]
                for cls, conf in zip(boxes.cls, boxes.conf)
                if conf > 0.25  # Confidence threshold
            ]
        
        logger.info(f"Detected {len(detected_classes)} objects: {detected_classes}")
        return result_filename, detected_classes
        
    except Exception as e:
        logger.error(f"Detection processing failed: {e}")
        raise

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'model_classes': model.names if model else None
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
    
    try:
        # Validate file type
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in ['.jpg', '.jpeg', '.png']:
            return jsonify({'error': 'Invalid file type'}), 400
        
        # Save uploaded file
        filename = f"{uuid.uuid4().hex}{file_ext}"
        filepath = UPLOAD_FOLDER / filename
        file.save(str(filepath))
        
        # Validate and process image
        img = validate_image(filepath)
        result_filename, detected_classes = process_detection(img, filename)
        
        if not result_filename:
            return jsonify({
                'warning': 'No objects detected',
                'debug': {
                    'image_size': img.shape,
                    'model_classes': model.names
                }
            }), 200
        
        return jsonify({
            'result_url': f"/static/results/{result_filename}",
            'detected_classes': detected_classes,
            'debug_info': {
                'image_size': img.shape,
                'detection_count': len(detected_classes)
            }
        })
        
    except Exception as e:
        logger.error(f"Upload processing failed: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/webcam_capture', methods=['POST'])
def handle_webcam_capture():
    if not request.data:
        return jsonify({'error': 'No image data received'}), 400
    
    if not model:
        return jsonify({'error': 'Model not loaded'}), 500
    
    try:
        # Convert base64 image to OpenCV format
        image_data = request.data
        nparr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return jsonify({'error': 'Failed to decode image'}), 400
        
        # Process detection
        result_filename, detected_classes = process_detection(img, "webcam_capture.jpg")
        
        if not result_filename:
            return jsonify({
                'warning': 'No objects detected',
                'debug': {
                    'image_size': img.shape,
                    'model_classes': model.names
                }
            }), 200
        
        return jsonify({
            'result_url': f"/static/results/{result_filename}",
            'detected_classes': detected_classes,
            'debug_info': {
                'image_size': img.shape,
                'detection_count': len(detected_classes)
            }
        })
        
    except Exception as e:
        logger.error(f"Webcam capture processing failed: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/video_feed')
def video_feed():
    def generate():
        camera = cv2.VideoCapture(0)
        camera.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
        camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
        
        while True:
            success, frame = camera.read()
            if not success:
                break
                
            if model:
                # Convert color space and detect
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                results = model(frame_rgb, conf=0.3)
                frame = results[0].plot()
                
            ret, buffer = cv2.imencode('.jpg', frame)
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
    
    return Response(generate(),
                  mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)