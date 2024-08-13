import { useEffect, useRef, useState } from 'react';
import './Chat.css';
import ChatLineText from '../elements/ChatLine';
import TextField from '@mui/material/TextField';
import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useAppDispatch } from '../app/hooks';
import { useMutation, useQuery, useSubscription } from '@apollo/client';

import { gql } from "../__generated__/gql";
import { Message, User } from '../__generated__/graphql';

const GET_MESSAGES = gql(`
  query GetMessages($channel: String!) {
    messages(channelName: $channel) { 
      id
      message
      time
      user { name, id }
    }
  }
`);

const SUB_MESSAGES = gql(`
  subscription SubMessages($channel: String!) {
    messageSent(channelName: $channel) {
      id
      message
      time
      user { name, id }
    }
  }
`);

const ADD_MESSAGE = gql(`
  mutation AddMessage($channelName: String!, $userId:String!, $message:String!) {
    addMessage(channelName:$channelName, userId:$userId, message:$message) {
      message
    }
  }
`);


function Chat({ user, channelName }: { user: User, channelName: string; }) {

  let messages: Message[] = [];
  const { loading, error, data, subscribeToMore } = useQuery(GET_MESSAGES, {
    variables: { channel: channelName }
  });

  if (!loading && data && data.messages) {
    messages = data.messages;
  }
  if (!loading && error) {
    console.error(error);
  }

  const [mutateFunction, { data: mutateData, loading: mutateLoading, error: mutateError }] = useMutation(ADD_MESSAGE);

  const addMessage = (value: string) => {
    mutateFunction({
      variables: {
        channelName: channelName,
        message: value,
        userId: user.id,
      }
    });
  };


  //  Wrapper React Element to properly sub/unsub via subscribeToMore
  return <InnerChat channel={channelName} user={user} messages={messages} addMessage={addMessage} subToMessages={(channelName) => subscribeToMore({
    document: SUB_MESSAGES,
    variables: { channel: channelName },
    updateQuery: (existing, { subscriptionData }) => {
      if (existing.messages.find(value =>
        value.time == subscriptionData.data.messageSent.time
        && value.user.name == subscriptionData.data.messageSent.user.name)) {
        console.warn("Susbcription returned duplicate message.");
        return existing;
      } else {
        return Object.assign({}, existing, {
          messages: [...existing.messages, subscriptionData.data.messageSent],
        });
      }
    }
  })}></InnerChat>;
}

function InnerChat({ channel, messages, subToMessages, addMessage, user }: { channel: string, messages: Message[], subToMessages: (channelName: string) => () => void, addMessage: (value: string) => void, user: User; }) {

  // Handles updates from the server, subToMessages returns the unsubscribe callback
  useEffect(() => subToMessages(channel), [channel]);

  const dispatch = useAppDispatch();
  const [messageValue, setMessage] = useState("");
  const messagesDomRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    const newMessage = messageValue.trim();
    setMessage("");
    addMessage(newMessage);



    messagesDomRef?.current?.scrollTo({
      behavior: 'auto',
      top: messagesDomRef.current.scrollHeight,
    });
  };

  useEffect(() => {
    messagesDomRef?.current?.scrollTo({
      behavior: 'auto',
      top: messagesDomRef.current.scrollHeight,
    });
  }, [messages]);


  const messageDom = (
    <Stack spacing={1} flexDirection={'column-reverse'} flexGrow={1}  >
      {
        /* extra empty div because of 
          BUG: first element has no spacing when flexDirection is set to column-reverse
          */
      }
      <div></div>
      {[...messages].reverse().map((chatLine, idx) => (<ChatLineText user={user} key={idx} chatLine={chatLine}></ChatLineText>))}
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
