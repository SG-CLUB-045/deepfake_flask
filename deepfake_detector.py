import torch
import cv2
import os
from torchvision import transforms
from PIL import Image

# Load your pre-trained model
model = torch.load('models/model_90_acc_20_frames_FF_data.pt', map_location=torch.device('cpu'), weights_only=True)
# print(model)
# model.eval()

# Define your preprocessing steps
preprocess = transforms.Compose([
    transforms.Resize((224, 224)),  # Assuming model input size is 224x224
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

def extract_frames(video_path, max_frames=10):
    """Extract frames from the video file."""
    vidcap = cv2.VideoCapture(video_path)
    frames = []
    success, image = vidcap.read()
    count = 0
    while success and count < max_frames:
        frames.append(image)
        success, image = vidcap.read()
        count += 1
    vidcap.release()
    return frames

def predict_deepfake(video_path):
    frames = extract_frames(video_path)
    predictions = []

    with torch.no_grad():
        for frame in frames:
            # Convert frame (NumPy array) to PIL image
            frame_pil = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            input_tensor = preprocess(frame_pil)
            input_tensor = input_tensor.unsqueeze(0)  # Add batch dimension

            # Perform prediction
            output = model(input_tensor)
            probabilities = torch.softmax(output, dim=1)
            prediction = torch.argmax(probabilities, dim=1)
            predictions.append(prediction.item())

    # Aggregate predictions (e.g., majority vote)
    final_prediction = max(set(predictions), key=predictions.count)
    
    # Map prediction to label
    label = "Real" if final_prediction == 0 else "Deepfake"
    
    return label