package com.yimiyisu.kooteam.hooks.ladp.exception;

/**
 * 无效的配置
 *
 * @author noear
 * @since 1.0
 */
public class IllegalConfigException extends RuntimeException {
    public IllegalConfigException() {
        super();
    }

    public IllegalConfigException(String message) {
        super(message);
    }
}
