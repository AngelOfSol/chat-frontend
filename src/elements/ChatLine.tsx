import './ChatLine.css'
import Typography from '@mui/material/Typography';
import { Paper, Stack } from '@mui/material';
import test from './test.png';
import { useAppSelector } from '../app/hooks';

function ChatLine({ user, message }: { user: String, message: String }) {
  const userStatus = useAppSelector((state) => state.userStatus);
  if (userStatus.state == 'active') {
    if (user == userStatus.user.name) {
      user = "Me";
    }
  }

  return (
    <>
      <Paper square className="message-group">
        <Stack flexDirection="row">
          <img src={test}></img>
          <Stack flexDirection="column">
            <Typography variant="h3">{user}</Typography>
            <Typography variant="body1">{message}</Typography>
          </Stack>
        </Stack>
      </Paper>
    </>
  )
}

export default ChatLine
