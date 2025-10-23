package com.yimiyisu.kooteam.domain;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class PermissionPageDO {
    private String appLeft;
    private List<String> permissionsLeft;
    private Map<String, List<String>> pointsLeft;
}
