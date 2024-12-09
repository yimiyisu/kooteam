FROM openjdk:17-jre-alpine

ENV LANG='en_US.UTF-8' LANGUAGE='en_US:en' LC_ALL='zh_CN.UTF-8'

WORKDIR /app

COPY kooteam.jar /app/

EXPOSE 7053

CMD ["java", "-XX:+UseG1GC -XX:+TieredCompilation  -Xms512m -Xmx512m -jar", "kooteam.jar"]