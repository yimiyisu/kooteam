# 产品介绍

- kooteam 是一款轻量级的在线团队协作工具，提供各类文档工具、在线思维导图、在线流程图、项目管理、任务分发，知识库管理，周报日报管理等工具。
- kooteam 支持钉钉，企业微信等账号同步登陆，支持私有化部署，守护企业数据所有权。

# 体验地址 [https://abc.yimiyisu.com](https://abc.yimiyisu.com)

# [gitee 源码地址](https://gitee.com/yimiyisu/kooteam)

# 功能简介

**1. 待办四象限：突出事情优先级，帮助员工合理安排时间，提高工作效率**
![待办四象限：突出事情优先级，帮助员工合理安排时间，提高工作效率](https://images.gitee.com/uploads/images/2020/0401/145234_27d3043d_472.jpeg)

**2. 在线流程图：在线流程图工具，使用方便**
![在线流程图：在线流程图工具，使用方便](https://images.gitee.com/uploads/images/2020/0401/145236_7ff14512_472.jpeg)

**3. 在线思维导图：梳理思路，优化工作流程**
![在线思维导图：梳理思路，优化工作流程](https://images.gitee.com/uploads/images/2020/0401/145237_69870064_472.jpeg)

**4. 项目管理：自定义项目看板，可视化任务安排**
![项目管理：自定义项目看板，可视化任务安排](https://images.gitee.com/uploads/images/2020/0401/145234_a7d7681b_472.jpeg)

**5. 在线知识库：在线流程图，在线文档，以及可视化的目录编排，文档管理无忧**
![在线知识库：在线流程图，在线文档，以及可视化的目录编排，文档管理无忧](https://images.gitee.com/uploads/images/2020/0401/145236_3368ae12_472.jpeg)

# 本项目基于以下开源项目

- Http Server (Apache 2.0 协议) [smart-http](https://gitee.com/wwtbnbw6688/smart-http)
- 文本编辑器 (GNU 定制协议) [tinymce](https://github.com/tinymce/tinymce)
- 思维导图（MIT 协议）[mind-map](https://github.com/wanglin2/mind-map)
- 在线表格 (MIT 协议) [x-spreadsheet](https://github.com/myliang/x-spreadsheet)
- 在线流程图 (Apache 2.0 协议) [drawio](https://github.com/jgraph/mxgraph-js)
- 日历看板 (MIT 协议) [fullcalendar](https://github.com/fullcalendar/fullcalendar)

# 开源协议

[AGPL-3.0 License](https://www.gnu.org/licenses/gpl-3.0.html)

本项目的开源协议为 AGPL-3.0，简要描述就是您可以免费商用，如果进行二次发行则需要保留所有 Kooteam 项目的开源版权，源码也需要开源。如果您不想开源，可以联系我们，提供付费的定制服务。

# 本地开发说明

## 源码目录结构

- kooteam 目录是 Java 源码文件
- vue 目录是前端源码文件
- release 打包后的二进制文件与启动脚本

## 工程启动说明

- 启动 java 工程，初次启动时系统会载入安装配置页面
- 在浏览器里进入地址：http://127.0.0.1:7053/ ，配置数据库连接参数
- 进入 vue 目录，npm install -d 命令安装前端依赖
- 然后执行 npm run start 启动前端工程，即可进入开发模式，前端工程如何进入程序调试模式
- 💡💡💡 初次启动会报数据库链接异常，但应用已经启动，在浏览器中配置完数据库信息后，重新启动即可进入开发

## 工程打包部署

- 前端工程开发完成后，执行 npm run dist 命令构建前端脚本
- 将前端工程 dist 目录中构建好的 app.js 文件进行 gzip 压缩 (文件名保持不变)
- 压缩后的 app.js 文件复制到 java 工程 src/resources/static/ 目录里
- 进入 java 工程目录，执行 mvn clean && mvn package -f ./pom.xml 生成 java 二进制文件
- 最终部署文件地址：kooteam/target/kooteam.jar

# 可持续发展

- 开源不等于免费，开源项目提供付费服务是很正常的事，能活下去的开源才能持久更新
- 不影响大部分用户使用的前提下开源项目，针对特定人群、企业提供付费项目，有助于项目的生存和发展
- 在自用的情况下，本项目可以自己进行二次开发，完成打包和部署，均不受限制。如果需要二次发行，提供定制服务等需要准守 AGPL 开源协议。

# 关注微信服务号，了解更多

- ![二维码](./sanliangyun.jpg)
