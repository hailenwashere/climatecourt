from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/submit', methods=['POST'])
def submit_sin():
    data = request.get_json()
    # Process the climate sin submission
    return jsonify({"message": "Received", "data": data})

@app.route('/')
def home():
    return "<h1>Welcome to Climate Court Backend!</h1><p>The API is running.</p>"

if __name__ == '__main__':
    app.run(port=5000)