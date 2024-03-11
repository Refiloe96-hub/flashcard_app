from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Temporary storage for flashcards
flashcards = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/flashcards', methods=['GET', 'POST'])
def manage_flashcards():
    if request.method == 'POST':
        data = request.json
        flashcards.append(data)
        return jsonify(data), 201
    else:
        return jsonify(flashcards)

if __name__ == '__main__':
    app.run(debug=True)
