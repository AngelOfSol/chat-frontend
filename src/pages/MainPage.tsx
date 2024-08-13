import { Button, Card, Stack, Typography } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import Chat from "./Chat";
import { useQuery } from "@apollo/client";
import { User } from "../__generated__/graphql";
import { gql } from "../__generated__";
import { useState } from "react";

const GET_CHANNELS = gql(`
  query GetChannels {
    channels {
      id
      users {
        name
        id
      }
    }
  }
`);

type Channel = { id: string, users: { name: string, id: string; }[]; };

function MainPage({ user, logOut, }: { user: User, logOut: () => void; }) {
  const { loading, error, data } = useQuery(GET_CHANNELS, {
  });

  let channels: Channel[] = [];
  if (!loading && !error && data) {
    channels = data.channels;
  }

  const [currentChannelName, setCurrentChannelName] = useState<string | null>(null);
  const currentChannel = channels.find(channel => channel.id == currentChannelName);
  const changeChannelHandler = (channel: Channel) => setCurrentChannelName(channel.id);

  const channelListDom = (
    <Grid container direction="column" flexGrow={1} flexBasis="100px" >
      <Grid flexGrow={1}>
        <Stack direction="column" spacing={1}>
          {channels.map(
            (channel, idx) =>
              <Button fullWidth variant={currentChannel?.id == channel.id ? "contained" : "text"} key={idx} onClick={() => changeChannelHandler(channel)}>
                {channel.id}
              </Button>)
          }
        </Stack>
      </Grid>
      <Grid flexGrow={0}>
        <Button fullWidth variant="contained" onClick={() => {
          logOut();
        }}>Log Out</Button>
      </Grid>
    </Grid>
  );

  if (currentChannel) {
    return (
      <>
        <Grid container spacing={2} flexGrow={1} direction="row">
          {channelListDom}
          <Grid container direction="column" flexGrow={7} >
            <Chat user={user} channelName={currentChannel.id}></Chat>
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