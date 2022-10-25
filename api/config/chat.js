const io = require('socket.io')(4000, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  socket.on('join', ({ room }) => {
    socket.join(room);
  });

  socket.on('message', ({ id, user, text, type, room, date }) => {
    socket.to(room).emit('message', { id, user, text, type, room, date });
  });

  socket.on('delete', ({ id, room }) => {
    socket.to(room).emit('delete', { messageId: id });
  });
});
