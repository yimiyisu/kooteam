#!/bin/bash

port=7053
lsof -i:${port}|cut -c 9-13|grep -v PID|xargs kill -9