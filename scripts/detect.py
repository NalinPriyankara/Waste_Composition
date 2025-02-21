from ultralytics import YOLO
import cv2

# Load the trained model
model = YOLO("models/waste_detection.pt")  # Path to your trained model

# Perform inference on a test image
results = model("data/images/test/image201.jpg")  # Replace with your test image path

# Display the results
for result in results:
    result.show()  # Show the image with bounding boxes
    result.save("results/detection_result.jpg")  # Save the result