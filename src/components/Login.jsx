import React from 'react';
import axios from 'axios';

function Login({ onLogin }) {
   const [userName, setUserName] = React.useState('');
   const [roomId, setRoomId] = React.useState('');
   const [loading, setLoading] = React.useState(false);

   const onEnter = async () => {
      // если поля ввода пустые
      if (!roomId || !userName) {
         return console.log('Denied');
      }

      const obj = {
         userName,
         roomId,
      };

      setLoading(true);
      // если все ок отпарвляем данные на сервак
      await axios.post('/rooms', obj);
      onLogin(obj);
   };

   return (
      <div className="wrapper">
         <input type="text" placeholder="Логин" value={userName} onChange={(e) => setUserName(e.target.value)} />
         <input type="text" placeholder="Название комнаты" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
         <button disabled={loading} onClick={onEnter}>
            {loading ? 'Вход...' : 'Войти'}
         </button>
      </div>
   );
}

export default Login;
