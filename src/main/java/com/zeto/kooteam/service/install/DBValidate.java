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
import org.bson.Document;

import java.util.ArrayList;
import java.util.List;

public class DBValidate {
    private static final String testTable = "k_test";

    public static ZenResult check(ZenData data) {
        AppConf conf = ZenCache.get(AppConf.cacheKey, AppConf.class);
        if (conf == null) {
            conf = new AppConf();
        }
        conf.setMongoHost(data.get("mongoHost"));
        conf.setMongoDB(data.get("mongoDB"));
        conf.setMongoUser(data.get("mongoUser"));
        conf.setMongoPassword(data.get("mongoPassword"));
        conf.setMongoPort(data.get("mongoPort"));
        return testClient(conf);
    }

    // 校验数据库链接
    private static ZenResult testClient(AppConf conf) {
        conf.setDbCheck(false);
        String uri = conf.getMongoHost();
        try {
            MongoCredential credential = MongoCredential.createScramSha1Credential(conf.getMongoUser(), conf.getMongoDB(), conf.getMongoPassword().toCharArray());
            String[] uriList = uri.split(",");
            List<ServerAddress> addrs = new ArrayList<>();
            for (String address : uriList) {

                ServerAddress serverAddress = new ServerAddress(address, Integer.parseInt(conf.getMongoPort()));
                addrs.add(serverAddress);
            }

            MongoClientOptions.Builder build = new MongoClientOptions.Builder();
            build.sslEnabled(false);
            build.connectTimeout(5000);
            build.maxWaitTime(3000);
            build.socketTimeout(3000);
            build.heartbeatSocketTimeout(3000);
            MongoClient client = new MongoClient(addrs, credential, build.build());
            MongoDatabase database = client.getDatabase(conf.getMongoDB());
//            database.createCollection(testTable);
            MongoCollection<Document> doc = database.getCollection(testTable);
            Document bsonDocument = new Document();
            bsonDocument.append("name", conf.getDingAppName());
            doc.insertOne(bsonDocument);
            if (doc.count() > 0) {
                conf.setDbCheck(true);
                ZenCache.set(AppConf.cacheKey, conf);
                return ZenResult.success("数据库链接成功").setAction(ZenAction.SILENT);
            }
            doc.drop();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ZenResult.fail("数据库链接失败");
    }
}
