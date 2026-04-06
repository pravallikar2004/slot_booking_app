CREATE DATABASE slot_booking;
USE slot_booking;

CREATE TABLE slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    time_slot VARCHAR(50),
    booked BOOLEAN DEFAULT 0,
    booked_by VARCHAR(100)
);