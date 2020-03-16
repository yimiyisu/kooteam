package com.zeto.kooteam.service.eventbus.model;

import com.zeto.domain.ZenSite;
import lombok.Data;

@Data
public class EmployeeModel {
    private String id;
    private ZenSite site;
}
