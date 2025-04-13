from flask import Flask, request, render_template, jsonify
import os
import numpy as np
from PIL import Image
import onnxruntime as ort

# Initialize the Flask app
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = "uploads"
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Load the ONNX model at startup
onnx_session = ort.InferenceSession("mnist_model.onnx")

def preprocess_image(image_path):
    """
    Open an image, convert it to grayscale, resize to 28x28,
    normalize pixel values, and return it with shape (28, 28, 1)
    """
    image = Image.open(image_path).convert('L').resize((28, 28))
    image_np = np.array(image).astype('float32') / 255.0
    # Expand dimensions for channel info
    return np.expand_dims(image_np, axis=-1)

def predict_digit(image_array):
    """
    Add a batch dimension to the preprocessed image and run inference.
    Return the output probabilities.
    """
    image_array = np.expand_dims(image_array, axis=0)
    input_name = onnx_session.get_inputs()[0].name
    outputs = onnx_session.run(None,{input_name: image_array})
    return outputs[0]

@app.route('/')
def index():
    """
    Render the home page where users can upload an image.
    """
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    """
    Accept an uploaded image, preprocess it, run inference via the ONNX model,
    and return the result as JSON.
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file in the request.'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected for uploading.'}), 400

    # Save the file temporarily
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)

    try:
        # Preprocess the image and perform prediction
        preprocessed_image = preprocess_image(file_path)
        probabilities = predict_digit(preprocessed_image)
        predicted_digit = int(np.argmax(probabilities))

        result = {
            'predicted_digit': predicted_digit,
            'probabilities': probabilities.tolist()[0]
        }
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict_sample', methods=['GET'])
def predict_sample():
    # Get the sample image filename from the query parameter
    sample_image = request.args.get('image')
    if not sample_image:
        return jsonify({'error': 'No sample image specified.'}), 400

    # Construct the full path (assuming samples are stored in static/samples/)
    sample_path = os.path.join(app.root_path, 'static', sample_image)
    if not os.path.exists(sample_path):
        return jsonify({'error': 'Sample image not found.'}), 404

    try:
        processed_image = preprocess_image(sample_path)
        probabilities = predict_digit(processed_image)
        predicted_digit = int(np.argmax(probabilities))
        
        result = {
            'predicted_digit': predicted_digit,
            'probabilities': probabilities.tolist()[0]
        }
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)