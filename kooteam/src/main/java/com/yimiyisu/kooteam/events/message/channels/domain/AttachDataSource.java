package com.yimiyisu.kooteam.events.message.channels.domain;

import com.zen.kit.UploadKit;
import jakarta.activation.DataSource;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class AttachDataSource implements DataSource {

    private final String name;

    public AttachDataSource(String path) {
        this.name = path;
    }

    @Override
    public InputStream getInputStream() throws IOException {
        return  UploadKit.getAsStream(this.name);
    }

    @Override
    public OutputStream getOutputStream() throws IOException {
        return null;
    }

    @Override
    public String getContentType() {
        return "application/octet-stream";
    }

    @Override
    public String getName() {
        return this.name;
    }
}
