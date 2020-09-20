export default (state, action) => {
   switch (action.type) {
      case 'LOGINED':
         return {
            ...state,
            logined: true,
            userName: action.payload.userName,
            roomId: action.payload.roomId,
         };

      default:
         return state;
   }
};
