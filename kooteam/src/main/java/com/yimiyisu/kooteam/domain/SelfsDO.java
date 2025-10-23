package com.yimiyisu.kooteam.domain;

import lombok.Data;

import java.util.List;

@Data
public class SelfsDO {
    private List<SelfDO> selfs;

    @Data
     public class SelfDO {
        private String name;
        private int encrypt;
        private String value;
    }
}
