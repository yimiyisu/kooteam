package com.zeto.kooteam.service;

import com.blade.ioc.annotation.Bean;
import com.blade.ioc.annotation.Inject;
import com.blade.kit.StringKit;
import com.google.common.io.ByteStreams;
import com.zeto.ZenEnvironment;
import com.zeto.driver.ZenLoggerEngine;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

@Bean
public class UploaderService {
    @Inject
    private ZenLoggerEngine zenLoggerEngine;

    public String avator(String uri, String uid) {
        byte[] data = download(uri);
        if (data == null) {
            return null;
        }
        String path = ZenEnvironment.getPath() + String.format("/res/avator/%s/%s/",
                uid.substring(0, 4), uid.substring(4, 6));
        File dir = new File(path);
        if (!dir.isDirectory()) {
            dir.mkdirs();
        }
        path += uid.substring(6) + ".jpg";
        this.save(data, path);
        return path;
    }

    public String image(byte[] data, String ext) {
        String id = StringKit.objectId(),
                relPath = "/upload/" + String.format("%s/%s", id.substring(0, 4), id.substring(4, 6)),
                fileName = "/" + id.substring(6) + "." + ext;

        String pyPath = ZenEnvironment.getPath() + "/res" + relPath;
        File dir = new File(pyPath);
        if (!dir.isDirectory()) {
            dir.mkdirs();
        }
        this.save(data, pyPath + fileName);
        return relPath + fileName;
    }

    public String file(byte[] data, String id, String ext) {
        return null;
    }

    private void save(byte[] data, String path) {
        File file = new File(path);
        FileOutputStream outputStream = null;
        try {
            outputStream = new FileOutputStream(file);
            outputStream.write(data);
        } catch (Exception e) {
            zenLoggerEngine.exception(e);
        } finally {
            if (outputStream != null) {
                try {
                    outputStream.close();
                } catch (IOException e) {
                    zenLoggerEngine.exception(e);
                }
            }
        }
    }

    // 下载远程图片
    private byte[] download(String url) {
        try {
            HttpGet httpGet = new HttpGet(url);
            CloseableHttpClient httpClient;
            if (url.contains("https:")) {
                httpClient = new SSLClient();
            } else {
                httpClient = HttpClients.createDefault();
            }

            // 客户端开始向指定的网址发送请求
            CloseableHttpResponse response = httpClient.execute(httpGet);
            if (response.getStatusLine().getStatusCode() != 200) {
                return null;
            }
            HttpEntity entity = response.getEntity();
            if (entity == null) {
                return null;
            }
            InputStream inputStream = entity.getContent();
            // 使用guava 实现输入字节码转换
            byte[] in2b = ByteStreams.toByteArray(inputStream);
            inputStream.close();
            return in2b;
        } catch (Exception e) {
            zenLoggerEngine.exception(e);
        }
        return null;
    }
}
