package com.zeto.kooteam.controller;

import com.blade.ioc.annotation.Inject;
import com.blade.kit.StringKit;
import com.zeto.ZenData;
import com.zeto.ZenFiles;
import com.zeto.ZenResult;
import com.zeto.annotation.AccessRole;
import com.zeto.domain.ZenPostFile;
import com.zeto.domain.ZenUser;
import com.zeto.driver.ZenStorageEngine;
import com.zeto.kooteam.service.UploaderService;

import java.util.HashMap;
import java.util.Map;

@AccessRole
public class Upload {

    @Inject
    private UploaderService uploaderService;

    @Inject
    private ZenStorageEngine zenStorageEngine;

    private static Map<String, String> contentTypeMap = new HashMap<String, String>() {
        {
            put("image/gif", "gif");
            put("image/png", "png");
            put("image/jpeg", "jpg");
            put("text/plain", "txt");
        }
    };

    public ZenResult avator(ZenUser user, ZenFiles files) {
        ZenPostFile fileItem = files.get("file");
        if (fileItem == null) {
            return ZenResult.fail("请选择文件");
        }
        String savePath = this.uploaderService.avator(fileItem.getData(), user.getUid());
        return ZenResult.success().put("url", savePath);
    }

    // 上传图片
    public ZenResult image(ZenData data, ZenFiles files) {
        ZenPostFile fileItem = files.get("file");
        if (fileItem == null) {
            return ZenResult.fail("请选择文件");
        }
        String contentType = fileItem.getContentType();
        String ext = contentTypeMap.get(contentType);
        if (ext == null) {
            return ZenResult.fail("图片格式错误，只支持PNG,JPG,GIF图片");
        }
        String savePath = this.uploaderService.image(fileItem.getData(), ext);
        return ZenResult.success().setData(savePath);
    }

    // 上传附件
    public ZenResult file(ZenData data, ZenFiles files, ZenUser user) {
        ZenPostFile fileItem = files.get("file");
        if (fileItem == null) {
            return ZenResult.fail("请选择文件");
        }
        String contentType = fileItem.getContentType(), fileName = fileItem.getFileName();
        String ext = contentTypeMap.get(contentType);
        if (ext == null && fileName.contains(".")) {
            ext = fileName.substring(fileName.lastIndexOf(".") + 1);
        }
        String savePath = this.uploaderService.file(fileItem.getData(), StringKit.objectId(), ext);
        if (data.contains("parentId")) {
            data.put("url", savePath);
            data.put("title", fileName);
            data.put("size", fileItem.getLength());
            return zenStorageEngine.execute("put/attach", data, user);
        }
        return ZenResult.success()
                .put("url", savePath)
                .put("title", fileName)
                .put("size", fileItem.getLength());
    }
}
