package com.zeto.kooteam.service.eventbus.model;

import com.zeto.ZenData;
import com.zeto.domain.ZenSite;
import lombok.Data;

@Data
public class NoteModel {
    private long time;
    private ZenSite site;
    private ZenData data;
}
