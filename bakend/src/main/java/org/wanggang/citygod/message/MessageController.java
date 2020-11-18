/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wanggang.citygod.message;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.wanggang.citygod.common.ResponseCommon;
import org.wanggang.citygod.common.RequestMessagePull;
import org.wanggang.citygod.util.BeanUtils;

/**
 *
 * @author wanggang
 */
@Api(tags = "消息模块")
@Slf4j
@RestController
@RequestMapping("message")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @ApiOperation(value = "发送消息", notes = "只接受一条消息")
    @PostMapping("send")
    public ResponseCommon sendMessage(@RequestBody Message message) {
        log.info(BeanUtils.bean2json(message));

        messageService.insertOneMessage(message);
        return ResponseCommon.success();
    }

    @ApiOperation(value = "拉取消息", notes = "按时间倒序返回最新消息list，不超过100条")
    @GetMapping("pull")
    public ResponseCommon pullMessage(RequestMessagePull pullRequest) {
        log.info(BeanUtils.bean2json(pullRequest));

        List<Message> list = messageService.pullMessages(pullRequest);
        return ResponseCommon.success(list);
    }
}
