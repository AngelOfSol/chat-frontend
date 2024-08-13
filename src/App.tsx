import { useMutation } from '@apollo/client';
import { gql } from './__generated__';
import './App.css';
import Login from './pages/LogIn';
import MainPage from './pages/MainPage';
import { useKeycloak } from '@react-keycloak/web';
import { User } from './__generated__/graphql';


function App() {

  const { keycloak, initialized } = useKeycloak();



  if (initialized && keycloak.authenticated) {
    let data: any = { id: keycloak.idTokenParsed?.sub, name: keycloak.idTokenParsed?.preferred_username };
    console.log(data);
    return (
      <>
        <MainPage logOut={() => { keycloak.logout(); }} user={data} ></MainPage>
      </>
    );
  } else {
    return (
      <>
        <Login></Login>
      </>
    );
  }



}

export default App;
