# Running MediConnect Backend Locally (Without Docker)

This guide covers what you need to install, configure, and replace to run all services on your machine **without** using docker-compose.

---

## 1. Prerequisites – What Must Be Running

You need these running locally (install via Homebrew, installers, or official packages):

| Service   | Default port | Used by |
|-----------|--------------|--------|
| **MySQL** | 3306         | auth, patient, doctor, appointment, pharmacy, lab |
| **MongoDB** | 27017      | patient, doctor, lab |
| **Redis** | 6379          | auth, doctor, appointment, notification |
| **Kafka** (+ Zookeeper) | 9092 (Kafka), 2181 (Zookeeper) | doctor, appointment, pharmacy, lab, notification |

---

## 2. MySQL Setup

### 2.1 Install and start MySQL (e.g. 8.0)

```bash
# macOS (Homebrew)
brew install mysql@8.0
brew services start mysql@8.0
```

### 2.2 Create user and databases

Log in as root (or admin):

```bash
mysql -u root -p
```

Run (replace `your_mysql_user` and `your_mysql_password` with your choice).  
To use the **default** config (no env vars): create user `mediconnect` with password `mediconnect` and use that in the GRANTs below.

```sql
-- Create user (use your desired username and password)
CREATE USER IF NOT EXISTS 'your_mysql_user'@'localhost' IDENTIFIED BY 'your_mysql_password';

-- Create all 6 databases and grant access
CREATE DATABASE IF NOT EXISTS mediconnect_auth;
CREATE DATABASE IF NOT EXISTS mediconnect_patient;
CREATE DATABASE IF NOT EXISTS mediconnect_doctor;
CREATE DATABASE IF NOT EXISTS mediconnect_appointment;
CREATE DATABASE IF NOT EXISTS mediconnect_pharmacy;
CREATE DATABASE IF NOT EXISTS mediconnect_lab;

GRANT ALL PRIVILEGES ON mediconnect_auth.* TO 'your_mysql_user'@'localhost';
GRANT ALL PRIVILEGES ON mediconnect_patient.* TO 'your_mysql_user'@'localhost';
GRANT ALL PRIVILEGES ON mediconnect_doctor.* TO 'your_mysql_user'@'localhost';
GRANT ALL PRIVILEGES ON mediconnect_appointment.* TO 'your_mysql_user'@'localhost';
GRANT ALL PRIVILEGES ON mediconnect_pharmacy.* TO 'your_mysql_user'@'localhost';
GRANT ALL PRIVILEGES ON mediconnect_lab.* TO 'your_mysql_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2.3 Create tables

From the project root:

```bash
mysql -u your_mysql_user -p < database/schema-mysql.sql
```

(Or open `database/schema-mysql.sql` and run it in your MySQL client.)

### 2.4 What to set for the apps

Each service reads MySQL from **environment variables** (or uses defaults):

| Variable    | Default (per service) | Replace with (example) |
|------------|------------------------|-------------------------|
| `DB_USER`  | `mediconnect`          | `your_mysql_user`       |
| `DB_PASSWORD` | `mediconnect`       | `your_mysql_password`   |
| `DB_URL`   | `jdbc:mysql://localhost:3306/mediconnect_<service>?useSSL=false&serverTimezone=UTC` | Only if MySQL is not on localhost:3306 (e.g. different host/port or DB name). |

Each service has its own database name in the default `DB_URL` (e.g. `mediconnect_auth`, `mediconnect_patient`). If you keep the same DB names and only change user/password, set **only**:

- `DB_USER`
- `DB_PASSWORD`

---

## 3. MongoDB Setup

### 3.1 Install and start MongoDB

```bash
# macOS (Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

Default: `mongodb://localhost:27017` (no auth).

### 3.2 What to set for the apps

| Variable      | Default (per service) | Replace with (example) |
|---------------|------------------------|-------------------------|
| `MONGODB_URI` | `mongodb://localhost:27017/mediconnect_<service>` | Only if MongoDB has auth or different host/port, e.g. `mongodb://username:password@localhost:27017/mediconnect_patient` or `mongodb://localhost:27018/mediconnect_patient`. |

