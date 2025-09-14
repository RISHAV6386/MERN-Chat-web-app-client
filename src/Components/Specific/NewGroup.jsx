import { useInputValidation } from "6pp";
import { Button, Dialog, DialogTitle, Skeleton, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from "../../Hooks/Hook";
import { useAvailableFriendsQuery, useNewGroupMutation } from "../../redux/api/api";
import { setIsNewGroup } from "../../redux/reducers/misc";
import UserItem from '../shared/UserItem';

const NewGroup = () => {
  const { isNewGroup } = useSelector((state) => state.misc)
  const dispatch = useDispatch()

  const [newGroup,newGroupLoading]=useAsyncMutation(useNewGroupMutation)
  const groupName = useInputValidation("")
  const [selectedMembers, setselectedMembers] = useState([])
  const { isError, error, isLoading, data } = useAvailableFriendsQuery('')
  const submitHandler = () => {
    if (!groupName.value) return toast.error("Group name is required")
    if (selectedMembers.length < 2) return toast.error("Please Select Atleast 2 Members")
      newGroup("Creating New Group...",{name:groupName.value,members:selectedMembers})
    closeHandler()

  }
  const closeHandler = () => { dispatch(setIsNewGroup(false)) }
  const selectMemberHandler = (id) => {
    setselectedMembers((prev) => prev.includes(id) ? prev.filter((current) => current != id) : [...prev, id])
  }
  const errors = [{
    isError,
    error
  }]
  useErrors([{ errors }])

  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} width={"25rem"} spacing={"2rem"} >
        <DialogTitle textAlign={"center"} variant='h4'>New Group</DialogTitle>
        <TextField label="Group Name" value={groupName.value} onChange={groupName.changeHandler} />
        <Typography variant='body1'>Members</Typography>

        <Stack>
          {isLoading ? <Skeleton /> :
            (data?.friends?.map((i) => (
              <UserItem user={i} key={i._id} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)} />)

            ))
          }

        </Stack>
        <Stack direction={"row"} justifyContent={"space-evenly"}>
          <Button variant='outlined' color='error' size='large' onClick={closeHandler}>Cancel</Button>
          <Button variant='contained' size='large' onClick={submitHandler} disabled={newGroupLoading}>Create</Button>
        </Stack>

      </Stack>

    </Dialog>
  )
}

export default NewGroup