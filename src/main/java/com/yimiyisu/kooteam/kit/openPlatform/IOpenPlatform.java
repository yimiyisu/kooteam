package com.yimiyisu.kooteam.kit.openPlatform;

import com.yimiyisu.kooteam.domain.DepartmentDO;
import com.yimiyisu.kooteam.domain.DepartmentUserDO;
import com.zen.domain.ZenUser;

import java.util.List;

public interface IOpenPlatform {

    // 获取token
    String getAccessToken();
    
    void refreshToken();

    // 补全用户个人信息
    void completeUser(ZenUser user);

    // 发送平台消息
    String sendMessage(ZenUser to, String content);

    /**
     * 同步部门数据
     */
    List<DepartmentDO> syncDepartmentData();

    /**
     * 同步部门成员
     */
    List<DepartmentUserDO> syncUserData(String deptId);
}
