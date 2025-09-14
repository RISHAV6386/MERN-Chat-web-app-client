import { Button, Dialog, DialogTitle, Skeleton, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserItem from "../../Components/shared/UserItem";
import { useAsyncMutation, useErrors } from '../../Hooks/Hook';
import { useAddGroupMembersMutation, useAvailableFriendsQuery } from '../../redux/api/api';
import { setIsAddMember } from '../../redux/reducers/misc';

const AddMemberdDialog = ({ chatId }) => {
  const dispatch=useDispatch()
  
  const { isAddMember } = useSelector(state => state.misc)
  const [addMember, addMemberLoading] = useAsyncMutation(useAddGroupMembersMutation)
  const {isLoading,data,isError,error}=useAvailableFriendsQuery(chatId)
  const [selectedMembers, setselectedMembers] = useState([])

  const selectMemberHandler = (id) => {
    setselectedMembers((prev) => prev.includes(id) ? prev.filter((current) => current != id) : [...prev, id])
  }
  const addMemberSubmitHandler = () => {
    addMember("Adding Members...",{members:selectedMembers,chatId})
    closeHandler()
  }
  const closeHandler = () => {
    dispatch(setIsAddMember(false))
  }
 useErrors([{isError,error}])
  return (
    <Dialog open={isAddMember} onClose={closeHandler}>
      <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"}>Add Member</DialogTitle>
        <Stack>
          { isLoading?<Skeleton/>:
            data?.friends.length > 0 ? data?.friends.map(i => (<UserItem user={i} key={i._id} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)} />)) : (<Typography textAlign={"center"} >No Friends</Typography>)
          }
        </Stack>
        <Stack direction={"row"} alignItems={"center"} justifyContent={"space-evenly"}>
          <Button color='error' onClick={closeHandler}>Cancel</Button>
          <Button variant='contained' onClick={addMemberSubmitHandler} disabled={addMemberLoading}>Submit Changes</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default AddMemberdDialog