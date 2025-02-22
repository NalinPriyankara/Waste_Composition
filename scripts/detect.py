from ultralytics import YOLO
import cv2

# Load the trained model
model = YOLO("E:/Project/Waste_Composition/models/best.pt")  # Path to your trained model

# Initialize webcam
cap = cv2.VideoCapture(0)  # 0 is usually the default webcam

# Check if the webcam is opened correctly
if not cap.isOpened():
    print("Error: Could not open webcam.")
    exit()

# Loop to capture frames from the webcam
while True:
    # Capture frame-by-frame
    ret, frame = cap.read()
    
    # If frame is read correctly, ret is True
    if not ret:
        print("Error: Failed to capture image.")
        break

    # Perform inference on the captured frame
    results = model(frame)  # Perform inference on the frame

    # Display the results
    for result in results:
        # Get the annotated frame with bounding boxes
        annotated_frame = result.plot()

        # Display the annotated frame
        cv2.imshow('YOLO Webcam Detection', annotated_frame)

    # Break the loop if 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the webcam and close all OpenCV windows
cap.release()
cv2.destroyAllWindows()