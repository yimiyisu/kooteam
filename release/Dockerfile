FROM eclipse-temurin:17-jre

ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8

WORKDIR /app

COPY kooteam.jar /app/

EXPOSE 7053

CMD ["java","-Dfile.encoding=UTF-8", "-jar", "/app/kooteam.jar"]