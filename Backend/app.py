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
MODEL_PATH = PROJECT_ROOT / "models" / "best5.pt"
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

def process_image_correctly(image):
    """Handle color space conversions properly"""
    # Convert from BGR (OpenCV default) to RGB (model expected)
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Process detection
    results = model(rgb_image, conf=0.3)
    
    # Convert results back to BGR for display
    if results and len(results) > 0:
        plotted_image = results[0].plot()  # plot() returns BGR
        # Get detected class IDs
        detected_class_ids = results[0].boxes.cls.int().tolist()
        return plotted_image, results, detected_class_ids
    return None, None, None

def save_result_image(image, path):
    """Save image after converting BGR to RGB for correct browser display"""
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    cv2.imwrite(str(path), image_rgb)

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
        file_bytes = file.read()
        nparr = np.frombuffer(file_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return jsonify({'error': 'Invalid image file'}), 400
        
        plotted_img, results, detected_class_ids = process_image_correctly(img)
        
        if not results:
            return jsonify({'warning': 'No objects detected'}), 200
        
        result_filename = f"result_{uuid.uuid4().hex}.jpg"
        result_path = RESULTS_FOLDER / result_filename
        
        # Save with color correction
        save_result_image(plotted_img, result_path)
        
        # Get only the detected class names
        detected_classes = [results[0].names[class_id] for class_id in detected_class_ids]
        
        return jsonify({
            'result_url': f"/static/results/{result_filename}",
            'detected_classes': detected_classes,
            'color_info': {
                'original_format': 'BGR',
                'processed_format': 'RGB',
                'saved_format': 'RGB'
            }
        })
        
    except Exception as e:
        logger.error(f"Upload failed: {str(e)}")
        return jsonify({'error': 'Image processing failed'}), 500

@app.route('/api/webcam_capture', methods=['POST'])
def handle_webcam_capture():
    if not request.data:
        return jsonify({'error': 'No image data received'}), 400
    
    if not model:
        return jsonify({'error': 'Model not loaded'}), 500
    
    try:
        nparr = np.frombuffer(request.data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return jsonify({'error': 'Failed to decode image'}), 400
        
        plotted_img, results, detected_class_ids = process_image_correctly(img)
        
        if not results:
            return jsonify({'warning': 'No objects detected'}), 200
        
        result_filename = f"webcam_result_{uuid.uuid4().hex}.jpg"
        result_path = RESULTS_FOLDER / result_filename
        
        # Save with color correction
        save_result_image(plotted_img, result_path)
        
        # Get only the detected class names
        detected_classes = [results[0].names[class_id] for class_id in detected_class_ids]
        
        return jsonify({
            'result_url': f"/static/results/{result_filename}",
            'detected_classes': detected_classes
        })
        
    except Exception as e:
        logger.error(f"Webcam processing failed: {str(e)}")
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
                plotted_img, _, _ = process_image_correctly(frame)
                if plotted_img is not None:
                    frame = plotted_img
                
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