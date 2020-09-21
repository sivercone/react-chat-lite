import React from 'react';
import socket from '../socket';

function Chat({ users, roomId, messages, userName, onAddMessage }) {
   const [messageValue, setMessageValue] = React.useState('');
   const messagesRef = React.useRef(null);

   const onSendMessage = () => {
      socket.emit('ROOM:NEW_MESSAGE', {
         roomId,
         userName,
         text: messageValue,
      });
      onAddMessage({
         userName,
         text: messageValue,
      });
      setMessageValue('');
   };

   React.useEffect(() => {
      messagesRef.current.scrollTo(0, 9999999);
   }, [messages]);

   return (
      <div className="chat">
         <div className="chat__sidebar">
            <h2>Room #{roomId} </h2>
            <h2>Online: {users.length} </h2>
            <ul>
               {users.map((name, index) => (
                  <li key={name + index}>{name}</li>
               ))}
            </ul>
         </div>
         <div className="chat__messages__align">
            <h1>Messages</h1>
            <div ref={messagesRef} className="chat__messages">
               {messages.map((message) => (
                  <div className="message">
                     <label>{message.userName}</label>
                     <span>{message.text}</span>
                  </div>
               ))}
            </div>
            <form>
               <textarea
                  value={messageValue}
                  onChange={(e) => setMessageValue(e.target.value)}
                  placeholder="Write a message.."
                  rows="4"></textarea>
               <button onClick={onSendMessage} type="button">
                  Send
               </button>
            </form>
         </div>
      </div>
   );
}

export default Chat;
// stopped 2:~30
