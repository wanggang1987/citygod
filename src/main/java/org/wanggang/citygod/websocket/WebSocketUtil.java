/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.wanggang.citygod.websocket;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import javax.websocket.RemoteEndpoint.Async;
import javax.websocket.Session;

/**
 *
 * @author wanggang
 */
public class WebSocketUtil {

    private static final Map<Long, Session> ONLINE_SESSION = new ConcurrentHashMap<>();

    public static void addSession(Long userId, Session session) {
        ONLINE_SESSION.put(userId, session);
    }

    public static void remoteSession(Long userId) {
        ONLINE_SESSION.remove(userId);
    }

    private static void sendMessage(Session session, String message) {
        if (session == null) {
            return;
        }
        Async async = session.getAsyncRemote();
        async.sendText(message);
    }

    public static void sendMessageForAll(String message) {
        ONLINE_SESSION.forEach((userId, session) -> sendMessage(session, message));
    }
}
