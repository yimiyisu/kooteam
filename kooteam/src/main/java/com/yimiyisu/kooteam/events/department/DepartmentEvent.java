package com.yimiyisu.kooteam.events.department;

import com.google.common.eventbus.Subscribe;
import com.google.gson.JsonObject;
import com.yimiyisu.kooteam.domain.DepartmentDO;
import com.yimiyisu.kooteam.domain.DepartmentUserDO;
import com.yimiyisu.kooteam.events.department.model.DepartmentEventModel;
import com.yimiyisu.kooteam.kit.LoginKit;
import com.yimiyisu.kooteam.kit.openPlatform.DingdingPlatform;
import com.yimiyisu.kooteam.kit.openPlatform.FeishuPlatform;
import com.yimiyisu.kooteam.kit.openPlatform.IOpenPlatform;
import com.yimiyisu.kooteam.kit.openPlatform.WeworkPlatform;
import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenResult;
import com.zen.annotation.Inject;
import com.zen.domain.ZenUser;
import com.zen.enums.UserBasicTag;
import com.zen.enums.ZenRole;
import com.zen.interfaces.IEvent;
import com.zen.kit.ConfigKit;
import com.zen.kit.DateKit;
import com.zen.kit.StringKit;
import com.zen.kit.UserKit;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
public class DepartmentEvent implements IEvent<DepartmentEventModel> {
    @Inject
    private ZenEngine zenEngine;

    @Override
    @Subscribe
    public void execute(DepartmentEventModel departmentEventModel) {
        String loginMode;
        if (ConfigKit.isDev()) loginMode = ConfigKit.get("loginMode");
        else loginMode = LoginKit.login().get("loginMode");
        if (StringKit.isEmpty(loginMode)) return;
        IOpenPlatform openPlatform;
        int userTag;
        switch (loginMode) {
            case "wework":
                openPlatform = new WeworkPlatform();
                userTag = UserBasicTag.WEWORK.value();
                break;
            case "dingding":
                openPlatform = new DingdingPlatform();
                userTag = UserBasicTag.DING.value();
                break;
            case "feishu":
                openPlatform = new FeishuPlatform();
                userTag = UserBasicTag.FEISHU.value();
                break;
            default:
                return;
        }
        // 1. 获取部门树
        List<DepartmentDO> departmentDOList = openPlatform.syncDepartmentData();
        if (ConfigKit.isDev()) {

        }
        if (ConfigKit.isDaily()) {// 2. 预加载本地部门数据，生成外部部门ID与本地部门ID的映射
            Map<String, String> outIdToLocalId = deptIdMappings();
            for (DepartmentDO departmentDO : departmentDOList) {
                String departmentId = outIdToLocalId.get(departmentDO.getOutId());
                // 该部门不存在，则先创建部门
                if (departmentId == null) {
                    departmentId = this.insertDepartment(departmentDO, departmentDOList, outIdToLocalId);
                }
                List<DepartmentUserDO> employeeList = openPlatform.syncUserData(departmentDO.getOutId());

                for (DepartmentUserDO employee : employeeList) {
                    //判断用户表里有没有该员工
                    ZenUser zenUser = UserKit.getByOpenId(employee.getUserId(), userTag);
                    if (zenUser == null) {
                        zenUser = new ZenUser();
                        //往用户表里插入
                        zenUser.setOpenId(employee.getUserId());
                        zenUser.setNick(employee.getTitle());
                        zenUser.setMobile(employee.getMobile());
                        zenUser.setEmail(employee.getEmail());
                        zenUser.addTag(userTag);
                        // 添加员工标识
                        zenUser.setRole(ZenRole.CONSOLE);
                        UserKit.insert(zenUser);
                        // 同步插入员工表
                        employee.setId(zenUser.getId());
                        this.insertEmployee(departmentId, employee, zenUser.getId());
                    } else {
                        ZenData employeeData = ZenData.create("id", zenUser.getId());
                        //判断员工表里是否有员工
                        long count = zenEngine.execute("count/employee", employeeData).getLong();
                        if (count > 0) {
                            //更新员工时间，确定用户依旧在职状态
                            zenEngine.execute("patch/employee", ZenData.create("id", zenUser.getId()));
                            ZenData relateData = ZenData.create("employeeId", zenUser.getId())
                                    .put("departmentId", departmentId)
                                    .put("role", employee.getRole());
                            //判断该部门下有没有添加过员工
                            ZenResult zenResult = zenEngine.execute("count/department_user", relateData);
                            if (zenResult.getLong() == 0) {
                                zenEngine.execute("put/department_user", relateData);
                            }
                        } else {
                            //员工表不存在则补录员工信息
                            employee.setId(zenUser.getId());
                            this.insertEmployee(departmentId, employee, zenUser.getId());
                        }
                    }
                }
            }
            //清除离职员工
            this.cleanEmployee();
        }
    }

