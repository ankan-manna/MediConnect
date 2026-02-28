# How to Run MediConnect Backend (Without Docker)

Step-by-step guide to run all backend services locally. For detailed setup (install options, env vars, config), see [LOCAL-SETUP.md](./LOCAL-SETUP.md).

---

## 1. Start Infrastructure

Ensure these are running before starting the backend.

### MySQL, MongoDB, Redis (Homebrew)

If installed via Homebrew:

```bash
brew services start mysql@8.0
brew services start mongodb-community
brew services start redis
```

Check status:

```bash
brew services list
```

### Kafka (two terminals)

Kafka requires **Zookeeper** first, then the **Kafka broker**. Use two terminals.

**Terminal 1 – Zookeeper**

```bash
cd /usr/local/kafka
bin/zookeeper-server-start.sh config/zookeeper.properties
```

Leave this running.

**Terminal 2 – Kafka**

```bash
cd /usr/local/kafka
bin/kafka-server-start.sh config/server.properties
```

Leave this running.

> If Kafka is installed via Homebrew, use the paths reported by `brew list kafka | grep properties` (e.g. `/opt/homebrew/etc/kafka/` on Apple Silicon).

Verify Kafka:

```bash
kafka-topics --bootstrap-server localhost:9092 --list
```

---

## 2. One-Time MySQL Setup

From the project root (`mediconnect-backend`).

### Create user and databases

Connect as root. On macOS, use `-h 127.0.0.1` if socket connection fails:

```bash
mysql -u root -h 127.0.0.1 -p
```

Then run:

```sql
CREATE USER IF NOT EXISTS 'mediconnect'@'localhost' IDENTIFIED BY 'mediconnect';
CREATE USER IF NOT EXISTS 'mediconnect'@'127.0.0.1' IDENTIFIED BY 'mediconnect';

CREATE DATABASE IF NOT EXISTS mediconnect_auth;
CREATE DATABASE IF NOT EXISTS mediconnect_patient;
CREATE DATABASE IF NOT EXISTS mediconnect_doctor;
CREATE DATABASE IF NOT EXISTS mediconnect_appointment;
CREATE DATABASE IF NOT EXISTS mediconnect_pharmacy;
CREATE DATABASE IF NOT EXISTS mediconnect_lab;

GRANT ALL PRIVILEGES ON mediconnect_auth.* TO 'mediconnect'@'localhost';
GRANT ALL PRIVILEGES ON mediconnect_patient.* TO 'mediconnect'@'localhost';
GRANT ALL PRIVILEGES ON mediconnect_doctor.* TO 'mediconnect'@'localhost';
GRANT ALL PRIVILEGES ON mediconnect_appointment.* TO 'mediconnect'@'localhost';
GRANT ALL PRIVILEGES ON mediconnect_pharmacy.* TO 'mediconnect'@'localhost';
GRANT ALL PRIVILEGES ON mediconnect_lab.* TO 'mediconnect'@'localhost';

GRANT ALL PRIVILEGES ON mediconnect_auth.* TO 'mediconnect'@'127.0.0.1';
GRANT ALL PRIVILEGES ON mediconnect_patient.* TO 'mediconnect'@'127.0.0.1';
GRANT ALL PRIVILEGES ON mediconnect_doctor.* TO 'mediconnect'@'127.0.0.1';
GRANT ALL PRIVILEGES ON mediconnect_appointment.* TO 'mediconnect'@'127.0.0.1';
GRANT ALL PRIVILEGES ON mediconnect_pharmacy.* TO 'mediconnect'@'127.0.0.1';
GRANT ALL PRIVILEGES ON mediconnect_lab.* TO 'mediconnect'@'127.0.0.1';

FLUSH PRIVILEGES;
EXIT;
```

### Apply schema (tables)

```bash
mysql -u root -h 127.0.0.1 -p < database/schema-mysql.sql
```

---

## 3. Build the Project

From the project root:

```bash
cd mediconnect-backend
mvn clean package -DskipTests
```

---

## 4. Start Backend Services

Use the same environment for all services. From the project root:

```bash
export DB_USER=mediconnect
export DB_PASSWORD=mediconnect
export KAFKA_BOOTSTRAP=localhost:9092
export REDIS_HOST=localhost
export REDIS_PORT=6379
```

