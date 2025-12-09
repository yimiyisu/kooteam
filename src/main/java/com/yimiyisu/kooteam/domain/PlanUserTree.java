package com.yimiyisu.kooteam.domain;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class PlanUserTree {
    private String id;
    private String title;
    private String parentId;
    private List<PlanUserTree> children = new ArrayList<>();
}
