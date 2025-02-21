from ultralytics import YOLO

# Load a pre-trained YOLO model
model = YOLO("yolov8n.pt")  # Load YOLOv8 Nano (smallest model)

# Train the model
results = model.train(
    data="E:\Project\Waste_Composition\data\waste_dataset.yaml",  # Path to dataset config file
    epochs=50,                       # Number of training epochs
    batch=16,                        # Batch size
    imgsz=640,                       # Image size
    name="waste_detection"           # Name of the training run
)

# Evaluate the model
metrics = model.val()  # Evaluate on the validation set
print("mAP:", metrics.box.map)  # Print mean Average Precision (mAP)