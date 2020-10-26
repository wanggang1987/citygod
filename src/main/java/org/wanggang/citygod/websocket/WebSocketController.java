package org.wanggang.citygod.websocket;

import java.io.IOException;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 *
 * @author wanggang
 */
@Slf4j
@Controller
@ServerEndpoint(value = "/websocket")
public class WebSocketController {

    @OnOpen
    public void onOpen(@PathParam(value = "userId") Long userId, Session session) {
        log.info("user log in: " + userId);
        WebSocketUtil.addSession(userId, session);
    }

    @OnClose
    public void onClose(@PathParam(value = "userId") Long userId, Session session) {
        log.info("user log out: " + userId);
        WebSocketUtil.remoteSession(userId);
    }

    @OnMessage
    public void OnMessage(@PathParam(value = "usernick") String userNick, String message) {
        log.info("user message: " + message);
        WebSocketUtil.sendMessageForAll(message);
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        log.error("exception:", throwable);
        try {
            session.close();
        } catch (IOException e) {
        }
    }
}
