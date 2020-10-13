/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wanggang.citygod.message;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.wanggang.citygod.common.CommonResponse;
import org.wanggang.citygod.common.PullRequest;
import org.wanggang.citygod.util.DomainUtils;

/**
 *
 * @author wanggang
 */
@RestController
@RequestMapping("message")
public class MessageController {

    private final Logger log = LoggerFactory.getLogger(this.getClass());
    @Autowired
    private MessageService messageService;

    @PostMapping("send")
    public CommonResponse sendMessage(@RequestBody Message message) {
        log.info(DomainUtils.bean2json(message));

        messageService.insertOne(message);
        return CommonResponse.success();
    }

    @GetMapping("pull")
    public CommonResponse pullMessage(PullRequest pullRequest) {
        log.info(DomainUtils.bean2json(pullRequest));

        List<Message> list = messageService.pull(pullRequest);
        return CommonResponse.success(list);
    }
}
