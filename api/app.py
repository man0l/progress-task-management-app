from flask import Flask
from database import init_db
from dotenv import load_dotenv
load_dotenv()

init_db()
app = Flask(__name__)

@app.route('/')
def hello():
    return 'hello'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
