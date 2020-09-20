import React from 'react';
import socket from './socket';
import axios from 'axios';

import reducer from './reducer';
import Login from './components/Login';
import Chat from './components/Chat';

function App() {
   const [state, dispatch] = React.useReducer(reducer, {
      // initialState
      logined: false,
      userName: null,
      roomId: null,
      users: [],
      messages: [],
   });

   const onLogin = async (obj) => {
      dispatch({
         type: 'LOGINED',
         payload: obj,
      });
      // отправляем сокет на бэкенд
      socket.emit('ROOM:LOGIN', obj);
      const { data } = await axios.get(`/rooms/${obj.roomId}`);

      dispatch({
         type: 'SET_DATA',
         payload: data,
      });
   };

   const setUsers = (users) => {
      dispatch({
         type: 'SET_USERS',
         payload: users,
      });
   };

   const addMessage = (messages) => {
      dispatch({
         type: 'NEW_MESSAGE',
         payload: messages,
      });
   };

   React.useEffect(() => {
      socket.on('ROOM:SET_USERS', setUsers);
      // как только от сокета мы получаем запрос `ROOM:NEW_MESSAGE` , выполняем функцию и через диспатч поместим наш новый state
      socket.on('ROOM:NEW_MESSAGE', addMessage);
   }, []);

   return <>{!state.logined ? <Login onLogin={onLogin} /> : <Chat {...state} onAddMessage={addMessage} />}</>;
}

export default App;
