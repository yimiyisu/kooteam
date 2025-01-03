@echo off

REM 运行jar文件
java -Dfile.encoding=UTF-8 -jar ./kooteam.jar

REM 等待几秒钟，让Java程序启动
timeout /t 5 /nobreak >nul

REM 打开默认浏览器并访问指定地址
start http://127.0.0.1:7053/

REM 按任意键退出
pause