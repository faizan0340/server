const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('New client connected');
  
    socket.on('updateLocation', (locationData) => {
      // Validate the structure of locationData before accessing its properties
      if (
        locationData &&
        locationData.name &&
        locationData.uid &&
        typeof locationData.latitude === 'number' &&
        typeof locationData.longitude === 'number'
      ) {
        console.log(`Location updated for user ${locationData.name} (UID: ${locationData.uid}): Latitude ${locationData.latitude}, Longitude ${locationData.longitude}`);
        // Emit the updated location to all clients except the sender
        socket.broadcast.emit('locationUpdate', {
          uid: locationData.uid,
          username: locationData.name,
          location: {
            latitude: locationData.latitude,
            longitude: locationData.longitude
          }
        });
      } else {
        console.error('Invalid locationData received:', locationData);
      }
    });
  
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
  

server.listen(3000, () => {
  console.log('Listening on port 3000');
});
