#!/bin/bash
port=7053
file=update.tar.gz

if [ -f ${file} ];then
rm ${file}
fi

wget -P ./ https://a.yimiyisu.com/apps/kooteam/${file}
tar -xvf ${file}

lsof -i:${port}|cut -c 9-13|grep -v PID|xargs kill -9

java -jar ./kooteam.jar &