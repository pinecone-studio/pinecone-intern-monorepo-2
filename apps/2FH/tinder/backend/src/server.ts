import { createServer, Server as HttpServer } from 'http';
import { Server as SocketIOServer, DefaultEventsMap } from 'socket.io';
import mongoose from 'mongoose';

// Socket.IO ба userSockets экспортлох
export const userSockets = new Map<string, string>();

// MongoDB холболт
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/chat';

// Only connect to MongoDB if not in test environment
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('MongoDB-тай холбогдлоо');
    })
    .catch((error) => {
      console.error('MongoDB холболтын алдаа:', error);
    });
}

// HTTP сервер ба Socket.IO
export let httpServer: HttpServer | undefined;
export let io: SocketIOServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | undefined;

try {
  httpServer = createServer();
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('Хэрэглэгч холбогдлоо:', socket.id);

    socket.on('register', (userId: string) => {
      userSockets.set(userId, socket.id);
      console.log(`Хэрэглэгч ${userId} холбогдлоо: ${socket.id}`);
    });

    socket.on('disconnect', () => {
      console.log('Хэрэглэгч саллаа:', socket.id);
      for (const [userId, socketId] of userSockets) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          break;
        }
      }
    });
  });
} catch (error) {
  console.error('Серверийг эхлүүлэхэд алдаа гарлаа:', error);
}

// Тестын дараа сервер хаах
export const closeServer = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (io) {
      io.removeAllListeners(); // Socket.IO event listeners-ийг цэвэрлэх
      io.close();
    }
    if (httpServer) {
      httpServer.close((err) => {
        if (err) {
          console.error('HTTP серверийг хаахад алдаа гарлаа:', err);
          return reject(err);
        }
        mongoose.disconnect()
          .then(() => {
            console.log('MongoDB холболт хаагдлаа');
            resolve();
          })
          .catch((error) => {
            console.error('MongoDB холболтыг хаахад алдаа гарлаа:', error);
            reject(error);
          });
      });
    } else {
      mongoose.disconnect()
        .then(() => {
          console.log('MongoDB холболт хаагдлаа');
          resolve();
        })
        .catch((error) => {
          console.error('MongoDB холболтыг хаахад алдаа гарлаа:', error);
          reject(error);
        });
    }
  });
};