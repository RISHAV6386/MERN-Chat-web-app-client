import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import { Dialog, DialogTitle, InputAdornment, List, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import useAsyncMutation from "../../Hooks/Hook";
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '../../redux/api/api';
import { setIsSearch } from '../../redux/reducers/misc';
import UserItem from '../shared/UserItem';
import toast from "react-hot-toast";
const users = [1, 2, 3];
const Search = () => {
  const { isSearch } = useSelector((state) => state.misc)

  const [searchUser] = useLazySearchUserQuery()
  const dispatch = useDispatch()
  let isLoadingSendfriendRequest = false;
  const [sendFriendRequest] = useSendFriendRequestMutation();

  const search = useInputValidation("");
  const [users, setUsers] = useState([])
  // const {sendFriendRequest, isLoadingSendfriendRequest } = useAsyncMutation(useSendFriendRequestMutation)
  const addFriendHnadler = async (id) => {
    // await sendFriendRequest("Sending friend request...", { userId: id })
    const toastId = toast.loading("Sending friend request...")
    try {
      const res = await sendFriendRequest({ userId: id });
      if (res.data) { toast.success(res.data.message, { id: toastId }) }
      else {
        toast.error(res.error.data.response.message, { id: toastId })
      }
    } catch (error) {
      toast.error("Something went wrong")
    }

  }
  const seacrhCloseHandler = () => {
    dispatch(setIsSearch(false))
  }

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (search.value) {
        searchUser(search.value).then(({ data }) => setUsers(data.users)).catch((e) => console.log(e))

      }
    }, [1000]);
    return () => {
      clearTimeout(timeOutId);
    }
  }, [search.value])

  return (
    <Dialog open={isSearch} onClose={seacrhCloseHandler}>
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField label="" value={search.value} onChange={search.changeHandler} variant='outlined' size='small' InputProps={{ startAdornment: (<InputAdornment position='start'><SearchIcon /></InputAdornment>) }} />
        <List>
          {
            users.map((i) => (
              <UserItem user={i} key={i._id} handler={addFriendHnadler} handlerIsLoading={isLoadingSendfriendRequest} />
            ))
          }

        </List>
      </Stack>
    </Dialog>
  )
}

export default Search