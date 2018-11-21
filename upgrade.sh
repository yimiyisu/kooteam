#!/bin/bash
port=7053
file=./latest.gz

if [ -f ${file} ];then
rm ./latest.gz
fi

wget -P ./ https://a.yimiyisu.com/apps/kooteam/latest.gz
tar -xvf ${file}

lsof -i:${port}|cut -c 9-13|grep -v PID|xargs kill -9

java -jar ./kooteam.jar &