package com.zeto.kooteam.controller;

import com.blade.ioc.annotation.Inject;
import com.blade.kit.DateKit;
import com.blade.kit.GsonKit;
import com.google.common.base.Strings;
import com.zeto.ZenConditionKit;
import com.zeto.ZenData;
import com.zeto.ZenResult;
import com.zeto.ZenUserKit;
import com.zeto.annotation.AccessRole;
import com.zeto.domain.ZenCondition;
import com.zeto.domain.ZenRole;
import com.zeto.domain.ZenUser;
import com.zeto.driver.ZenStorageEngine;
import com.zeto.kooteam.service.EventBiz;
import com.zeto.kooteam.service.domain.ProjectStat;
import com.zeto.kooteam.service.eventbus.model.MessageModel;
import com.zeto.kooteam.service.eventbus.model.MessageType;

import java.util.List;
import java.util.Map;

@AccessRole
public class Project {
    @Inject
    private ZenStorageEngine zenStorageEngine;
    private static final int count = 100;

    // 我的项目
    public ZenResult my(ZenUser user, ZenData data) {
        data.put("userId", user.getUid());
        ZenResult source = zenStorageEngine.execute("select/projectUserByUserId", data, user);
        long total = zenStorageEngine.count("projectUser", ZenConditionKit.And().eq("userId", data.get("userId")));
        ZenResult projects = zenStorageEngine.selectByIds("project", "projectId", source);
        return ZenResult.success().put("list", projects.getData()).setTotal((int) total);
    }

    // 创建项目
    public ZenResult create(ZenUser user, ZenData data) {
        data.put("owner", user.getUid());
        ZenResult result = zenStorageEngine.execute("put/project", data, user);
        String projectId = result.get("_id");
        // 创建者为负责人
        ZenData param = ZenData.create("userId", user.getUid()).
                put("projectId", projectId).put("role", "5");
        zenStorageEngine.execute("put/projectUser", param, user);
        // 手机端项目成员添加
        String[] dingUsers = data.getParameters("dingUsers");
        if (dingUsers != null) {
            for (String dingUid : dingUsers) {
                ZenUser dingUser = ZenUserKit.getByUnionId(dingUid, ZenRole.DING);
                if (dingUser == null || dingUser.getUid().equals(user.getUid())) {
                    continue;
                }
                param = ZenData.create("userId", dingUser.getUid()).
                        put("projectId", projectId).put("role", "1");
                zenStorageEngine.execute("put/projectUser", param, user);
            }
        }
        return ZenResult.success().setData(projectId);
    }

    public ZenResult edit(ZenUser user, ZenData data) {
        String projectId = data.get("_id");
        ZenResult project = checkOnwer(user, projectId);
        if (!project.isSuccess()) {
            return project;
        }
        zenStorageEngine.execute("patch/project", data, user);
        return ZenResult.success("修改成功！");
    }

    // 我收藏的项目
    public ZenResult faviList(ZenUser user) {
        ZenData param = new ZenData();
        if (!param.contains("size")) {
            param.put("size", "5");
        }
        ZenResult result = zenStorageEngine.execute("select/projectFaviByUid", param, user);
        return zenStorageEngine.selectByIds("project", "projectId", result);
    }

    // 参与的项目
    public ZenResult joinList(ZenUser user) {
        ZenData param = ZenData.create("userId", user.getUid());

        ZenResult result = zenStorageEngine.execute("select/projectUserByUserId", param, user);
        return zenStorageEngine.selectByIds("project", "projectId", result);
    }

    public ZenResult board(ZenUser user, ZenData data) {
        String projectId = data.get("_id");
        ZenResult project = zenStorageEngine.execute("get/projectById", data, user);
        if (project.isEmpty()) {
            return ZenResult.fail("工程不存在");
        }
        project.put("board", project.get("board"));
        ZenData param = ZenData.create("projectId", projectId).put("size", "200");
        ZenResult thingsData = zenStorageEngine.execute("select/thingByProjectId", param, user);
        project.put("things", thingsData.getData());
        return project;
    }

