package com.zeto.kooteam.service.install;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientOptions;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.zeto.ZenCache;
import com.zeto.ZenData;
import com.zeto.ZenResult;
import com.zeto.domain.ZenAction;
import com.zeto.kooteam.service.domain.AppConf;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Slf4j
public class DBValidate {
    private static final String testTable = "k_test";
    private static final String[] errorDB = new String[]{"system", "mysql"};

    public static ZenResult check(ZenData data) {
        String dbName = data.get("database");
        for (String name : errorDB) {
            if (name.equals(dbName)) {
                return ZenResult.fail("数据库名称不能为系统关键字");
            }
        }
        AppConf conf = ZenCache.get(AppConf.cacheKey, AppConf.class);
        if (conf == null) {
            conf = new AppConf();
        }
        conf.setDbType(data.get("dbType"));
        conf.setHost(data.get("host"));
        conf.setDatabase(dbName);
        conf.setUser(data.get("user"));
        conf.setPassword(data.get("password"));
        conf.setPort(data.get("port"));
        if (conf.isMysql()) {
            return testMysql(conf);
        }
        return testClient(conf);
    }

    private static ZenResult testMysql(AppConf conf) {
        String URL = "jdbc:mysql://" + conf.getHost() + ":" + conf.getPort() + "/" + conf.getDatabase() + "?serverTimezone=UTC";
        String sql = "show tables";
        Connection conn = null;
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn = DriverManager.getConnection(URL, conf.getUser(), conf.getPassword());
            Statement ps = conn.createStatement();
            ResultSet rs = ps.executeQuery(sql);
            if (rs.next()) {
                System.out.println(rs.getString(1));
                // 矫正数据库编码
                sql = "alter database `" + conf.getDatabase() + "` default character set utf8 COLLATE utf8_unicode_ci;";
                ps.executeUpdate(sql);
            }
            rs.close();
        } catch (Exception e) {
            conf.setDbCheck(false);
            ZenCache.set(AppConf.cacheKey, conf);
            log.error("", e);
            return ZenResult.fail("数据库检查失败");
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    log.error("", e);
                    return ZenResult.error(e);
                }
            }
        }
        conf.setDbCheck(true);
        ZenCache.set(AppConf.cacheKey, conf);
        return ZenResult.success("MySQL测试成功").setAction(ZenAction.SILENT);
    }

    // 校验数据库链接
    private static ZenResult testClient(AppConf conf) {
        conf.setDbCheck(false);
        String uri = conf.getHost();
        try {
            MongoCredential credential = MongoCredential.createScramSha1Credential(conf.getUser(),
                    conf.getDatabase(), conf.getPassword().toCharArray());
            String[] uriList = uri.split(",");
            List<ServerAddress> addrs = new ArrayList<>();
            for (String address : uriList) {

                ServerAddress serverAddress = new ServerAddress(address, Integer.parseInt(conf.getPort()));
                addrs.add(serverAddress);
            }

            MongoClientOptions.Builder build = new MongoClientOptions.Builder();
            build.sslEnabled(false);
            build.connectTimeout(5000);
            build.maxWaitTime(3000);
            build.socketTimeout(3000);
            build.heartbeatSocketTimeout(3000);
            MongoClient client = new MongoClient(addrs, credential, build.build());
            MongoDatabase database = client.getDatabase(conf.getDatabase());
//            database.createCollection(testTable);
            MongoCollection<Document> doc = database.getCollection(testTable);
            Document bsonDocument = new Document();
            bsonDocument.append("name", conf.getDatabase());
            doc.insertOne(bsonDocument);
            if (doc.countDocuments() > 0) {
                conf.setDbCheck(true);
                ZenCache.set(AppConf.cacheKey, conf);
                return ZenResult.success("MongoDB数据库链接成功").setAction(ZenAction.SILENT);
            }
            doc.drop();
        } catch (Exception e) {
            log.error("", e);
            return ZenResult.error(e);
        }
        return ZenResult.fail("数据库链接失败");
    }

}
