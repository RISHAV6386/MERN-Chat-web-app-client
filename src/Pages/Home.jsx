import { Typography } from '@mui/material';
import AppLayout from '../Components/layout/AppLayout';
import { grayColor } from '../constants/color';

const Home = () => {
  return (
   <Typography p={"2rem"} variant='h5' textAlign={"center"} bgcolor={`${grayColor}`} height={"100%"}>Select a friend to chat</Typography>
  )
}

export default AppLayout()(Home)