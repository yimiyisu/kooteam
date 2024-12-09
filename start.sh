#!/bin/bash
SERVICE=kooteam
MEMORY=256m

Download() {
    APP_FILE=./${SERVICE}.tar.gz
    if [ -e ${APP_FILE} ];then rm -rf ${APP_FILE};fi
    # version=`cat ./config/version`
    # result=$(curl -G 'https://a.ebus.vip/apps/kooteam.jar?v='${version})
    result=$(curl -G 'https://a.ebus.vip/apps/kooteam.jar')
    if [ $result = 'newly'  ];then
      echo 'Kooteam version is up to date'
      exit 5
    else
      curl -L -o ${APP_FILE} ${result}
      tar -xvf ${APP_FILE}
    fi
}

Start() {
    proc=$(ps -ef | grep ${SERVICE}.jar | grep -v grep | wc -l)
    if [ $proc != 0  ];then
      sleep 3
      echo 'Kooteam Is Runing'
      exit 5
    else
      nohub exec java -server -Xms${MEMORY} -Xmx${MEMORY}  -jar ./${SERVICE}.jar >> ./${SERVICE}.log 2>&1 &
      echo 'Starting Success'
    fi
}

Stop() {
    ps aux | grep ${SERVICE}.jar | grep -v grep | awk '{print $2}'| xargs kill -9
    sleep 3
    proc=$(ps -ef | grep ${SERVICE}.jar | grep -v grep | wc -l)
    if [ $proc != 0 ];then
        ps -ef | grep ${SERVICE}.jar | grep -v grep | awk '{print $2}'| xargs kill -9
    fi
    echo 'Kooteam Stoped'
}
Install() {
    Stop
    Download
    Start
}
Restart() {
    Stop
    Start
}

case $1 in
    start|run)
        Start
        ;;
    stop)
        Stop
        ;;
    download)
        Download
        ;;
    upgrade)
        Install
        ;;
    restart)
        Restart
        ;;
    *)
        Start
        ;;
esac