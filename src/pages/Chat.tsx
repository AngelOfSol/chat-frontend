import { useRef, useState } from 'react';
import './Chat.css';
import ChatLineText from '../elements/ChatLine';
import TextField from '@mui/material/TextField';
import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useAppDispatch } from '../app/hooks';
import { User } from '../features/user/userStatus';
import { ChatChannel, submitChatMessage } from '../features/chat/chatChannel';


function Chat({ user, channel }: { user: User, channel: ChatChannel; }) {
  const dispatch = useAppDispatch();
  const [messageValue, setMessage] = useState("");
  const messagesDomRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    const newMessage = messageValue.trim();
    setMessage("");
    dispatch(submitChatMessage(user, newMessage));

    messagesDomRef?.current?.scrollTo({
      behavior: 'auto',
      top: messagesDomRef.current.scrollHeight,
    });
  };


  const messageDom = (
    <Stack spacing={1} flexDirection={'column-reverse'} flexGrow={1}  >
      {
        /* extra empty div because of 
          BUG: first element has no spacing when flexDirection is set to column-reverse
          */
      }
      <div></div>
      {[...channel.messages].reverse().map((chatLine, idx) => (<ChatLineText key={idx} chatLine={chatLine}></ChatLineText>))}
    </Stack>
  );

  const formDom = (<>
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
    <Grid>
      <Button sx={{ height: '100%' }} variant="contained" onClick={() => sendMessage()} >Send</Button>
    </Grid>
  </>
  );

  return (
    <>
      <Grid container spacing={2} flexDirection={'column'} justifyContent={'flex-end'} flexGrow={7}>
        <Grid ref={messagesDomRef} flexGrow={1} overflow="auto" flexBasis={0}>
          {messageDom}
        </Grid>
        <Grid container spacing={2} flexDirection={'row'} justifyContent={'flex-start'} >
          {formDom}
        </Grid>
      </Grid>
    </>
  );
}

export default Chat;
