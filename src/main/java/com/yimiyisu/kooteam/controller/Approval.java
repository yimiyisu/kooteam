package com.yimiyisu.kooteam.controller;

import com.yimiyisu.kooteam.domain.NodeDO;
import com.zen.ZenController;
import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenResult;
import com.zen.annotation.AccessRole;
import com.zen.annotation.Inject;
import com.zen.enums.ZenRole;
import lombok.extern.slf4j.Slf4j;

import java.util.*;

@Slf4j
@AccessRole(ZenRole.SIGNATURE)
public class Approval extends ZenController {
    @Inject
    private ZenEngine zenEngine;

    // 插入审批节点
    public ZenResult putApprove(ZenData data) {
        List<NodeDO> nodeDOList = data.getAsList("nodesData", NodeDO.class);
        // 1. 构建父节点映射和根节点
        Map<String, List<NodeDO>> childrenMap = new HashMap<>();
        List<NodeDO> roots = new ArrayList<>();
        for (NodeDO node : nodeDOList) {
            String pid = node.getParentId();
            if (pid == null || pid.isEmpty() || "0".equals(pid)) {
                roots.add(node); // 根节点
            } else {
                childrenMap.computeIfAbsent(pid, k -> new ArrayList<>()).add(node);
            }
        }
        // 2. 广度优先遍历插入
        Map<String, String> idMap = new HashMap<>(); // 前端ID -> 数据库ID
        Queue<NodeDO> queue = new LinkedList<>(roots);

        while (!queue.isEmpty()) {
            NodeDO current = queue.poll();
            // 准备插入数据
            data.put("title", current.getTitle());
            data.put("outId", current.getId());
            data.put("details", current.getDetails());
            // 动态设置父节点ID
            String originalParentId = current.getParentId();
            if (originalParentId != null && !originalParentId.isEmpty() && !"0".equals(originalParentId)) {
                String dbParentId = idMap.get(originalParentId);
                data.put("parentId", dbParentId); // 使用映射的数据库ID
            } else {
                data.put("parentId", 0); // 根节点
            }
            // 插入数据库
            ZenResult result = zenEngine.execute("put/approval_node", data);
            String dbId = result.get("id"); // 获取数据库生成ID
            // 记录ID映射关系
            idMap.put(current.getId(), dbId);
            // 处理子节点
            List<NodeDO> children = childrenMap.getOrDefault(current.getId(), new ArrayList<>());
            queue.addAll(children);
        }
        // 3. 校验是否所有节点都处理完成
        if (idMap.size() != nodeDOList.size()) {
            List<String> unprocessed = nodeDOList.stream()
                    .map(NodeDO::getId)
                    .filter(id -> !idMap.containsKey(id))
                    .toList();
        }

        return ZenResult.success("保存成功");
    }

}
