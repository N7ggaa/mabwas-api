import express from 'express';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';

dotenv.config();
await connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: '15mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date() }));

const server = http.createServer(app);
const io = new IOServer(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('Socket connected', socket.id);

  socket.on('party:create', ({ partyId }) => {
    socket.join(partyId);
    socket.data.partyId = partyId;
    socket.emit('party:created', { partyId, socketId: socket.id });
    console.log(`Party created: ${partyId} by ${socket.id}`);
  });

  socket.on('party:join', ({ partyId, clientMeta }) => {
    socket.join(partyId);
    socket.data.partyId = partyId;
    socket.to(partyId).emit('party:peer-joined', { socketId: socket.id, clientMeta });
    socket.emit('party:joined', { partyId, socketId: socket.id });
    console.log(`${socket.id} joined ${partyId}`);
  });

  socket.on('party:data', ({ partyId, payload }) => {
    socket.to(partyId).emit('party:event', { socketId: socket.id, payload });
  });

  socket.on('disconnect', (reason) => {
    const pid = socket.data.partyId;
    if (pid) socket.to(pid).emit('party:peer-left', { socketId: socket.id });
    console.log('Socket disconnected', socket.id, reason);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
