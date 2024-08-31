from flask import Flask, render_template, request, redirect, url_for
import os
from werkzeug.utils import secure_filename
from deepfake_detector import predict_deepfake  # Assuming you have a function for prediction

app = Flask(__name__)

app.config['UPLOAD_FOLDER'] = 'uploads/'

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        if 'file' not in request.files:
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            return redirect(request.url)
        if file:
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            result = predict_deepfake(filepath)  # Call your prediction function
            return render_template('result.html', prediction=result)
    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=True)
