FROM eclipse-temurin:8-jdk-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN apk add --no-cache maven && mvn -q -DskipTests package -Dmaven.javadoc.skip=true && cp target/*.jar app.jar
FROM eclipse-temurin:8-jre-alpine
WORKDIR /app
COPY --from=build /app/app.jar .
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]
