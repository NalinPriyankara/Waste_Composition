from ultralytics import YOLO

def run_image_detection(image_path):
    # Load the trained model
    model = YOLO("models/best.pt")  # Path to your trained model

    # Perform inference on the provided image
    results = model(image_path)  # Use the image path provided by the user

    # Save the result
    result_path = "results/detection_result.jpg"
    for result in results:
        result.save(result_path)

    return result_path

if __name__ == "__main__":
    # Take image path as user input
    image_path = input("Enter the path to the image: ")
    run_image_detection(image_path)