import { Avatar, Button, Dialog, DialogTitle, ListItem, Skeleton, Stack, Typography } from '@mui/material'
import { memo } from 'react'
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../../redux/api/api'
import { useDispatch, useSelector } from 'react-redux'
import { useAsyncMutation, useErrors } from '../../Hooks/Hook'
import { transformImage } from "../../Lib/features"
import { setIsNotification } from "../../redux/reducers/misc"
const Notifications = () => {

  const { isNotification } = useSelector((state) => state.misc)
  const dispatch = useDispatch()
  const { isLoading, data, error, isError } = useGetNotificationsQuery()
  const [acceptFriendRequest] = useAsyncMutation(useAcceptFriendRequestMutation)
  const friendrequestHandler =  ({ _id, accept }) => {
    dispatch(setIsNotification(false))
if(accept){
  acceptFriendRequest("Accepting Request...",{ requestId: _id, accept })
}
else{acceptFriendRequest("Rejecting Request...",{ requestId: _id, accept })}
    
  }
  const onClose = () => (dispatch(setIsNotification(false)))

   useErrors([{error,isError}])
  return (
    <Dialog open={isNotification} onClose={onClose}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"} textAlign={"center"}>
        <DialogTitle>Notifications</DialogTitle>
        {
          isLoading ? <Skeleton /> : <>
            {
              data.request.length > 0 ? (
                data.request.map(({ sender, _id }) => <NotificationItem sender={sender} _id={_id} handler={friendrequestHandler} key={_id} />)
              ) : (<Typography textAlign={"center"}>No Notifications</Typography>)
            }</>
        }

      </Stack>

    </Dialog>
  )
}

const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;
  return <ListItem>
    <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} width={"100%"}>

      <Avatar src={transformImage(avatar)} />
      <Typography width={"100%"} variant='body1' sx={{ flexGlow: 1, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>{`${name} sent you a frined request.`}</Typography>
      <Stack direction={{ sx: "column", sm: "row" }}>
        <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
        <Button color='error' onClick={() => handler({ _id, accept: false })}>Reject</Button>

      </Stack>
    </Stack>
  </ListItem>
})

export default Notifications