    // 项目包含的任务
    public ZenResult things(ZenData data, ZenUser user) {
        String type = data.get("type"), projectId = data.get("id");
        if (Strings.isNullOrEmpty(projectId)) {
            return ZenResult.fail("项目编号不能为空！");
        }
        ZenData params = ZenData.create("projectId", projectId);
        // 未完成任务
        if (type.equals("unfinish")) {
            params.put("status", "0");
            return zenStorageEngine.listWithPage("select/thing", params, user);
        }
        // 已完成任务
        if (type.equals("finished")) {
            params.put("status", "1");
            return zenStorageEngine.listWithPage("select/thing", params, user);
        }
        // 超期任务
        if (type.equals("overtime")) {
            params.put("status", "0");
            params.put("ls_end", DateKit.now());
            return zenStorageEngine.listWithPage("select/thing", params, user);
        }
        return ZenResult.fail("类型错误");
    }

    public ZenResult addUser(ZenData data, ZenUser user) {
        // 先判断用户是否为项目创始人或管理员
        String role = data.get("role", "1"), message;
        String projectId = data.get("projectId");
        ZenResult projectInfo = checkOnwer(user, projectId);
        if (!projectInfo.isSuccess()) {
            return projectInfo;
        }
        String[] dingUsers = data.getParameters("dingUsers");
        List<Map<String, Object>> ids = GsonKit.parseListMap("");
        if (dingUsers != null) {
            // 钉钉用户ID，转成系统用户ID
            //ids = new String[dingUsers.length];
            ZenUser dingUser;
            for (int i = 0; i < dingUsers.length; i++) {
                dingUser = ZenUserKit.getByUnionId(dingUsers[i], ZenRole.DING);
                if (dingUser != null) {
                    // ids[i] = dingUser.getUid();
                }
            }
        } else {
            ids = GsonKit.parseListMap(data.get("ids"));
            //  ids = data.getParameters("ids");
        }
        if (ids == null || ids.size() == 0) {
            return ZenResult.fail("请先选择好友");
        }

        for (Map<String, Object> uid : ids) {
            ZenData param = ZenData.create("userId", uid);
            param.put("projectId", projectId);
            param.put("userId", uid.get("uid"));
            ZenResult checkData = zenStorageEngine.execute("get/projectUserByProjectIdUid", param, user);
            if (!checkData.isEmpty()) {// 每个用户只能添加一次
                continue;
            }
            param.put("role", role);
            message = user.getNick() + "已经把你加入到项目[" + projectInfo.get("title") + "]成员中";
            //EventBiz.sendMessage(new MessageModel(user.getUid(), uid.get("uid"), message, projectId, MessageType.PROJECT));
            zenStorageEngine.execute("put/projectUser", param, user);
        }
        return ZenResult.success("添加成功");
    }

    // 收藏
    public ZenResult favi(ZenData data, ZenUser user) {
        ZenResult result = zenStorageEngine.execute("count/projectFavi", data, user);
        if (result.getLong() > 0) {
            return ZenResult.success("收藏成功");
        }
        zenStorageEngine.execute("put/projectFavi", data, user);
        return ZenResult.success("收藏成功");
    }

    public ZenResult members(ZenData data, ZenUser user) {
        ZenResult members = zenStorageEngine.execute("select/projectUserByProjectId", data, user);
        return ZenUserKit.selectByUids(members);
    }

    // 转交
    public ZenResult trans(ZenData data, ZenUser user) {
        String projectId = data.get("_id");
        ZenResult result = checkOnwer(user, projectId);
        if (!result.isSuccess()) {
            return result;
        }
        ZenData params = ZenData.create("owner", data.get("userId")).put("_id", data.get("_id"));
        zenStorageEngine.execute("patch/project", params, user);

        // 删除负责人项目权限
        params = ZenData.create("projectId", result.get("_id")).put("userId", user.getUid());
        zenStorageEngine.execute("delete/projectUserWidthProject", params, user);

        String message = user.getNick() + "已把[" + result.get("title") + "]项目负责人角色转交给你";
        EventBiz.sendMessage(new MessageModel(user.getUid(), data.get("userId"), message, result.get("_id"), MessageType.PROJECT));
        return ZenResult.success("转交成功");
    }

