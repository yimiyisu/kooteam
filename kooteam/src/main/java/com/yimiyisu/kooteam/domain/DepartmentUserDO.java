package com.yimiyisu.kooteam.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class DepartmentUserDO {
    private String id;
    private String userId;
    private String title;
    private List<String> departmentId;
    private String role;
    private String mobile;
    private String email;

}
