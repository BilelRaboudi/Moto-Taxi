package com.mototaxi.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class RealtimeWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Map: sessionId -> WebSocketSession
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    // Map: userId -> sessionId
    private final Map<String, String> userSessions = new ConcurrentHashMap<>();

    // Map: driverId -> sessionId (drivers currently online)
    private final Map<String, String> onlineDrivers = new ConcurrentHashMap<>();

    // Set: admin sessionIds
    private final Set<String> adminSessions = ConcurrentHashMap.newKeySet();

    // Map: rideId -> Set<sessionId>
    private final Map<String, Set<String>> rideRooms = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.put(session.getId(), session);
        log.info("[WebSocket] Session connectee: {}", session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        try {
            JsonNode root = objectMapper.readTree(message.getPayload());
            String event = root.path("event").asText("");
            JsonNode data = root.path("data");

            switch (event) {
                case "auth":
                case "user:identify":
                    handleIdentify(session, data);
                    break;

                case "driver:updateLocation":
                    handleDriverLocation(session, data);
                    break;

                case "driver:online":
                    handleDriverOnline(session, data);
                    break;

                case "driver:offline":
                    handleDriverOffline(session, data);
                    break;

                case "ride:join":
                    handleRideJoin(session, data);
                    break;

                case "ride:accepted":
                    handleRideAccepted(session, data);
                    break;

                case "ride:rejected":
                    handleRideRejected(session, data);
                    break;

                case "customer:sos":
                    handleCustomerSos(session, data);
                    break;

                case "ping":
                    sendMessage(session, "pong", Map.of("time", System.currentTimeMillis()));
                    break;

                default:
                    log.debug("[WebSocket] Evenement non gere: {}", event);
            }
        } catch (Exception e) {
            log.error("[WebSocket] Erreur traitement message: {}", e.getMessage());
        }
    }

    private void handleIdentify(WebSocketSession session, JsonNode data) {
        String userId = data.path("userId").asText(null);
        String role = data.path("role").asText("");

        if (userId != null && !userId.isBlank()) {
            userSessions.put(userId, session.getId());
            session.getAttributes().put("userId", userId);
            session.getAttributes().put("role", role);

            if ("DRIVER".equalsIgnoreCase(role)) {
                onlineDrivers.put(userId, session.getId());
                log.info("[WebSocket] Chauffeur connecte: {}", userId);
            } else if ("ADMIN".equalsIgnoreCase(role)) {
                adminSessions.add(session.getId());
                log.info("[WebSocket] Admin connecte: {}", userId);
            }
        }
    }

    private void handleDriverLocation(WebSocketSession session, JsonNode data) {
        String driverId = data.path("driverId").asText();
        double lat = data.path("lat").asDouble();
        double lng = data.path("lng").asDouble();
        String rideId = data.path("rideId").asText(null);

        Map<String, Object> payload = new HashMap<>();
        payload.put("driverId", driverId);
        payload.put("lat", lat);
        payload.put("lng", lng);
        payload.put("timestamp", System.currentTimeMillis());

        // Broadcast to ride room if in progress
        if (rideId != null && !rideId.isBlank()) {
            broadcastToRide(rideId, "driver:locationUpdated", payload);
        }

        // Always broadcast location to admins
        broadcastToAdmins("driver:locationUpdated", payload);
    }

    private void handleDriverOnline(WebSocketSession session, JsonNode data) {
        String driverId = data.path("driverId").asText();
        onlineDrivers.put(driverId, session.getId());
        broadcastToAdmins("driver:onlineStatus", Map.of("driverId", driverId, "online", true));
    }

    private void handleDriverOffline(WebSocketSession session, JsonNode data) {
        String driverId = data.path("driverId").asText();
        onlineDrivers.remove(driverId);
        broadcastToAdmins("driver:offlineStatus", Map.of("driverId", driverId, "online", false));
    }

    private void handleRideJoin(WebSocketSession session, JsonNode data) {
        String rideId = data.path("rideId").asText();
        rideRooms.computeIfAbsent(rideId, k -> ConcurrentHashMap.newKeySet()).add(session.getId());
    }

    private void handleRideAccepted(WebSocketSession session, JsonNode data) {
        String customerId = data.path("customerId").asText();
        String rideId = data.path("rideId").asText();
        broadcastToUser(customerId, "ride:driverAccepted", data);
        broadcastToRide(rideId, "ride:accepted", data);
    }

    private void handleRideRejected(WebSocketSession session, JsonNode data) {
        String customerId = data.path("customerId").asText();
        broadcastToUser(customerId, "ride:driverRejected", data);
    }

    private void handleCustomerSos(WebSocketSession session, JsonNode data) {
        broadcastToAdmins("sos:alert", data);
        log.warn("[WebSocket] ALERTE SOS recue: {}", data);
    }

    // Public broadcast helpers for Spring services
    public void broadcastNewRideRequest(Object rideData) {
        for (String sessionId : onlineDrivers.values()) {
            WebSocketSession s = sessions.get(sessionId);
            if (s != null && s.isOpen()) {
                sendMessage(s, "ride:incomingRequest", rideData);
            }
        }
    }

    public void broadcastToRide(String rideId, String event, Object data) {
        Set<String> roomSessions = rideRooms.get(rideId);
        if (roomSessions != null) {
            for (String sid : roomSessions) {
                WebSocketSession s = sessions.get(sid);
                if (s != null && s.isOpen()) {
                    sendMessage(s, event, data);
                }
            }
        }
    }

    public void broadcastToUser(String userId, String event, Object data) {
        String sid = userSessions.get(userId);
        if (sid != null) {
            WebSocketSession s = sessions.get(sid);
            if (s != null && s.isOpen()) {
                sendMessage(s, event, data);
            }
        }
    }

    public void broadcastToAdmins(String event, Object data) {
        for (String sid : adminSessions) {
            WebSocketSession s = sessions.get(sid);
            if (s != null && s.isOpen()) {
                sendMessage(s, event, data);
            }
        }
    }

    private void sendMessage(WebSocketSession session, String event, Object data) {
        try {
            Map<String, Object> msg = new HashMap<>();
            msg.put("event", event);
            msg.put("data", data);
            String json = objectMapper.writeValueAsString(msg);
            synchronized (session) {
                if (session.isOpen()) {
                    session.sendMessage(new TextMessage(json));
                }
            }
        } catch (IOException e) {
            log.error("[WebSocket] Erreur envoi message a {}: {}", session.getId(), e.getMessage());
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session.getId());
        adminSessions.remove(session.getId());

        String userId = (String) session.getAttributes().get("userId");
        if (userId != null) {
            userSessions.remove(userId);
            onlineDrivers.remove(userId);
        }

        for (Set<String> room : rideRooms.values()) {
            room.remove(session.getId());
        }

        log.info("[WebSocket] Session fermee: {}", session.getId());
    }
}
