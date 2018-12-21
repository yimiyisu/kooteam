package com.zeto.kooteam.controller;

import com.blade.ioc.annotation.Inject;
import com.blade.kit.DateKit;
import com.zeto.*;
import com.zeto.annotation.AccessRole;
import com.zeto.dal.domain.UserFrom;
import com.zeto.domain.ZenUser;
import com.zeto.driver.ZenStorageEngine;
import com.zeto.kooteam.service.EventBiz;
import com.zeto.kooteam.service.domain.ProjectStat;
import com.zeto.kooteam.service.eventbus.model.MessageModel;
import com.zeto.kooteam.service.eventbus.model.MessageType;

@AccessRole
public class Project {
    @Inject
    private ZenStorageEngine zenStorageEngine;

    // 我的项目
    public ZenResult my(ZenUser user, ZenData data) {
        data.add("userId", user.getUid());
        ZenResult source = zenStorageEngine.execute("select/projectUserByUserId", data, user);
        ZenResult projects = zenStorageEngine.selectByIds("project", "projectId", source);
        return source.setData(projects.getData());
    }

    // 创建项目
    public ZenResult create(ZenUser user, ZenData data) {
        data.add("owner", user.getUid());
        ZenResult result = zenStorageEngine.execute("set/project", data, user);
        String projectId = result.get("_id");
        // 创建者为负责人
        ZenData param = ZenData.put("userId", user.getUid()).
                add("projectId", projectId).add("role", "5");
        zenStorageEngine.execute("set/projectUser", param, user);
        // 手机端项目成员添加
        String[] dingUsers = data.getParameters("dingUsers");
        if (dingUsers != null) {
            for (String dingUid : dingUsers) {
                ZenUser dingUser = ZenUserHelper.i().getByDingUid(dingUid, UserFrom.DINGTALK);
                if (dingUser == null || dingUser.getUid().equals(user.getUid())) {
                    continue;
                }
                param = ZenData.put("userId", dingUser.getUid()).
                        add("projectId", projectId).add("role", "1");
                zenStorageEngine.execute("set/projectUser", param, user);
            }
        }
        return ZenResult.success().setData(projectId);
    }

    // 我收藏的项目
    public ZenResult faviList(ZenUser user) {
        ZenData param = new ZenData();
        if (!param.contains("size")) {
            param.add("size", "5");
        }
        ZenResult result = zenStorageEngine.execute("select/projectFaviByUid", param, user);
        return zenStorageEngine.selectByIds("project", "projectId", result);
    }

    public ZenResult board(ZenUser user, ZenData data) {
        String projectId = data.get("_id");
        ZenResult project = zenStorageEngine.execute("get/projectById", data, user);
        if (project.isEmpty()) {
            return ZenResult.fail("工程不存在");
        }
        ZenResult boardData = zenStorageEngine.extend("project", projectId);
        project.put("board", boardData.get("board"));
        ZenData param = ZenData.put("projectId", projectId).add("size", "200");
        ZenResult thingsData = zenStorageEngine.execute("select/thingByProjectId", param, user);
        project.put("things", thingsData.getData());
        return project;
    }

    // 项目包含的任务
    public ZenResult things(ZenUser user, ZenData data) {
        return ZenResult.success();
    }

    public ZenResult addUser(ZenData data, ZenUser user) {
        // 先判断用户是否为项目创始人或管理员
        String role = data.get("role", "1"), message;
        String projectId = data.get("projectId");
        ZenResult projectInfo = zenStorageEngine.execute("get/projectById", ZenData.put("_id", projectId), user);
        if (projectInfo.isEmpty()) {
            return ZenResult.fail("项目不存在");
        }
        if (!user.getUid().equals(projectInfo.get("owner"))) {
            return ZenResult.fail("只有项目负责人才能添加成员");
        }
        String[] dingUsers = data.getParameters("dingUsers"), ids;
        if (dingUsers != null) {
            // 钉钉用户ID，转成系统用户ID
            ids = new String[dingUsers.length];
            ZenUser dingUser;
            for (int i = 0; i < dingUsers.length; i++) {
                dingUser = ZenUserHelper.i().getByDingUid(dingUsers[i], UserFrom.DINGTALK);
                if (dingUser != null) {
                    ids[i] = dingUser.getUid();
                }
            }
        } else {
            ids = data.getParameters("ids");
        }
        if (ids == null || ids.length == 0) {
            return ZenResult.fail("请先选择好友");
        }

        for (String uid : ids) {
            ZenData param = ZenData.put("userId", uid);
            param.add("projectId", projectId);
            param.add("userId", uid);
            ZenResult checkData = zenStorageEngine.execute("get/projectUserByProjectIdUid", param, user);
            if (!checkData.isEmpty()) {// 每个用户只能添加一次
                continue;
            }
            param.add("role", role);
            message = user.getNick() + "已经把你加入到项目[" + projectInfo.get("title") + "]成员中";
            EventBiz.sendMessage(new MessageModel(user.getUid(), uid, message, projectId, MessageType.PROJECT));
            zenStorageEngine.execute("set/projectUser", param, user);
        }
        return ZenResult.success("添加成功");
    }

