package com.zeto.kooteam.service.eventbus.model;

import com.zeto.domain.ZenSite;
import lombok.Data;

@Data
public class ProjectModel {
    private String projectId;
    private String event;
    private ZenSite site;
}
