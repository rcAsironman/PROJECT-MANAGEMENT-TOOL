# Use OpenJDK 17 as the base image (suitable for Java 17 apps)
FROM openjdk:17-jdk-slim AS build

# Set working directory inside the container
WORKDIR /app

# Copy Maven wrapper and pom.xml to avoid downloading dependencies repeatedly
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Install Maven and build the application
RUN ./mvnw clean install -DskipTests

# Copy the compiled JAR file from the target folder
COPY target/pms-0.0.1-SNAPSHOT.jar pms.jar

# Expose the port for the Spring Boot app (default is 8080)
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "/app/pms.jar"]
