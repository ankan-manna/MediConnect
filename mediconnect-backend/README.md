# MediConnect – Integrated Digital Healthcare Platform (Backend)

Production-grade microservices backend for the MediConnect healthcare SaaS.

## Tech Stack

| Component   | Version  |
|------------|----------|
| Java       | 1.8      |
| Spring Boot| 2.7.x    |
| Maven      | 3.6.3    |
| MySQL      | 8.0      |
| MongoDB    | 6/7      |
| Redis      | 6/7      |
| Kafka      | 2.x/3.x  |

## Architecture (High-Level)

```
                    +------------------+
                    |   API Gateway    |
                    |   (port 8080)   |
                    +--------+--------+
                             |
     +--------+--------+-----+-----+--------+--------+--------+
     |        |        |           |        |        |        |
     v        v        v           v        v        v        v
+--------+ +--------+ +--------+ +--------+ +--------+ +--------+ +--------+
|  Auth  | |Patient | | Doctor | |Appoint| |Pharmacy| |  Lab   | |Notify |
| 8081  | | 8082   | | 8083   | | 8084  | | 8085   | | 8086  | | 8087  |
+--------+ +--------+ +--------+ +--------+ +--------+ +--------+ +--------+
     |        |        |           |        |        |        |
     v        v        v           v        v        v        v
  MySQL   MySQL+    MySQL+      MySQL    MySQL    MySQL+   Redis
          Mongo    Mongo                         Mongo
     |        |        |           |        |        |
     +--------+--------+-----+-----+--------+--------+
                             |
                    +--------v--------+
                    |  Kafka (events) |
                    +----------------+
```

- **API Gateway**: Spring Cloud Gateway; routes and CORS.
- **Auth**: JWT (access + refresh), OTP (Redis), RBAC, login audit.
- **Patient**: Dashboard, health timeline (MongoDB), risk scores, consent.
- **Doctor**: Profile, availability slots, prescriptions (MongoDB); publishes `prescription-created`.
- **Appointment**: Slot booking with Redis distributed lock; publishes `appointment-booked`; ShedLock for expired-appointment job.
- **Pharmacy**: Consumes `prescription-created`; inventory & orders; publishes `order-placed`.
- **Lab**: Test booking; report upload (MongoDB), abnormal detection; publishes `lab-report-uploaded`.
- **Notification**: Consumes Kafka events; email/SMS placeholders; medicine-reminder cron; emergency handler.

## Kafka Topics

- `appointment-booked`
- `prescription-created`
- `lab-report-uploaded`
- `order-placed`
- `emergency-triggered`

## Redis Usage

- OTP storage (TTL)
- Slot locking (appointment-service)
- Caching (e.g. doctor lists)
- Rate limiting (placeholder)
- ShedLock (distributed scheduler)

## Quick Start

**Running locally without Docker?** See **[LOCAL-SETUP.md](LOCAL-SETUP.md)** for MySQL/MongoDB/Redis/Kafka setup, what to replace (e.g. `DB_USER`, `DB_PASSWORD`, `MONGODB_URI`), and how to pass config (env vars or `application-local.yml`).

### 1. Infrastructure (Docker)

```bash
cd mediconnect-backend
docker-compose up -d
```

Starts MySQL (3306), MongoDB (27017), Redis (6379), Zookeeper (2181), Kafka (9092).

### 2. Databases

Create MySQL databases (or use JPA `ddl-auto: update` in dev):

```bash
mysql -u root -p < database/schema-mysql.sql
```

MongoDB collections/indexes: see `database/schema-mongodb.md`.

### 3. Build & Run

```bash
mvn clean install -DskipTests
```

Run each service (from repo root), e.g.:

```bash
java -jar auth-service/target/auth-service-*.jar
java -jar patient-service/target/patient-service-*.jar
# ... etc., or run from IDE
```

Or run API Gateway last; access via `http://localhost:8080`.

### 4. Docker build (from repo root)

```bash
docker build -f auth-service/Dockerfile .
```

Build context must include parent `pom.xml` and `auth-service/` (and for `-pl -am`, other modules as needed). Adjust Dockerfiles if you build from a different context.

## Configuration

- Per-service: `src/main/resources/application.yml` and `application-{dev|prod}.yml`.
- Env overrides: `DB_URL`, `DB_USER`, `DB_PASSWORD`, `MONGODB_URI`, `REDIS_HOST`, `REDIS_PORT`, `KAFKA_BOOTSTRAP`, `JWT_SECRET`, `SERVER_PORT`, etc.

## Security

- Spring Security + JWT filter (auth-service).
- BCrypt password hashing.
- Role-based method-level security (e.g. `@PreAuthorize`).
- CORS and global exception handling.
- Audit logging for login and (placeholder) medical record access.

## Deliverables Checklist

- [x] Parent `pom.xml` and multi-module layout
- [x] auth, patient, doctor, appointment, pharmacy, lab, notification, api-gateway
- [x] JWT and Redis (OTP, slot lock) configuration
- [x] Kafka producer/consumer and topic usage
- [x] MySQL schema and MongoDB document design
- [x] Sample REST endpoints and DTOs
- [x] Dockerfiles and docker-compose
- [x] ShedLock for scheduled jobs (appointment, notification)
- [x] High-level system diagram (above)

## License

Proprietary – MediConnect.
