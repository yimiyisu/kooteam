package com.yimiyisu.kooteam.hooks.ladp.utils;

import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 * @author noear
 * @since 1.0
 */
public class Base64Utils {
    private static final Charset _coder = StandardCharsets.UTF_8;

    public static String encodeByte(byte[] data) {
        return new String(Base64.getEncoder().encode(data), Base64Utils._coder);
    }
}
