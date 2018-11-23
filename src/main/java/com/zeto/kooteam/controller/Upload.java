package com.zeto.kooteam.controller;

import com.blade.ioc.annotation.Inject;
import com.zeto.ZenData;
import com.zeto.ZenFiles;
import com.zeto.ZenResult;
import com.zeto.annotation.AccessRole;
import com.zeto.domain.ZenPostFile;
import com.zeto.kooteam.service.UploaderService;

import java.util.HashMap;
import java.util.Map;

@AccessRole
public class Upload {

    @Inject
    private UploaderService uploaderService;

    private static Map<String, String> contentTypeMap = new HashMap<String, String>() {
        {
            put("image/gif", "gif");
            put("image/png", "png");
            put("image/jpeg", "jpg");
        }
    };

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

    public ZenResult file() {
        return ZenResult.success();
    }
}
