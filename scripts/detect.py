from ultralytics import YOLO
import cv2

# Load the trained model
model = YOLO("E:/Project/Waste_Composition/runs/detect/waste_detection2/weights/best.pt")  # Path to your trained model

# Take image path as user input
image_path = input("Enter the path to the image: ")

# Perform inference on the provided image
results = model(image_path)  # Use the image path provided by the user

# Display and save the results
for result in results:
    result.show()  # Show the image with bounding boxes
    result.save("results/detection_result.jpg")  # Save the result