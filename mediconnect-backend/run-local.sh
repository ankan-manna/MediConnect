#!/usr/bin/env bash
# Run MediConnect backend locally (no Docker).
# Prerequisites: MySQL, MongoDB, Redis running. Kafka optional for full event flow.
# MySQL user: ankan / Ankan2004 (create with database/local-setup-ankan.sql)

set -e
cd "$(dirname "$0")"
BASE="$(pwd)"
PROFILES="dev,local"

# Start each service in background. Stop with: pkill -f "mediconnect"
start_service() {
  local name=$1
  local jar=$2
  if [ ! -f "$jar" ]; then
    echo "Build first: mvn -DskipTests package"
    exit 1
  fi
  echo "Starting $name..."
  java -jar "$jar" --spring.profiles.active="$PROFILES" &
  echo $! >> "$BASE/.service-pids"
  sleep 3
}

echo "Using profiles: $PROFILES (MySQL user ankan, password Ankan2004)"
echo "Ensure MySQL, MongoDB, Redis are running. Kafka required for doctor/appointment/pharmacy/lab/notification."
rm -f .service-pids

# Build if needed
if [ ! -f auth-service/target/auth-service-*.jar ]; then
  mvn -q -DskipTests package
fi

# Start in order (gateway last)
start_service "auth-service"         "auth-service/target/auth-service-1.0.0-SNAPSHOT.jar"
start_service "patient-service"      "patient-service/target/patient-service-1.0.0-SNAPSHOT.jar"
start_service "doctor-service"       "doctor-service/target/doctor-service-1.0.0-SNAPSHOT.jar"
start_service "appointment-service" "appointment-service/target/appointment-service-1.0.0-SNAPSHOT.jar"
start_service "pharmacy-service"     "pharmacy-service/target/pharmacy-service-1.0.0-SNAPSHOT.jar"
start_service "lab-service"          "lab-service/target/lab-service-1.0.0-SNAPSHOT.jar"
start_service "notification-service" "notification-service/target/notification-service-1.0.0-SNAPSHOT.jar"
start_service "api-gateway"          "api-gateway/target/api-gateway-1.0.0-SNAPSHOT.jar"

echo ""
echo "All services started. API Gateway: http://localhost:8080"
echo "To stop: kill \$(cat .service-pids) 2>/dev/null; rm -f .service-pids"