- **Patient service** uses DB: `mediconnect_patient`
- **Doctor service** uses DB: `mediconnect_doctor`
- **Lab service** uses DB: `mediconnect_lab`

If you run MongoDB locally on port 27017 with no auth, you **don’t need to set** `MONGODB_URI`; the defaults are fine.

---

## 4. Redis Setup

### 4.1 Install and start Redis

```bash
# macOS (Homebrew)
brew install redis
brew services start redis
```

Default: `localhost:6379`.

### 4.2 What to set for the apps

| Variable      | Default   | Replace with (example) |
|---------------|-----------|-------------------------|
| `REDIS_HOST`  | `localhost` | If Redis is on another host. |
| `REDIS_PORT`  | `6379`    | If Redis is on another port. |

If Redis is on `localhost:6379`, you don’t need to set these.

---

## 5. Kafka (and Zookeeper) Setup

Kafka is required for **doctor**, **appointment**, **pharmacy**, **lab**, and **notification** services (event publishing). **Auth-service** can run without Kafka when using the `local` profile.

### 5.1 Which version to use

- **Spring Boot 2.7** (this project) works with **Kafka broker 2.8+ or 3.x**.
- **Recommended for local**: install whatever **Homebrew** provides (e.g. **Kafka 3.6 / 3.7**). No need to pin a specific broker version for dev.

### 5.2 Install (macOS – Homebrew)

```bash
brew install kafka
```

This installs both **Zookeeper** and **Kafka**. Check the version if you like:

```bash
kafka-topics --version
```

### 5.3 Run Kafka locally

Kafka needs **Zookeeper** running first, then the **Kafka server**.

**Option A – Two terminals**

```bash
# Terminal 1 – start Zookeeper
zookeeper-server-start /opt/homebrew/etc/kafka/zookeeper.properties
```

Leave that running. In a second terminal:

```bash
# Terminal 2 – start Kafka
kafka-server-start /opt/homebrew/etc/kafka/server.properties
```

**Option B – Single command (run in background)**

```bash
# Start Zookeeper in background, then Kafka
zookeeper-server-start /opt/homebrew/etc/kafka/zookeeper.properties &
sleep 3
kafka-server-start /opt/homebrew/etc/kafka/server.properties &
```

**Paths:** On **Intel Macs** Homebrew often uses `/usr/local`; use `/usr/local/etc/kafka/` instead of `/opt/homebrew/etc/kafka/`. To find the path:

```bash
brew list kafka | grep properties
```

Default Kafka listener: **`localhost:9092`**.

### 5.4 What to set for the apps (`KAFKA_BOOTSTRAP`)

| Variable         | Default          | For local (no change needed if Kafka is on same machine) |
|------------------|------------------|----------------------------------------------------------|
| `KAFKA_BOOTSTRAP_SERVERS` or `KAFKA_BOOTSTRAP` | `localhost:9092` | Use `localhost:9092` when Kafka runs on your machine.   |

If you use **`application-local.yml`** and want to set it explicitly:

```yaml
spring:
  kafka:
    bootstrap-servers: localhost:9092
```

Or via environment when starting a service:

```bash
export KAFKA_BOOTSTRAP_SERVERS=localhost:9092
java -jar doctor-service/target/doctor-service-*.jar --spring.profiles.active=dev,local
```

(Spring Kafka reads `spring.kafka.bootstrap-servers`; some apps may also support a custom `KAFKA_BOOTSTRAP` env var that maps to it.)

### 5.5 Quick check that Kafka is up

```bash
# List topics (should not error)
kafka-topics --bootstrap-server localhost:9092 --list
```

---

## 6. JWT Secret (optional)

| Variable     | Default (long string in code) | Replace with (example) |
|-------------|--------------------------------|-------------------------|
| `JWT_SECRET` | (in application.yml)          | Any long secret (e.g. 32+ chars) for production. For local dev you can leave default. |

---

## 7. How to Pass These Values When Running Locally

You have two main options.

### Option A – Environment variables (recommended)

Before starting each service, export your overrides. Example (Unix/macOS) with **custom MySQL user/password only**:

