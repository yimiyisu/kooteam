package com.zeto.kooteam.service.eventbus.model;

import com.blade.kit.PatternKit;
import com.zeto.domain.ZenSite;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class MailMode {
    private List<String> to = new ArrayList<>();
    private String title;
    private String content;
    private ZenSite site;

    public MailMode addTo(String[] mails) {
        for (String mail : mails) {
            if (PatternKit.isEmail(mail) && !this.to.contains(mail)) {
                this.to.add(mail);
            }
        }
        return this;
    }

    public MailMode addTo(String mail) {
        if (!PatternKit.isEmail(mail)) {
            return this;
        }
        to.add(mail);
        return this;
    }

    public boolean isEmpty() {
        return to == null || to.size() == 0;
    }
}
