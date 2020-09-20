import React from 'react';
import socket from '../socket';
import axios from 'axios';

function Login({ onLogin }) {
   const [userName, setUserName] = React.useState('');
   const [roomId, setRoomId] = React.useState('');
   const [loading, setLoading] = React.useState(false);

   const onEnter = async () => {
      // если поля ввода пустые
      if (!roomId || !userName) {
         return alert('Denied');
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
      <>
         <input type="text" placeholder="Логин" value={userName} onChange={(e) => setUserName(e.target.value)} />
         <input type="text" placeholder="Номер комнаты" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
         <button disabled={loading} onClick={onEnter}>
            {loading ? 'Вход...' : 'Войти'}
         </button>
      </>
   );
}

export default Login;