    // 删除
    public ZenResult remove(ZenData data, ZenUser user) {
        String projectId = data.get("_id");
        ZenResult result = checkOnwer(user, projectId);
        if (!result.isSuccess()) {
            return result;
        }
        ZenData params = ZenData.create("projectId", data.get("_id"));
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
        data.put("userId", user.getUid());
        ZenResult result = zenStorageEngine.execute("get/projectUserByProjectIdUid", data, user);
        if (result.isEmpty()) {
            ZenResult.success("退出完成");
        }
        ZenData param = ZenData.create("projectId", data.get("projectId"));
        ZenResult project = zenStorageEngine.execute("get/projectById", param, user);
        if (user.getUid().equals(project.get("owner"))) {
            ZenResult.fail("项目负责人，只能转交项目");
        }
        param = ZenData.create("_id", result.get("_id"));
        zenStorageEngine.execute("delete/projectUser", param, user);
        return ZenResult.success("退出成功");
    }

    public ZenResult deleteMember(ZenData data, ZenUser user) {
        ZenResult projectUser = zenStorageEngine.execute("get/projectUserById", data, user);
        if (projectUser.isEmpty()) {
            return ZenResult.fail("项目不存在");
        }

        ZenData param = ZenData.create("_id", projectUser.get("projectId"));
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

    private ZenResult checkOnwer(ZenUser user, String projectId) {
        ZenResult result = zenStorageEngine.execute("get/projectById", ZenData.create("_id", projectId), user);
        if (result.isEmpty()) {
            return ZenResult.fail("项目不存在");
        }
        if (!user.getUid().equals(result.get("owner"))) {
            return ZenResult.fail("只有负责人才能操作");
        }
        return result;
    }

    // 获取项目章节
    public ZenResult chapter(ZenData data, ZenUser user) {
        String projectId = data.get("id");
        ZenData params = ZenData.create("_id", projectId);
        ZenResult projectInfo = zenStorageEngine.execute("get/projectById", params, user);
        String title = projectInfo.get("title");
        ZenResult extend = zenStorageEngine.extend("note", projectId);
        if (extend.isEmpty()) {
            // 合并数据
            extend = zenStorageEngine.execute("extend/projectExtendField", params, user);
            String doc = "";
            if (extend.isEmpty()) {
                doc = extend.get("doc");
            }
            params.put("permision", "4")
                    .put("isProject", "1")
                    .put("title", title)
                    .put("type", "4")
                    .put("content", doc)
                    .put("parentId", projectId);
            zenStorageEngine.execute("put/note", params, user);
        }
        return extend.put("title", title);
    }

    // 保存项目文档
    public ZenResult saveDoc(ZenData data, ZenUser user) {
        zenStorageEngine.execute("patch/note", data, user);
        return ZenResult.success().setData("保存成功");
    }

    // 项目统计
    public ZenResult stat(ZenData data, ZenUser user) {
        String projectId = data.get("id");
        ZenData param = ZenData.create("_id", projectId);
        ZenResult project = zenStorageEngine.execute("get/projectById", param, user);
        ProjectStat stat = new ProjectStat();
        stat.setFinished(project.getLong("finished"));
        stat.setUnfinish(project.getLong("unfinish"));
        if (stat.getFinished() + stat.getUnfinish() == 0) {
            return ZenResult.success().setData(0);
        }

        long now = DateKit.now();
        ZenCondition condition = ZenConditionKit.And().
                eq("projectId", projectId).
                eq("status", 1).
                lesser("end", now);
        long overtime = zenStorageEngine.count("thing", condition);
        stat.setOvertime(overtime);

        return ZenResult.success().setData(stat);
    }

    private boolean checkPermission() {
        return false;
    }

}
