import { DOMElement, useRef, useState } from 'react'
import './Chat.css'

import ChatLine from '../elements/ChatLine'


import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { Box, Button, Card, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logOut, User } from '../features/user/userStatus';
import { ChatLines, selectChatLines, submitChatMessage } from '../features/chat/chatLines';


function Chat({ user, chatLines }: { user: User, chatLines: ChatLines }) {
  const dispatch = useAppDispatch();
  const [messageValue, setMessage] = useState("");
  const [userList, setUserList] = useState(['Alice', 'Bob', 'Charles', 'Diana']);
  // const [userName, setUserName] = useState("Alice");
  const [serverLines, _] = useState<{ user: String, message: String }[]>([{ user: "Alice", message: "Hi Bob" }]);
  const messagesDom = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    const newMessage = messageValue.trim();
    setMessage("");
    dispatch(submitChatMessage(user.name, newMessage));
    if (messagesDom.current != null) {

      messagesDom.current?.scrollTo({
        behavior: 'auto',
        top: messagesDom.current.scrollHeight,
      })
    }
  };

  return (
    <>
      <Grid container spacing={2} flexDirection={'row'} justifyContent={'flex-end'} flexGrow={1}>
        <Grid container spacing={2} flexDirection={'column'} justifyContent={'flex-end'} flexGrow={7}>
          <Grid ref={messagesDom} flexGrow={1} overflow="auto" flexBasis={0}>
            <Stack spacing={1} flexDirection={'column-reverse'} flexGrow={1}  >
              {
                /* extra empty div because of 
                  BUG: first element has no spacing when flexDirection is set to column-reverse
                  */
              }
              <div></div>
              {[...chatLines].reverse().map(chatLine => (<ChatLine user={chatLine.userName} message={chatLine.message}></ChatLine>))}
            </Stack>
          </Grid>
          <Grid container spacing={2} flexDirection={'row'} justifyContent={'flex-start'} >
            <Grid >
              <Button variant="contained" onClick={() => dispatch(logOut())} sx={{ height: '100%' }}>Log Out</Button>
            </Grid>
            {/* <Grid >
              <Select value={userName} onChange={(ev) => setUserName(ev.target.value)}>
                {userList.map((userName) => (<MenuItem value={userName}>{userName}</MenuItem>))}
              </Select>
            </Grid> */}
            <Grid flexGrow={1}>
              <TextField
                fullWidth
                id="outlined-multiline-flexible"
                placeholder="Message @main"
                multiline
                maxRows={4}
                value={messageValue}
                onChange={(ev) => setMessage(ev.target.value)}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter" && !ev.shiftKey) {
                    ev.preventDefault();
                    sendMessage();
                  }
                }}
              >
              </TextField>
            </Grid>
            <Grid >
              <Button variant="contained" onClick={() => sendMessage()} sx={{ height: '100%' }}>Send</Button>
            </Grid>
          </Grid>
        </Grid >
        <Grid flexGrow={1}>
          <Typography variant="h6">Online</Typography>
          <Grid container spacing={1} flexDirection={'column'} >
            {userList.map((userName) => (<Grid><Card raised={false}>{userName}</Card></Grid>))}
          </Grid>
        </Grid>
      </Grid>

    </>
  )
}

export default Chat
