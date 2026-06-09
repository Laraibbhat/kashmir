# Portfolio Backend - Complete Setup Guide

## Quick Start

### 1. Create Spring Boot Project

Use Spring Initializr (https://start.spring.io/) or command:

```bash
mvn archetype:generate -DgroupId=com.portfolio -DartifactId=portfolio-backend
```

### 2. Navigate and Setup

```bash
cd portfolio-backend
```

### 3. Update pom.xml - Add These Dependencies

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <version>8.0.33</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <scope>runtime</scope>
        <optional>true</optional>
    </dependency>
</dependencies>
```

### 4. Create Folder Structure

```
src/main/java/com/portfolio/backend/
├── entity/
├── dto/
├── repository/
├── service/
├── controller/
├── exception/
├── config/
└── PortfolioBackendApplication.java
```

### 5. Copy All Entity Classes

Copy from the entity/ section below into `src/main/java/com/portfolio/backend/entity/`

### 6. Copy All DTOs

Copy from the dto/ section below into `src/main/java/com/portfolio/backend/dto/`

### 7. Copy Repositories

Copy from the repository/ section below into `src/main/java/com/portfolio/backend/repository/`

### 8. Copy Services

Copy from the service/ section below into `src/main/java/com/portfolio/backend/service/`

### 9. Copy Controllers

Copy from the controller/ section below into `src/main/java/com/portfolio/backend/controller/`

### 10. Copy Exception Handlers

Copy from the exception/ section below into `src/main/java/com/portfolio/backend/exception/`

### 11. Setup application.properties

Create `src/main/resources/application.properties`:

```properties
spring.application.name=portfolio-backend
server.port=8080

spring.datasource.url=jdbc:mysql://localhost:3306/portfolio_app
spring.datasource.username=root
spring.datasource.password=your_password_here
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

logging.level.com.portfolio.backend=DEBUG
```

### 12. Run Backend

```bash
mvn spring-boot:run
```

The backend will start on http://localhost:8080
