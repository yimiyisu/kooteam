package com.yimiyisu.kooteam.hooks.ladp.exception;

/**
 * 无效的密码
 *
 * @author noear
 * @since 1.0
 */
public class IllegalPaaswordException extends RuntimeException {
    public IllegalPaaswordException() {
        super();
    }

    public IllegalPaaswordException(String message) {
        super(message);
    }
}
