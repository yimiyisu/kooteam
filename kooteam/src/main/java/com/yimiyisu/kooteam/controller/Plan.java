package com.yimiyisu.kooteam.controller;

import com.yimiyisu.kooteam.domain.PlanDO;
import com.yimiyisu.kooteam.domain.PlanUserTree;
import com.yimiyisu.kooteam.events.model.SendPlanNotEventModel;
import com.zen.ZenController;
import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenResult;
import com.zen.annotation.AccessRole;
import com.zen.annotation.Inject;
import com.zen.annotation.MethodType;
import com.zen.enums.ZenMethod;
import com.zen.enums.ZenRole;
import com.zen.kit.EventKit;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@AccessRole(ZenRole.CONSOLE)
public class Plan extends ZenController {

    @Inject
    private ZenEngine zenEngine;

    // 构建部门属性结构
    @MethodType(ZenMethod.ALL)
    public ZenResult getEmpTree(ZenData data) {
        // 查询所有部门并构建属性结构
        ZenResult depResultList = zenEngine.execute("list/departmentList", ZenData.create());
        if (depResultList.isEmpty()) return ZenResult.success();
        List<PlanUserTree> depList = depResultList.asList(PlanUserTree.class);
        depList = buildDepTree(depList);
        return ZenResult.success().setData(depList);
    }


    // 向关联人发送通知
    public ZenResult sendNotice(ZenData data) {
        PlanDO plan = data.parse(PlanDO.class);
        SendPlanNotEventModel sendPlanNotEventModel = new SendPlanNotEventModel();
        sendPlanNotEventModel.setPlan(plan);
        EventKit.trigger(sendPlanNotEventModel);
        return ZenResult.success();
    }


    // 构建部门的树形结构
    private List<PlanUserTree> buildDepTree(List<PlanUserTree> list) {
        if (list == null || list.isEmpty()) {
            return new ArrayList<>();
        }

        Map<String, PlanUserTree> nodeMap = new HashMap<>(list.size());
        List<PlanUserTree> rootNodes = new ArrayList<>();

        for (PlanUserTree node : list) {
            if (node.getChildren() == null) {
                node.setChildren(new ArrayList<>());
            } else {
                node.setChildren(node.getChildren());
            }
            nodeMap.put(node.getId(), node);
        }

        for (PlanUserTree node : list) {
            String parentId = node.getParentId();
            if ("0".equals(parentId)) {
                rootNodes.add(node);
            } else {
                PlanUserTree parent = nodeMap.get(parentId);
                if (parent != null) {
                    if (parent.getChildren() == null) {
                        parent.setChildren(new ArrayList<>());
                    }
                    parent.getChildren().add(node);
                }
            }
        }

        return rootNodes;
    }
}
