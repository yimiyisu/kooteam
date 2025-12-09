package com.yimiyisu.kooteam.hooks.ladp.exception;

/**
 * 无效的用户
 *
 * @author noear
 * @since 1.0
 */
public class IllegalPersonException extends RuntimeException {
    public IllegalPersonException() {
        super();
    }

    public IllegalPersonException(String message) {
        super(message);
    }
}
