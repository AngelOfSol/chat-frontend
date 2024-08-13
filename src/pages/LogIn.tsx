import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useKeycloak } from "@react-keycloak/web";
import { useState } from "react";

function Login(props: {}) {

  const { keycloak, initialized } = useKeycloak();


  const procLogIn = () => {
    if (initialized) {
      keycloak.login();
    }
  };
  return (
    <>
      <Paper sx={{ padding: '40px' }}>
        <Stack spacing={2}>
          <Typography variant="h1">Chat</Typography>
          {
            <Button fullWidth variant="contained" onClick={procLogIn}>Login</Button>
          }
        </Stack>
      </Paper >
    </>
  );
}
export default Login;
