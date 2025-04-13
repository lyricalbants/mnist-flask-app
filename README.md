# MNIST Digit Predictor Web App

This repository contains a Flask-based web application that allows users to predict handwritten digits from the MNIST dataset using a pre-trained Convolutional Neural Network (CNN) model converted to ONNX format. Users can either upload their own images or select from a set of sample images.

## Features

- **Image Upload:** Upload your handwritten digit image for prediction.
- **Sample Images:** Preloaded sample images (stored in `static/samples/`) let you quickly test the app.
- **Prediction Visualization:** The predicted digit is displayed along with a probability bar chart (via Chart.js).
- **ONNX Model Inference:** The application uses ONNX Runtime to load and run an ONNX model for predictions.

## Project Structure
mnist-flask-app/ | app.py # Main Flask application  | requirements.txt # List of dependencies |README.md # This README file | static/ │   | css/    │ styles.css # Custom CSS (optional) │   | js/ │   │  script.js # Custom JavaScript │   samples/ # Sample images for predictions │  sample0.png │ sample1.png │  sample2.png │ sample3.png │ sample4.png | templates/ index.html # HTML template for the app


## Installation

### 1. Clone the Repository
git clone https://github.com/lyricalbants/mnist-flask-app
cd mnist-flask-app

### 2. Create a Virtual Environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

### 3. Install the Dependencies
Install all required packages with the following command:
pip install -r requirements.txt

## Running the Application
### 1. Start the Flask Server:
python app.py

### 2. Open the Application in Your Browser:
Navigate to http://localhost:5000 to use the MNIST Digit Predictor.

### 3. Using the App:
Upload: Use the upload form to select and submit an image.

Sample Images: Click on one of the sample images to have it submitted for prediction.

The app will display the predicted digit and a bar chart of the prediction probabilities.

## License
This project is licensed under the MIT License.

## Contributing
Contributions are welcome! Feel free to fork this repository and submit pull requests with improvements.


