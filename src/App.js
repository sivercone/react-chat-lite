import React from 'react';
import Login from './components/Login';
import socket from './socket';
import reducer from './reducer';

function App() {
   const [state, dispatch] = React.useReducer(reducer, {
      // initialState
      logined: false,
      userName: null,
      roomId: null,
   });

   const onLogin = (obj) => {
      dispatch({
         type: 'LOGINED',
         payload: obj,
      });
      // отправляем сокет на бэкенд
      socket.emit('ROOM:LOGIN', obj);
   };

   console.log(state);

   return <div className="wrapper">{!state.logined && <Login onLogin={onLogin} />}</div>;
}

export default App;
