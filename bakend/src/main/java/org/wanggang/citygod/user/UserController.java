/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wanggang.citygod.user;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.wanggang.citygod.common.ResponseCommon;
import org.wanggang.citygod.util.BeanUtils;

/**
 *
 * @author wanggang
 */
@Slf4j
@RestController
@RequestMapping("user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("create")
    public ResponseCommon createUser(@RequestBody User user) {
        log.info(BeanUtils.bean2json(user));

        return ResponseCommon.response(userService.createUser(user));
    }
}
