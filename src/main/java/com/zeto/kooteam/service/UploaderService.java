package com.zeto.kooteam.service;

import com.blade.ioc.annotation.Bean;
import com.blade.kit.HttpKit;
import com.blade.kit.StringKit;
import com.zeto.ZenEnvironment;
import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

@Slf4j
@Bean
public class UploaderService {

    public String avator(String uri, String uid) {
        byte[] data = HttpKit.download(uri);
        return avator(data, uid);
    }

    public String avator(byte[] data, String uid) {
        if (data == null) {
            return null;
        }
        String webPath = String.format("/avator/%s/%s/",
                uid.substring(0, 3), uid.substring(3, 6), uid.substring(6) + ".jpg");
        String path = ZenEnvironment.getPath() + "/upload" + webPath;

        File dir = new File(path);
        if (!dir.isDirectory()) {
            dir.mkdirs();
        }
        String fileName = uid.substring(6) + ".jpg";
        path += fileName;
        this.save(data, path);
        return webPath + fileName;
    }

    public String image(byte[] data, String ext) {
        String id = StringKit.objectId(),
                relPath = "/upload/" + String.format("%s/%s", id.substring(0, 3), id.substring(3, 6)),
                fileName = "/" + id.substring(6) + "." + ext;

        String pyPath = ZenEnvironment.getPath() + relPath;
        File dir = new File(pyPath);
        if (!dir.isDirectory()) {
            dir.mkdirs();
        }
        this.save(data, pyPath + fileName);
        return relPath + fileName;
    }

    public String file(byte[] data, String id, String ext) {
        if (data == null) {
            return null;
        }
        String webPath = String.format("/%s/%s/",
                id.substring(0, 3), id.substring(3, 6));
        String path = ZenEnvironment.getPath() + "/upload" + webPath;

        File dir = new File(path);
        if (!dir.isDirectory()) {
            dir.mkdirs();
        }
        String fileName = id.substring(6) + "." + ext;
        path += fileName;
        this.save(data, path);
        return "/upload" + webPath + fileName;
    }

    private void save(byte[] data, String path) {
        File file = new File(path);
        FileOutputStream outputStream = null;
        try {
            outputStream = new FileOutputStream(file);
            outputStream.write(data);
        } catch (Exception e) {
            log.error("", e);
        } finally {
            if (outputStream != null) {
                try {
                    outputStream.close();
                } catch (IOException e) {
                    log.error("", e);
                }
            }
        }
    }
}