    // 清除离职员工
    private void cleanEmployee() {
        // 超过
        long anchorTimestamp = DateKit.now() - 23 * 3600;
        int page = 1;
        while (true) {
            ZenResult result = zenEngine.execute("list/employee", ZenData.create().put("updateGmt", anchorTimestamp).put("pageSize", "300")).put("page", page);
            if (result == null || result.isEmpty() || result.asList() == null || result.asList().isEmpty()) return;
            List<JsonObject> resultList = result.asList();
            ZenData employeeData = ZenData.create();
            resultList.forEach(item -> {
                String uid = item.get("id").getAsString();
                //更新时间超过一天没更新就删除
                zenEngine.execute("delete/employee", employeeData.put("id", uid));
                //删除相对应的外键表
                ZenResult employeeIds = zenEngine.execute("list/department_userList", employeeData.put("employeeId", uid));
                if (employeeIds != null && !employeeIds.isEmpty()) {
                    employeeIds.asList(Map.class).forEach(map -> {
                        String id = map.get("id").toString();
                        zenEngine.execute("delete/department_user", employeeData.put("id", id));
                    });
                }
                //禁用该用户
//                    UserKit.pause(uid);
            });
            page += 1;
        }
    }

    private void insertEmployee(String departmentId, DepartmentUserDO employee, String zenUserId) {
        ZenData employeeData = ZenData.create()
                .put("id", employee.getId())
                .put("title", employee.getTitle())
                .put("mobile", employee.getMobile())
                .put("email", employee.getEmail());
        //新增操作
        zenEngine.execute("put/employee", employeeData);
        //判断该部门下有没有添加过员工
        ZenData relateData = ZenData.create("employeeId", zenUserId)
                .put("departmentId", departmentId)
                .put("role", employee.getRole());
        ZenResult zenResult = zenEngine.execute("count/department_user", relateData);
        if (zenResult.getLong() == 0) {
            zenEngine.execute("put/department_user", relateData);
        }
    }

    private String insertDepartment(DepartmentDO departmentDO, List<DepartmentDO> allDepartment, Map<String, String> outIdToLocalId) {
        departmentDO.setId(StringKit.objectId());
        // 先判断父级部门是否存在，不存在的话需要先创建父级部门
        Optional<DepartmentDO> parent = allDepartment.stream().filter(item -> item.getOutId().equals(departmentDO.getOutParentId())).findFirst();
        if (parent.isPresent()) {
            String parentOutId = parent.get().getOutId();
            String parentId = outIdToLocalId.get(parentOutId);
            // 父级部门也不存在，先插入父部门ID
            // 生成父部门ID
            if (parentId == null) parentId = this.insertDepartment(parent.get(), allDepartment, outIdToLocalId);
            departmentDO.setParentId(parentId);
        } else departmentDO.setParentId("0");

        ZenData data = ZenData.create("id", departmentDO.getId()).
                put("title", departmentDO.getTitle()).
                put("parentId", departmentDO.getParentId()).
                put("outId", departmentDO.getOutId());
        zenEngine.execute("put/department", data);
        outIdToLocalId.put(departmentDO.getOutId(), departmentDO.getId());
        return departmentDO.getId();
    }

    // 预加载本地已有部门的ID映射
    private Map<String, String> deptIdMappings() {
        Map<String, String> outIdToLocalId = new HashMap<>();
        int page = 1;
        boolean hasMore;
        do {
            ZenResult result = zenEngine.execute("list/departmentList",
                    ZenData.create("pageSize", "500").put("page", page));
            List<JsonObject> resultList = result.asList();
            if (resultList == null || resultList.isEmpty()) {
                if (page == 1) return outIdToLocalId;
                else break;
            }
            resultList.forEach(item ->
                    outIdToLocalId.put(item.get("outId").getAsString(), item.get("id").getAsString())
            );
            hasMore = !result.isEmpty();
            // 处理当前页
            page++;
        } while (hasMore);
        return outIdToLocalId;
    }
}