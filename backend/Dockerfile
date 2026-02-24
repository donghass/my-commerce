FROM amazoncorretto:17

WORKDIR /app

COPY build/libs/*.jar app.jar

EXPOSE 8080

ENV TZ=Asia/Seoul
ENV SPRING_PROFILES_ACTIVE=prod

ENTRYPOINT ["java", "-jar", "-Duser.timezone=Asia/Seoul", "app.jar"]
