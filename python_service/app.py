import os
import time
import random
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__)
# Enable CORS for the Node.js backend
CORS(app)

# Configuration for temporary uploads
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Python AI Service initialized. Upload folder: {UPLOAD_FOLDER}")
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max file size

def simulate_efficientnet_analysis(file_path, filename):
    """
    Simulates the behavior of the EfficientNet-B0 deepfake detection model.
    In a real scenario, this would:
    1. Extract frames using OpenCV (cv2.VideoCapture)
    2. Detect faces using MTCNN or dlib
    3. Run facial crops through the pretrained PyTorch/TensorFlow model
    4. Average the predictions to get a final video-level confidence score
    """
    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Starting Deepfake Analysis on: {filename}")
    
    # 1. Simulate Frame Extraction Delay (approx 1-2 seconds)
    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Extracting frames from video...")
    time.sleep(random.uniform(1.0, 2.0))
    frames_extracted = random.randint(20, 60)
    
    # 2. Simulate AI Model Inference Delay (approx 1-2.5 seconds)
    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Running EfficientNet-B0 inference on {frames_extracted} face crops...")
    time.sleep(random.uniform(1.0, 2.5))
    
    # 3. Generate Mock Confidence Score
    # We bias the random generator slightly to provide a good mix of fake/real results for demo purposes
    is_fake = random.random() > 0.4 
    
    if is_fake:
        # High confidence it's a deepfake (70% - 99%)
        confidence_score = random.randint(70, 99)
        prediction = 'Fake'
    else:
        # Low confidence it's a deepfake -> Authentic (3% - 30%)
        # Occasional "inconclusive" scores around 40-60%
        if random.random() > 0.8:
            confidence_score = random.randint(40, 60)
        else:
            confidence_score = random.randint(3, 30)
        prediction = 'Real'
        
    processing_time = round(random.uniform(2.0, 4.5), 1)
    
    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Analysis Complete. Result: {prediction} ({confidence_score}%)")
    
    return {
        'confidence_score': confidence_score,
        'prediction': prediction,
        'frames_analyzed': frames_extracted,
        'processing_time': f"{processing_time}s"
    }

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "TruthLens Python AI Service is running"}), 200

@app.route('/analyze', methods=['POST'])
def analyze_video():
    content_length = request.content_length or 0
    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Received /analyze request. Payload size: {content_length / (1024*1024):.2f} MB")
    
    # Check if a file was uploaded
    if 'video' not in request.files:
        return jsonify({"error": "No video file provided in the request"}), 400
        
    file = request.files['video']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if file:
        try:
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            
            # Save file temporarily
            file.save(file_path)
            
            # Run the (simulated) deep learning analysis
            result = simulate_efficientnet_analysis(file_path, filename)
            
            # Cleanup the temporary file
            try:
                os.remove(file_path)
            except OSError as e:
                print(f"Error removing file {file_path}: {e}")
                
            return jsonify({
                "success": True,
                "data": result
            }), 200
            
        except Exception as e:
            print(f"An error occurred during analysis: {e}")
            return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting TruthLens AI Microservice on Port 5001...")
    # Run securely to avoid overlapping with Node dev server on 5000
    app.run(host='127.0.0.1', port=5001, debug=True)
