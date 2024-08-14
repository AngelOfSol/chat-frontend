import './ChatLine.css';
import Typography from '@mui/material/Typography';
import { Box, Paper, Stack } from '@mui/material';
import test from './test.png';
import { useAppSelector } from '../app/hooks';
import { Message, User } from '../__generated__/graphql';

function ChatLineText({ chatLine, user }: { chatLine: Message, user: User; }) {
  let userId = chatLine.user.id;
  if (userId == user.id) {
    userId = "Me";
  }

  return (
    <>
      <Paper square className="message-group">
        <Stack flexDirection="row">
          <img src={test}></img>
          <Box sx={{ margin: '0 0 0 10px' }}>
            <Stack flexDirection="column">
              <Stack flexDirection="row">
                <Typography variant="h3">{userId}</Typography>
                <Typography variant="caption"> {new Date(chatLine.time).toLocaleString()}</Typography>
              </Stack>
              <Typography variant="body1">{chatLine.message}</Typography>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </>
  );
}

export default ChatLineText;
