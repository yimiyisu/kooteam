package com.zeto.kooteam.service.domain;

public enum DocType {
    PRIVATE("1"),//私有文档
    OPEN("2"),//开放文档
    COMPANY("3"),//企业内部开放文档
    PROJECT("4");// 项目文档
    private final String value;

    public String getValue() {
        return value;
    }

    DocType(String value) {
        this.value = value;
    }
}