```bash
export DB_USER=your_mysql_user
export DB_PASSWORD=your_mysql_password
# Optional if not default:
# export MONGODB_URI=mongodb://localhost:27017
# export REDIS_HOST=localhost
# export KAFKA_BOOTSTRAP=localhost:9092
```

Then run the service, e.g.:

```bash
cd mediconnect-backend
mvn -pl auth-service -am -DskipTests package
cd auth-service && java -jar target/auth-service-*.jar
```

Repeat for each service (or use one shell script that exports once and starts all).

### Option B – Per-service `application-local.yml`

Create a file that overrides only what you need, so you don’t rely on env vars at runtime.

1. In each service’s `src/main/resources/`, add `application-local.yml`.
2. Set **active profile** to include `local` when you run (e.g. `--spring.profiles.active=dev,local`), or make `local` the default in that file.

Example **auth-service/src/main/resources/application-local.yml**:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mediconnect_auth?useSSL=false&serverTimezone=UTC
    username: your_mysql_user
    password: your_mysql_password
  data:
    redis:
      host: localhost
      port: 6379
```

Example **patient-service/src/main/resources/application-local.yml** (MySQL + MongoDB):

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mediconnect_patient?useSSL=false&serverTimezone=UTC
    username: your_mysql_user
    password: your_mysql_password
  data:
    mongodb:
      uri: mongodb://localhost:27017/mediconnect_patient
```

Do the same for **doctor**, **appointment**, **pharmacy**, **lab** (MySQL; doctor and lab also have MongoDB URIs). **Notification** only needs Redis and Kafka. **API Gateway** has no DB; it only needs to point to the right service URLs (already `http://localhost:8081` etc.).

Run with:

```bash
java -jar target/auth-service-*.jar --spring.profiles.active=dev,local
```

(Add `local` to the default `spring.profiles.active` in each service’s main `application.yml` if you prefer not to pass it every time.)

---

## 8. Checklist – Minimum to Run Locally (No Docker)

1. **Install & start**: MySQL 8, MongoDB, Redis, Kafka (+ Zookeeper).
2. **MySQL**: Create user + 6 databases, run `database/schema-mysql.sql`, set `DB_USER` and `DB_PASSWORD` (or put them in `application-local.yml`).
3. **MongoDB**: If not localhost:27017 or with auth, set `MONGODB_URI` (or equivalent in `application-local.yml`) for patient, doctor, lab.
4. **Redis**: Default localhost:6379 is fine; otherwise set `REDIS_HOST` / `REDIS_PORT`.
5. **Kafka**: Default localhost:9092 is fine; otherwise set `KAFKA_BOOTSTRAP`.
6. **JWT**: Optional; set `JWT_SECRET` only if you want a custom secret.
7. **Ports**: Services use 8080 (gateway), 8081–8087 (auth, patient, doctor, appointment, pharmacy, lab, notification). Ensure these ports are free.
8. Start services in any order, but **start API Gateway last** (after all backend services are up). Access the API at **http://localhost:8080**.

---

## 9. Quick Reference – All Variables

| Variable           | Where used        | Default / example |
|--------------------|-------------------|--------------------|
| `DB_URL`           | All MySQL services | `jdbc:mysql://localhost:3306/mediconnect_<service>?useSSL=false&serverTimezone=UTC` |
| `DB_USER`          | All MySQL services | `mediconnect` → replace with your MySQL user |
| `DB_PASSWORD`      | All MySQL services | `mediconnect` → replace with your MySQL password |
| `MONGODB_URI`      | patient, doctor, lab | `mongodb://localhost:27017/mediconnect_<service>` |
| `REDIS_HOST`       | auth, doctor, appointment, notification | `localhost` |
| `REDIS_PORT`       | same as above      | `6379` |
| `KAFKA_BOOTSTRAP`  | doctor, appointment, pharmacy, lab, notification | `localhost:9092` |
| `JWT_SECRET`       | auth-service      | (long default in application.yml) |
| `SERVER_PORT`      | any service       | 8080 (gateway), 8081–8087 (others) |
| `SPRING_PROFILES_ACTIVE` | any        | `dev` |

Replace at least **MySQL user and password** (and MongoDB URI if not default) so that the app uses your local MySQL/MongoDB instead of the defaults.
