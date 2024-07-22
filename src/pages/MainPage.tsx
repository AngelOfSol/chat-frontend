import { Button, Card, Stack, Typography } from "@mui/material";

import Grid from '@mui/material/Unstable_Grid2';
import { logOut, User } from "../features/user/userStatus";
import { changeChannel, selectChannelNames, selectCurrentChannel } from "../features/chat/chatChannel";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Chat from "./Chat";

function MainPage({ user }: { user: User; }) {
  const dispatch = useAppDispatch();
  const channels = useAppSelector(selectChannelNames);
  const currentChannel = useAppSelector(selectCurrentChannel);

  const changeChannelHandler = (channel: string) => dispatch(changeChannel(channel));

  const channelListDom = (
    <Grid container direction="column" flexGrow={1} flexBasis="100px" >
      <Grid flexGrow={1}>
        <Stack direction="column" spacing={1}>
          {channels.map((value, idx) => (<Button fullWidth variant={currentChannel?.name == value ? "contained" : "text"} key={idx} onClick={() => changeChannelHandler(value)}>{value}</Button>))}
        </Stack>
      </Grid>
      <Grid flexGrow={0}>
        <Button fullWidth variant="contained" onClick={() => dispatch(logOut())} >Log Out</Button>
      </Grid>
    </Grid>
  );

  if (currentChannel) {
    return (
      <>
        <Grid container spacing={2} flexGrow={1} direction="row">
          {channelListDom}
          <Grid container direction="column" flexGrow={7} >
            <Chat user={user} channel={currentChannel}></Chat>
          </Grid >
          <Grid flexGrow={1} >
            <Typography variant="h6">Members</Typography>
            <Grid container spacing={1} flexDirection={'column'} >
              {currentChannel.users.map((user, idx) => (<Grid key={idx}><Card key={idx} raised={false}>{user.name}</Card></Grid>))}
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  } else {
    return (
      <>
        <Grid container spacing={2} flexGrow={1} direction="row">
          {channelListDom}
          <Grid flexGrow={8}></Grid>
        </Grid>
      </>
    );
  }

}

export default MainPage;