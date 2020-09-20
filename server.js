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
app.get('/rooms', (req, res) => {
   res.json(rooms);
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
   res.json([...rooms.keys()]);
});

// когда к нашему webсокету произвели подключение мы выполняем функцию
// у каждого пользователя будет своя переменная socket, в этой переменной хранится инф. о пользователе
io.on('connection', (socket) => {
   socket.on('ROOM:LOGIN', (data) => {
      console.log(data);
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
