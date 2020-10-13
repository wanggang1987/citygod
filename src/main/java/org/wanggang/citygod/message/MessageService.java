/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wanggang.citygod.message;

import java.sql.Timestamp;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.wanggang.citygod.common.PullRequest;
import org.wanggang.citygod.util.FunctionUtils;

/**
 *
 * @author wanggang
 */
@Service
public class MessageService {

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private MessageMapper messageMapper;

    public void insertOne(Message message) {
        if (FunctionUtils.isEmpty(message.getUserId())) {
            message.setUserId(0L);
        }
        if (FunctionUtils.isEmpty(message.getNickName())) {
            message.setNickName("李雪琴");
        }
        message.setCreateTime(FunctionUtils.currentTime());
        message.setUpdateTime(FunctionUtils.currentTime());
        messageMapper.insert(message);
    }

    public List<Message> pull(PullRequest pullRequest) {
        if (FunctionUtils.isEmpty(pullRequest.getLimit())
                || pullRequest.getLimit() < 1
                || pullRequest.getLimit() > 100) {
            pullRequest.setLimit(100L);
        }
        if (FunctionUtils.isEmpty(pullRequest.getStarTime())) {
            pullRequest.setStarTime(new Timestamp(0));
        }
        return messageMapper.pull(pullRequest);
    }

}
