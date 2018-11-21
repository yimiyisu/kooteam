package com.zeto.kooteam.dingtalk.domain;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class DingUserResult {
    private boolean isDepartment;
    private List<DingUserData> data = new ArrayList<>();
}
