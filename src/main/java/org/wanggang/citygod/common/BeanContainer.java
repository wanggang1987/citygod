/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wanggang.citygod.common;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.wanggang.citygod.message.MessageService;

/**
 *
 * @author wanggang
 */
@Component
public class BeanContainer {

    private static MessageService messageService;

    @Autowired
    public void setAuthClient(MessageService messageService) {
        BeanContainer.messageService = messageService;
    }

    public static MessageService getMessageService() {
        return messageService;
    }
}
