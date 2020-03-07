package com.zeto.kooteam.service.eventbus.model;

import com.blade.kit.PatternKit;
import com.zeto.ZenResult;
import com.zeto.domain.ZenSite;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class MailMode {
    private List<String> to;
    private ZenResult data;
    private String title;
    private String content;
    private ZenSite site;

    public MailMode addTo(String mail) {
        if (!PatternKit.isEmail(mail)) {
            return this;
        }
        if (to == null) {
            to = new ArrayList<>();
        }
        to.add(mail);
        return this;
    }

    public boolean isEmptyTo() {
        return to == null || to.size() == 0;
    }
}
