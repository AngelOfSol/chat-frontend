import './App.css'
import Chat from './pages/Chat';
import { useAppDispatch, useAppSelector } from './app/hooks';
import Login from './pages/LogIn';
import { selectChatLines } from './features/chat/chatLines';


function App() {
  const userStatus = useAppSelector((state) => state.userStatus);
  const chatLines = useAppSelector(selectChatLines);

  switch (userStatus.state) {
    case 'inactive':
      return (
        <>
          <Login></Login>

        </>
      )
    case 'active':
      return (
        <>
          <Chat user={userStatus.user} chatLines={chatLines}></Chat>

        </>
      )
  }

}

export default App
