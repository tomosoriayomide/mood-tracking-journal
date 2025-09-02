from flask import Flask, request, jsonify, send_from_directory
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import mysql.connector
import os

app = Flask(__name__, static_folder='static', static_url_path='')
bcrypt = Bcrypt(app)
CORS(app) # Enable CORS for all routes

# Database connection details from environment variables
db_config = {
    'host': os.environ.get('DB_HOST'),
    'user': os.environ.get('DB_USER'),
    'password': os.environ.get('DB_PASSWORD'),
    'database': os.environ.get('DB_NAME')
}

# --- Utility Functions ---
def get_db_connection():
    """Establishes a connection to the database."""
    try:
        return mysql.connector.connect(**db_config)
    except mysql.connector.Error as err:
        print(f"Error connecting to database: {err}")
        return None

# --- API Routes ---
@app.route('/api/register', methods=['POST'])
def register():
    """Handles new user registration."""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    conn = get_db_connection()
    if conn is None:
        return jsonify({'message': 'Failed to connect to the database'}), 500
    
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        if cursor.fetchone():
            return jsonify({'message': 'Username already exists'}), 409

        cursor.execute(
            "INSERT INTO users (username, password_hash) VALUES (%s, %s)",
            (username, hashed_password)
        )
        conn.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    except mysql.connector.Error as err:
        return jsonify({'message': f'Database error: {err}'}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    """Handles user login."""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({'message': 'Failed to connect to the database'}), 500
    
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()

        if user and bcrypt.check_password_hash(user['password_hash'], password):
            return jsonify({'message': 'Login successful'}), 200
        else:
            return jsonify({'message': 'Invalid username or password'}), 401
    except mysql.connector.Error as err:
        return jsonify({'message': f'Database error: {err}'}), 500
    finally:
        cursor.close()
        conn.close()

# Route to serve the main HTML page
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'login.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
