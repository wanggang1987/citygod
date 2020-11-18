/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wanggang.citygod.user;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.wanggang.citygod.common.ResponseStatus;
import org.wanggang.citygod.util.FunctionUtils;

/**
 *
 * @author wanggang
 */
@Slf4j
@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    public ResponseStatus createUser(User user) {
        user.setId(null);
        if (FunctionUtils.isEmpty(user.getMobile()) || FunctionUtils.isEmpty(user.getName())) {
            return ResponseStatus.ERROR_REQUEST;
        }

        userMapper.insert(user);
        return ResponseStatus.SUCCESS;
    }
}
