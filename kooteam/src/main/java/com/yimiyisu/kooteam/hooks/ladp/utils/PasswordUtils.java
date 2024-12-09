package com.yimiyisu.kooteam.hooks.ladp.utils;

import java.security.MessageDigest;

/**
 * @author noear
 * @since 1.0
 */
public class PasswordUtils {
    /**
     * 构建md5密码，例：{MD5}ICy5YqxZB1uWSwcVLSNLcA==
     *
     * @param orgPassword 原始密码
     */
    public static String buildMd5Password(String orgPassword) {
        byte[] byteArray = null;

        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            md.reset();
            md.update(orgPassword.getBytes("UTF-8"));

            byteArray = md.digest();

        } catch (Exception e) {
            e.printStackTrace();
        }
        return "{MD5}" + Base64Utils.encodeByte(byteArray);
    }
}
