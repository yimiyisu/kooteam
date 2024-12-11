# 文件说明

- Dockerfile ，docker安装模板文件
- start.sh 基于本地jdk 17直接启动应用的脚本
- kooteam.service 配置kooteam系统自服务脚本，👀需要按实际路径修改脚本里路径
- nginx-kooteam.conf 给kooteam配置前置代理的文件，👀代理域名需要改成实际域名
- 👀init.sql 系统初次安装的初始化SQL，系统升级时不能执行该脚本【☠️】
- kooteam.jar 应用的程序文件