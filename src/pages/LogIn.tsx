import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { logIn } from "../features/user/userStatus";

function Login() {
  const dispatch = useAppDispatch();
  const [password, setPassword] = useState("");
  const [userName, setUsername] = useState("");
  const procLogIn = () => {
    let user = { userName, password };
    setUsername("");
    setPassword("");
    dispatch(logIn(user));
  };
  return (
    <>
      <Paper sx={{ padding: '40px' }}>
        <Stack spacing={2}>
          <Typography variant="h1">BAH Chat</Typography>

          <TextField label="Username"
            value={userName}
            onChange={(ev) => setUsername(ev.target.value)}
          ></TextField>
          <TextField label="Password"
            type="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            onKeyDown={(ev) => {
              if (ev.key === "Enter" && !ev.shiftKey) {
                ev.preventDefault();
                procLogIn();
              }
            }}
          ></TextField>
          <Button fullWidth variant="contained" onClick={procLogIn}>Login</Button>
        </Stack>
      </Paper >
    </>
  );
}
export default Login;
