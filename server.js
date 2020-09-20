// подключение библиотеки `express` - с помощью её с можем подключать серверную часть
const express = require('express');
// здесь создано\вызвано и хранится сервреное приложение Express
const app = express();
const server = require('http').Server(app);
// теперь io хранить информацию о socket'e.io и server'e
const io = require('socket.io')(server);

// для експресса подключаем посредника который будет получать в тело(body) самого запроса `post` JSON-данные
app.use(express.json());

const rooms = new Map();

// здесь мы говрим что по `get` запросу `users` у нас должно что-то происходить, в нашем случае выполнение нашей функции
// и когда мы перейдем по адресу `users` выполнять след. функцию
// req - request - все то что нам присылает пользователь, и оно хранится в req
// res - response - ответ - здесь мы решаем что вернуть пользователю
app.get('/rooms/:id', (req, res) => {
   const { id: roomId } = req.params;

   // проверка - если существует уже комната тогда возвращаем актуальные данные, иначе по дефолту пустой массив
   const obj = rooms.has(roomId)
      ? {
           users: [...rooms.get(roomId).get('users').values()],
           messages: [...rooms.get(roomId).get('messages').values()],
        }
      : { users: [], messages: [] };
   res.json(obj);
});

app.post('/rooms', (req, res) => {
   const { userName, roomId } = req.body;
   // после получения запроса комнаты проверить наличие её, если нету комнаты, тогда создать её
   if (!rooms.has(roomId)) {
      rooms.set(
         roomId,
         new Map([
            ['users', new Map()],
            ['messages', []],
         ]),
      );
   }
   res.send();
});

// когда к нашему webсокету произвели подключение мы выполняем функцию
// у каждого пользователя будет своя переменная socket, в этой переменной хранится инф. о пользователе
io.on('connection', (socket) => {
   socket.on('ROOM:LOGIN', ({ roomId, userName }) => {
      // подключение в конкретную комнату
      socket.join(roomId);
      // получить комнату и пользователей
      rooms.get(roomId).get('users').set(socket.id, userName);
      // все пользователи из конкретой комнаты
      const users = [...rooms.get(roomId).get('users').values()];
      // в конкретную комнату всем кроме себя отправляем сокет запрос `ROOM:SET_USERS`
      socket.to(roomId).broadcast.emit('ROOM:SET_USERS', users);
   });

   socket.on('ROOM:NEW_MESSAGE', ({ roomId, userName, text }) => {
      const obj = {
         userName,
         text,
      };
      rooms.get(roomId).get('messages').push(obj);
      // оповещаем что пользоввтелям пришло сообщение от нас
      socket.to(roomId).broadcast.emit('ROOM:NEW_MESSAGE', obj);
   });

   // отлавливаем если кто то вышел из чата
   socket.on('disconnect', () => {
      rooms.forEach((value, roomId) => {
         if (value.get('users').delete(socket.id)) {
            const users = [...value.get('users').values()];
            socket.to(roomId).broadcast.emit('ROOM:SET_USERS', users);
         }
      });
   });

   console.log('userSocketIsConnected, socket:', socket.id);
});

// следим за определенным портом, и за этим портом у нас происходит слежка нашего приложения
// говорим что наше приложение работает по порту 5000
// и говорим как только ты запустишся, нужно оповестить что ты запустился
server.listen(5000, (err) => {
   // также мы добавили аргумент, чтобы отлавливать ошибку если она существует
   if (err) {
      throw Error(err);
   }
   console.log('Сервер работает!');
});
