from flask import Flask, jsonify, request
import mysql.connector
from config import DB_CONFIG
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)


# Get all slots
@app.route('/')
def home():
    return "✅ Slot Booking API is running!"
@app.route('/api/slots')
def get_slots():
    date = request.args.get('date')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM slots WHERE date=%s", (date,))
    slots = cursor.fetchall()

    return jsonify(slots)

# Book slot
@app.route('/api/book/<int:slot_id>', methods=['POST'])
def book_slot(slot_id):
    data = request.json
    name = data.get("name")

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT booked FROM slots WHERE id=%s", (slot_id,))
    result = cursor.fetchone()

    if result and result[0] == 1:
        return jsonify({"message": "Already booked"}), 400

    cursor.execute(
        "UPDATE slots SET booked=1, booked_by=%s WHERE id=%s",
        (name, slot_id)
    )
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Booked successfully"})


if __name__ == '__main__':
    app.run(debug=True)