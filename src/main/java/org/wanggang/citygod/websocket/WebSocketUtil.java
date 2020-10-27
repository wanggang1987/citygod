/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wanggang.citygod.websocket;

import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import javax.websocket.RemoteEndpoint.Async;
import javax.websocket.Session;
import org.wanggang.citygod.message.Message;
import org.wanggang.citygod.util.BeanUtils;

/**
 *
 * @author wanggang
 */
public class WebSocketUtil {

    private static final Map<Long, Session> USER_SESSION = new ConcurrentHashMap<>();
    private static final Map<String, Session> ANONYMOUS_SESSION = new ConcurrentHashMap<>();

    public static void addSession(Long userId, Session session) {
        if (userId == 0) {
            ANONYMOUS_SESSION.put(session.getId(), session);
        } else {
            USER_SESSION.put(userId, session);
        }
    }

    public static void remoteSession(Long userId) {
        USER_SESSION.remove(userId);
    }

    private static void sendMessage(Session session, String message) {
        if (session == null) {
            return;
        }
        Async async = session.getAsyncRemote();
        async.sendText(message);
    }

    public static void sendMessageForAll(Long fromUserId, Session fromSession, Message message) {
        String messageString = BeanUtils.bean2json(message);
        USER_SESSION.forEach((toUserId, toSession)
                -> {
            if (Objects.equals(fromUserId, toUserId)) {
                return;
            }
            sendMessage(toSession, messageString);
        }
        );
        ANONYMOUS_SESSION.forEach((toUserId, toSession)
                -> {
            if (Objects.equals(fromSession.getId(), toUserId)) {
                return;
            }
            sendMessage(toSession, messageString);
        }
        );
    }
}
