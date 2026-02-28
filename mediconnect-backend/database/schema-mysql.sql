-- MediConnect MySQL Schema (normalized)
-- Run per-service DB or create databases: mediconnect_auth, mediconnect_patient, mediconnect_doctor, mediconnect_appointment, mediconnect_pharmacy, mediconnect_lab

-- ========== AUTH SERVICE ==========
CREATE DATABASE IF NOT EXISTS mediconnect_auth;
USE mediconnect_auth;

CREATE TABLE IF NOT EXISTS roles (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255),
  INDEX idx_role_name (name)
);

CREATE TABLE IF NOT EXISTS users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  full_name VARCHAR(200) NOT NULL,
  user_type VARCHAR(50) NOT NULL,
  abha_id VARCHAR(100),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_phone (phone)
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS login_audit (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  email VARCHAR(255),
  ip_address VARCHAR(100),
  user_agent VARCHAR(500),
  success BOOLEAN,
  login_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_login_time (login_time)
);

-- ========== PATIENT SERVICE (MySQL part) ==========
CREATE DATABASE IF NOT EXISTS mediconnect_patient;
USE mediconnect_patient;

CREATE TABLE IF NOT EXISTS patient_consents (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  patient_user_id BIGINT NOT NULL,
  consent_type VARCHAR(100) NOT NULL,
  granted_to_id BIGINT,
  active BOOLEAN DEFAULT TRUE,
  granted_at TIMESTAMP NULL,
  expires_at TIMESTAMP NULL,
  INDEX idx_patient_consent (patient_user_id, consent_type)
);

-- ========== DOCTOR SERVICE ==========
CREATE DATABASE IF NOT EXISTS mediconnect_doctor;
USE mediconnect_doctor;

CREATE TABLE IF NOT EXISTS doctor_profiles (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE,
  qualification VARCHAR(200),
  specialization VARCHAR(200),
  registration_number VARCHAR(100),
  bio TEXT,
  consultation_fee VARCHAR(50),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  INDEX idx_doctor_user_id (user_id)
);

CREATE TABLE IF NOT EXISTS availability_slots (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  doctor_profile_id BIGINT NOT NULL,
  slot_date DATE,
  start_time TIME,
  end_time TIME,
  status VARCHAR(50) DEFAULT 'AVAILABLE',
  created_at TIMESTAMP NULL,
  INDEX idx_doctor_slot_date (doctor_profile_id, slot_date)
);

-- ========== APPOINTMENT SERVICE ==========
CREATE DATABASE IF NOT EXISTS mediconnect_appointment;
USE mediconnect_appointment;

CREATE TABLE IF NOT EXISTS appointments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  patient_user_id BIGINT NOT NULL,
  doctor_profile_id BIGINT NOT NULL,
  slot_id BIGINT,
  slot_date DATE,
  slot_start_time TIME,
  slot_end_time TIME,
  status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
  reason VARCHAR(500),
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  INDEX idx_patient_appt (patient_user_id, status),
  INDEX idx_doctor_slot (doctor_profile_id, slot_date)
);

-- ========== PHARMACY SERVICE ==========
CREATE DATABASE IF NOT EXISTS mediconnect_pharmacy;
USE mediconnect_pharmacy;

CREATE TABLE IF NOT EXISTS inventory (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  medicine_sku VARCHAR(100) NOT NULL UNIQUE,
  medicine_name VARCHAR(200),
  quantity INT,
  unit VARCHAR(50),
  price_per_unit DOUBLE,
  updated_at TIMESTAMP NULL,
  INDEX idx_medicine_sku (medicine_sku)
);

CREATE TABLE IF NOT EXISTS orders (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  patient_user_id BIGINT NOT NULL,
  prescription_id VARCHAR(100),
  status VARCHAR(50),
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  INDEX idx_order_patient (patient_user_id),
  INDEX idx_order_status (status)
);

CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT NOT NULL,
  medicine_sku VARCHAR(100),
  medicine_name VARCHAR(200),
  quantity INT,
  unit_price DOUBLE,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- ========== LAB SERVICE ==========
CREATE DATABASE IF NOT EXISTS mediconnect_lab;
USE mediconnect_lab;

CREATE TABLE IF NOT EXISTS test_bookings (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  patient_user_id BIGINT NOT NULL,
  test_name VARCHAR(200),
  test_code VARCHAR(50),
  booking_date DATE,
  slot_time TIME,
  status VARCHAR(50),
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  INDEX idx_booking_patient (patient_user_id),
  INDEX idx_booking_date (booking_date)
);