    // 收藏
    public ZenResult favi(ZenData data, ZenUser user) {
        ZenResult result = zenStorageEngine.execute("count/projectFavi", data, user);
        if (result.getLong() > 0) {
            return ZenResult.success("收藏成功");
        }
        zenStorageEngine.execute("set/projectFavi", data, user);
        return ZenResult.success("收藏成功");
    }

    public ZenResult members(ZenData data, ZenUser user) {
        ZenResult members = zenStorageEngine.execute("select/projectUserByProjectId", data, user);
        return ZenUserHelper.selectByUids(members);
    }

    // 转交
    public ZenResult trans(ZenData data, ZenUser user) {
        ZenResult result = zenStorageEngine.execute("get/projectById", data, user);
        if (result.isEmpty()) {
            return ZenResult.fail("项目ID错误");
        }
        if (!user.getUid().equals(result.get("owner"))) {
            return ZenResult.fail("只要owner才能转交项目");
        }
        ZenData params = ZenData.put("owner", data.get("userId")).add("_id", data.get("_id"));
        zenStorageEngine.execute("patch/project", params, user);

        // 删除负责人项目权限
        params = ZenData.put("projectId", result.get("_id")).add("userId", user.getUid());
        zenStorageEngine.execute("delete/projectUserWidthProject", params, user);

        String message = user.getNick() + "已把[" + result.get("title") + "]项目负责人角色转交给你";
        EventBiz.sendMessage(new MessageModel(user.getUid(), data.get("userId"), message, result.get("_id"), MessageType.PROJECT));
        return ZenResult.success("转交成功");
    }

    // 删除
    public ZenResult remove(ZenData data, ZenUser user) {
        ZenResult result = zenStorageEngine.execute("get/projectById", data, user);
        if (result.isEmpty()) {
            return ZenResult.fail("项目ID错误");
        }
        if (!user.getUid().equals(result.get("owner"))) {
            return ZenResult.fail("只要owner才能转交项目");
        }
        ZenData params = ZenData.put("projectId", data.get("_id"));
        result = zenStorageEngine.execute("count/thingByProjectId", params, user);
        if (result.getLong() > 0) {
            return ZenResult.fail("该项目中存在未完成任务，不能删除");
        }
        zenStorageEngine.execute("delete/project", data, user);
        //  清除项目用户
        zenStorageEngine.execute("delete/projectUserClean", params, user);
        return ZenResult.success("删除成功");
    }

    // 退出
    public ZenResult quit(ZenData data, ZenUser user) {
        data.add("userId", user.getUid());
        ZenResult result = zenStorageEngine.execute("get/projectUserByProjectIdUid", data, user);
        if (result.isEmpty()) {
            ZenResult.success("退出完成");
        }
        ZenData param = ZenData.put("projectId", data.get("projectId"));
        ZenResult project = zenStorageEngine.execute("get/projectById", param, user);
        if (user.getUid().equals(project.get("owner"))) {
            ZenResult.fail("项目负责人，只能转交项目");
        }
        param = ZenData.put("_id", result.get("_id"));
        zenStorageEngine.execute("delete/projectUser", param, user);
        return ZenResult.success("退出成功");
    }

    public ZenResult deleteMember(ZenData data, ZenUser user) {
        ZenResult projectUser = zenStorageEngine.execute("get/projectUserById", data, user);
        if (projectUser.isEmpty()) {
            return ZenResult.fail("项目不存在");
        }

        ZenData param = ZenData.put("_id", projectUser.get("projectId"));
        ZenResult project = zenStorageEngine.execute("get/projectById", param, user);

        if (project.isEmpty()) {
            return ZenResult.fail("项目信息错误");
        }
        if (projectUser.get("userId").equals(project.get("owner"))) {
            return ZenResult.fail("项目负责人不能删除");
        }
        if (user.getUid().equals(project.get("owner"))) {
            return zenStorageEngine.execute("delete/projectUser", data, user);
        }
        return ZenResult.fail("只要项目负责人才有权限删除成员");
    }

    // 获取项目章节
    public ZenResult chapter(ZenData data, ZenUser user) {
        String projectId = data.get("id");
        ZenData params = ZenData.put("_id", projectId);
        ZenResult result = zenStorageEngine.execute("extend/projectExtendField", params, user);
        ZenResult projectInfo = zenStorageEngine.execute("get/projectById", params, user);
        return result.put("title", projectInfo.get("title"));
    }

    // 保存项目文档
    public ZenResult saveDoc(ZenData data, ZenUser user) {
        zenStorageEngine.execute("patch/project", data, user);
        return ZenResult.success().setData("保存成功");
    }

    // 项目统计
    public ZenResult stat(ZenData data, ZenUser user) {
        String projectId = data.get("id");
        ZenData param = ZenData.put("_id", projectId);
        ZenResult project = zenStorageEngine.execute("get/projectById", param, user);
        ProjectStat stat = new ProjectStat();
        stat.setFinished(project.getLong("finished"));
        stat.setUnfinish(project.getLong("unfinish"));
        if (stat.getFinished() + stat.getUnfinish() == 0) {
            return ZenResult.success().setData(0);
        }

        int now = DateKit.now();
        ZenCondition condition = ZenConditioner.And().
                eq("projectId", projectId).
                greater("end", 0).
                lesser("end", now);
        long overtime = zenStorageEngine.count("thing", condition);
        stat.setOvertime(overtime);

        return ZenResult.success().setData(stat);
    }

}
