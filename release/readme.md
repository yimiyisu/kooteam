# 安装说明

## 创建应用数据库 kooteam

- 系统初次安装是时，把 init.sql 初始化到数据库中，👀 系统升级时不需要执行初始化 SQL

## 选择安装模式

- Dockerfile ，docker 安装模板文件
- start.sh 本地 jdk 17 直接启动应用的脚本
- kooteam.service 配置 kooteam 系统自服务脚本，👀 需要按实际路径修改脚本里路径

## 配置 nginx 前置代理（可选操作）

- nginx-kooteam.conf 给 kooteam 配置前置代理的文件，👀 代理域名需要改成实际域名
- kooteam.jar 应用的程序文件
