package com.yimiyisu.kooteam.domain;

import lombok.Data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
public class PermissionAppDO {
    private List<String> pages;
    private Map<String, List<String>> points;

    public PermissionAppDO() {
        this.pages = new ArrayList<>();
        this.points = new HashMap<>();
    }

    public void addPages(List<String> pages) {
        if (pages == null) {
            return;
        }
        pages.forEach(key -> {
            if (!this.pages.contains(key)) {
                this.pages.add(key);
            }
        });
    }

    public void addPoints(Map<String, List<String>> points) {
        if (points == null) {
            return;
        }
        for (String pagePath : points.keySet()) {
            if (this.points.containsKey(pagePath)) {
                List<String> current = this.points.get(pagePath);
                for (String point : points.get(pagePath)) {
                    if (!current.contains(point)) {
                        current.add(point);
                    }
                }
            } else {
                this.points.put(pagePath, points.get(pagePath));
            }
        }
    }
}