Start each service in its **own terminal** (or run in background). Start **API Gateway last**, after the others are up.

| Order | Service        | Port | Command |
|-------|----------------|------|---------|
| 1     | Auth           | 8081 | `java -jar auth-service/target/auth-service-1.0.0-SNAPSHOT.jar --spring.profiles.active=dev` |
| 2     | Patient        | 8082 | `java -jar patient-service/target/patient-service-1.0.0-SNAPSHOT.jar --spring.profiles.active=dev` |
| 3     | Doctor         | 8083 | `java -jar doctor-service/target/doctor-service-1.0.0-SNAPSHOT.jar --spring.profiles.active=dev` |
| 4     | Appointment    | 8084 | `java -jar appointment-service/target/appointment-service-1.0.0-SNAPSHOT.jar --spring.profiles.active=dev` |
| 5     | Pharmacy       | 8085 | `java -jar pharmacy-service/target/pharmacy-service-1.0.0-SNAPSHOT.jar --spring.profiles.active=dev` |
| 6     | Lab            | 8086 | `java -jar lab-service/target/lab-service-1.0.0-SNAPSHOT.jar --spring.profiles.active=dev` |
| 7     | Notification   | 8087 | `java -jar notification-service/target/notification-service-1.0.0-SNAPSHOT.jar --spring.profiles.active=dev` |
| 8     | **API Gateway**| 8080 | `java -jar api-gateway/target/api-gateway-1.0.0-SNAPSHOT.jar --spring.profiles.active=dev` |

### One-liner per service (with env)

Copy and run in separate terminals (replace the jar path if your version differs):

```bash
# From mediconnect-backend/
export DB_USER=mediconnect DB_PASSWORD=mediconnect KAFKA_BOOTSTRAP=localhost:9092 REDIS_HOST=localhost REDIS_PORT=6379

# Then, one per terminal:
java -jar auth-service/target/auth-service-1.0.0-SNAPSHOT.jar --spring.profiles.active=dev
java -jar patient-service/target/patient-service-1.0.0-SNAPSHOT.jar --spring.profiles.active=dev
java -jar doctor-service/target/doctor-service-1.0.0-SNAPSHOT.jar --spring.profiles.active=dev
java -jar appointment-service/target/appointment-service-1.0.0-SNAPSHOT.jar --spring.profiles.active=dev
java -jar pharmacy-service/target/pharmacy-service-1.0.0-SNAPSHOT.jar --spring.profiles.active=dev
java -jar lab-service/target/lab-service-1.0.0-SNAPSHOT.jar --spring.profiles.active=dev
java -jar notification-service/target/notification-service-1.0.0-SNAPSHOT.jar --spring.profiles.active=dev
java -jar api-gateway/target/api-gateway-1.0.0-SNAPSHOT.jar --spring.profiles.active=dev
```

---

## 5. Verify

- **API entry point:** [http://localhost:8080](http://localhost:8080) (via API Gateway)
- **Health checks:**  
  `http://localhost:8080/actuator/health`  
  `http://localhost:8081/actuator/health` … `http://localhost:8087/actuator/health`

---

## 6. Port Summary

| Port | Service        |
|------|----------------|
| 8080 | API Gateway    |
| 8081 | Auth           |
| 8082 | Patient        |
| 8083 | Doctor         |
| 8084 | Appointment    |
| 8085 | Pharmacy       |
| 8086 | Lab            |
| 8087 | Notification   |

---

## 7. Troubleshooting

- **MySQL "Can't connect through socket"**  
  Use `-h 127.0.0.1` when running `mysql` and, if needed, set `DB_URL` in apps to use `127.0.0.1` instead of `localhost`.

- **Kafka log permission errors**  
  Ensure the Kafka process can write to its log directory, e.g.  
  `sudo chown -R $(whoami) /usr/local/kafka/logs` and `mkdir -p /usr/local/kafka/logs`.

- **Different MySQL user/password**  
  Set `DB_USER` and `DB_PASSWORD` before starting each service, or use `application-local.yml` as in [LOCAL-SETUP.md](./LOCAL-SETUP.md).

- **Port in use**  
  Stop the process using the port or set `SERVER_PORT` for that service.

For full configuration and environment variables, see [LOCAL-SETUP.md](./LOCAL-SETUP.md).
