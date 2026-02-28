FROM eclipse-temurin:8-jdk-alpine AS build
WORKDIR /workspace
COPY . .
RUN apk add --no-cache maven && mvn -q -pl auth-service -am -DskipTests package -Dmaven.javadoc.skip=true

FROM eclipse-temurin:8-jre-alpine
WORKDIR /app
COPY --from=build /workspace/auth-service/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
