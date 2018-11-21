package com.zeto.kooteam.service.eventbus;

import com.blade.kit.StringKit;
import com.google.common.base.Strings;
import com.google.common.eventbus.Subscribe;
import com.zeto.dal.UserMapper;
import com.zeto.domain.ZenUser;
import com.zeto.kooteam.dingtalk.domain.DingUserData;
import com.zeto.kooteam.dingtalk.domain.DingUserResult;
import com.zeto.kooteam.dingtalk.service.DingDepartmentService;
import com.zeto.kooteam.service.UploaderService;
import com.zeto.kooteam.service.eventbus.model.EmployeeModel;

public class EmployeeListener {
    private static final String from = "dingtalk";
    private DingDepartmentService departmentService = new DingDepartmentService();
    private UploaderService uploaderService = new UploaderService();

    @Subscribe
    public void execute(EmployeeModel model) {
        DingUserResult rootDepartment = departmentService.selectByParent(1L);
        for (DingUserData data : rootDepartment.getData()) {
            syncByDepartment(data);
        }
    }

    private void syncByDepartment(DingUserData data) {
        long departmentId = Long.parseLong(data.getId());
        DingUserResult sonDepartment = departmentService.selectByParent(departmentId);
        if (sonDepartment.isDepartment()) {
            for (DingUserData item : sonDepartment.getData()) {
                syncByDepartment(item);
            }
            return;
        }
        for (DingUserData item : sonDepartment.getData()) {
            syncUser(item);
        }
    }

    // 同步用户信息
    private void syncUser(DingUserData item) {
        String unionId = item.getDingId();
        if (UserMapper.i().existByUnionId(unionId, from)) {
            return;
        }
        ZenUser user = new ZenUser();
        String uid = StringKit.objectId();
        user.setUid(uid);
        user.setNick(item.getName());
        user.setFrom(from);
        user.setUkey(unionId);
        user.setDingUid(item.getId());
        user.setUnionId(unionId);
        UserMapper.i().insert(user);
        String avator = item.getAvator();
        if (Strings.isNullOrEmpty(avator)) {
            return;
        }
        uploaderService.avator(avator, uid);
    }
}
