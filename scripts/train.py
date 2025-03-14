from ultralytics import YOLO

if __name__ == '__main__':
    # Load a pre-trained YOLO model
    model = YOLO("yolov8n.pt")

    results = model.train(
        data="E:\Project\Waste_Composition\data\data.yaml",
        epochs=50,
        batch=16,
        imgsz=640,
        device=0,  # Use GPU 0
        name="waste_detection",
        workers=0,  # Set workers to 0 to avoid multiprocessing issues
        amp=False
    )