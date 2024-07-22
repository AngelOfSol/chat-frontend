import './App.css';
import { useAppSelector } from './app/hooks';
import Login from './pages/LogIn';
import MainPage from './pages/MainPage';


function App() {
  const userStatus = useAppSelector((state) => state.userStatus);

  switch (userStatus.state) {
    case 'inactive':
      return (
        <>
          <Login></Login>
        </>
      );
    case 'active':
      return (
        <>
          <MainPage user={userStatus.user} ></MainPage>
        </>
      );
  }

}

export default App;
