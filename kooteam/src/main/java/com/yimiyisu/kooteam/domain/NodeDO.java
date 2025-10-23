package com.yimiyisu.kooteam.domain;

import lombok.Data;

@Data
public class NodeDO {
    private String id;
    private String title;
    private String parentId;
    private Object details;
}
