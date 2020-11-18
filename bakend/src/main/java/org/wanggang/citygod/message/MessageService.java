/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wanggang.citygod.message;

import java.sql.Timestamp;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.wanggang.citygod.common.RequestMessagePull;
import org.wanggang.citygod.util.FunctionUtils;

/**
 *
 * @author wanggang
 */
@Slf4j
@Service
public class MessageService {
    
    private final Long defaultId = 0L;
    private final String defaultUser = "匿名用户";
    private final String defaultTopic = "附近的人";
    
    @Autowired
    private MessageMapper messageMapper;
    
    public void insertOneMessage(Message message) {
        if (FunctionUtils.isEmpty(message.getUserId())) {
            message.setUserId(defaultId);
        }
        if (FunctionUtils.isEmpty(message.getNickName())) {
            message.setNickName(defaultUser);
        }
        if (FunctionUtils.isEmpty(message.getTopic())) {
            message.setTopic(defaultTopic);
        }
        if (FunctionUtils.isEmpty(message.getType())) {
            message.setType(MessageType.TEXT);
        }
        message.setCreateTime(FunctionUtils.currentTime());
        message.setUpdateTime(FunctionUtils.currentTime());
        messageMapper.insert(message);
    }
    
    public List<Message> pullMessages(RequestMessagePull pullRequest) {
        if (FunctionUtils.isEmpty(pullRequest.getLimit())
                || pullRequest.getLimit() < 1
                || pullRequest.getLimit() > 100) {
            pullRequest.setLimit(100L);
        }
        if (FunctionUtils.isEmpty(pullRequest.getTopic())) {
            pullRequest.setTopic(defaultTopic);
        }
        if (FunctionUtils.isEmpty(pullRequest.getStarTime())) {
            pullRequest.setStarTime(new Timestamp(0));
        }
        return messageMapper.pull(pullRequest);
    }
    
}
