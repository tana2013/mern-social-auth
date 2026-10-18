import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';

interface AuthenticatedWebSocket extends WebSocket {
    userId?: string;
}

export const activeUsers = new Set<string>();

export const initWebSocket = (wss: WebSocketServer) => {
    wss.on('connection', (ws: AuthenticatedWebSocket, req) => {
        // Extract token from query params: ws://localhost:5000?token=XYZ
        const url = new URL(req.url || '', `http://${req.headers.host}`);
        const token = url.searchParams.get('token');

        if (!token) {
            ws.close(4001, 'Unauthorized');
            return;
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { id: string };
            ws.userId = decoded.id;
            activeUsers.add(decoded.id);

            // Broadcast fresh pool count to all clients
            broadcastActiveCount(wss);
        } catch (err) {
            ws.close(4001, 'Invalid Token');
            return;
        }

        ws.on('close', () => {
            if (ws.userId) {
                activeUsers.delete(ws.userId);
                broadcastActiveCount(wss);
            }
        });
    });
};

const broadcastActiveCount = (wss: WebSocketServer) => {
    const data = JSON.stringify({ type: 'ACTIVE_USERS_COUNT', count: activeUsers.size });
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};
