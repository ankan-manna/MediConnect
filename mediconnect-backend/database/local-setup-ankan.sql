-- Run as MySQL root: mysql -u root -p < database/local-setup-ankan.sql
-- Creates user ankan / Ankan2004 and grants access to all MediConnect databases.

CREATE USER IF NOT EXISTS 'ankan'@'localhost' IDENTIFIED BY 'Ankan2004';

CREATE DATABASE IF NOT EXISTS mediconnect_auth;
CREATE DATABASE IF NOT EXISTS mediconnect_patient;
CREATE DATABASE IF NOT EXISTS mediconnect_doctor;
CREATE DATABASE IF NOT EXISTS mediconnect_appointment;
CREATE DATABASE IF NOT EXISTS mediconnect_pharmacy;
CREATE DATABASE IF NOT EXISTS mediconnect_lab;

GRANT ALL PRIVILEGES ON mediconnect_auth.* TO 'ankan'@'localhost';
GRANT ALL PRIVILEGES ON mediconnect_patient.* TO 'ankan'@'localhost';
GRANT ALL PRIVILEGES ON mediconnect_doctor.* TO 'ankan'@'localhost';
GRANT ALL PRIVILEGES ON mediconnect_appointment.* TO 'ankan'@'localhost';
GRANT ALL PRIVILEGES ON mediconnect_pharmacy.* TO 'ankan'@'localhost';
GRANT ALL PRIVILEGES ON mediconnect_lab.* TO 'ankan'@'localhost';

FLUSH PRIVILEGES;
