package com.yimiyisu.kooteam.kit.openPlatform;

import com.yimiyisu.kooteam.domain.DepartmentDO;
import com.yimiyisu.kooteam.domain.DepartmentUserDO;
import com.zen.domain.ZenUser;

import java.util.List;

public class DefaultPlatform implements IOpenPlatform {
    @Override
    public String getAccessToken() {
        return "";
    }

    @Override
    public void refreshToken() {

    }

    @Override
    public void completeUser(ZenUser user) {

    }

    @Override
    public String sendMessage(ZenUser to, String content) {
        return "";
    }

    @Override
    public List<DepartmentDO> syncDepartmentData() {
        return List.of();
    }

    @Override
    public List<DepartmentUserDO> syncUserData(String deptId) {
        return List.of();
    }
}
