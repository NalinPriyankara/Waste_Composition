from ultralytics import YOLO

if __name__ == '__main__':
    
    model = YOLO("E:/Project/Waste_Composition/backend/yolov8n.pt")

    results = model.train(
        data="E:/Project/Waste_Composition/backend/data/data.yaml",
        epochs=50,
        batch=16,
        imgsz=416,
        device=0,  # Use GPU 0
        name="waste_detection",
        workers=0,  # Set workers to 0 to avoid multiprocessing issues
        amp=False
    )