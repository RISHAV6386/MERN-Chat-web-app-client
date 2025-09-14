import { Add as AddIcon, Delete as DeleteIcon, Done as DoneIcon, Edit as EditIcon, KeyboardBackspace, Menu as MenuIcon } from "@mui/icons-material";
import { Backdrop, Box, Button, CircularProgress, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { lazy, memo, Suspense, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "../Components/Style/StyledComponents";
import { LayoutLoader } from '../Components/layout/Loaders';
import AvatarCard from '../Components/shared/AvatarCard';
import UserItem from '../Components/shared/UserItem';
import { useAsyncMutation, useErrors } from "../Hooks/Hook";
import { bgColor, matBlack } from '../constants/color';
import { useChatDeatilsQuery, useDeleteChatMutation, useMyGroupsQuery, useRemoveGroupMembersMutation, useRenameGroupMutation } from '../redux/api/api';
import { setIsAddMember } from "../redux/reducers/misc";
const ConfirmDeleteDialog = lazy(() => import("../Components/dialogs/ConfirmDeleteDialog"))
const AddMemberDialog = lazy(() => import("../Components/dialogs/AddMemberdDialog"))

const Groups = () => {
  const navigate = useNavigate()
  const chatId = useSearchParams()[0].get("group")
  const dispacth=useDispatch()
  const {isAddMember}=useSelector(state => state.misc)
  const groupDetails = useChatDeatilsQuery({ chatId, populate: true }, { skip: !chatId })
  const [updatedGroup,updatedGroupLoading]=useAsyncMutation(useRenameGroupMutation)
  const [removeMember,removeMemberLoading]=useAsyncMutation(useRemoveGroupMembersMutation)
  const [deleteGroup,deleteGroupLoading]=useAsyncMutation(useDeleteChatMutation)
  const myGroups = useMyGroupsQuery("")
  const [isMobileMenuOpen, setisMobileMenuOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [members, setMembers] = useState([])
  const [groupName, setGroupName] = useState("")
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("")
  const [ConfirmDeleteHandler, setConfirmDeleteHandler] = useState(false)
  const errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error
    },
  ]
  useErrors([{errors}])
  useEffect(() => {
    if (groupDetails.data) {
      setGroupName(groupDetails.data.chat?.name);
      setGroupNameUpdatedValue(groupDetails.data.chat?.name)
      setMembers(groupDetails.data.chat?.members)
    }
    return ()=>{
      setGroupName("")
      setGroupNameUpdatedValue("")
      setMembers([])
      setIsEdit(false)
    }

  }, [groupDetails.data])

  const navigateBack = () => {
    navigate("/")
  }
  const handleMobile = () => {
    setisMobileMenuOpen((prev) => !prev)
  }
  const handleMobileClose = () => {
    setisMobileMenuOpen(false)
  }
  const updateGroupName = () => {
    setIsEdit(false)
    updatedGroup("Updating Group Name...",{chatId,name:groupNameUpdatedValue})
  }
  const openConfirmDeleteHandler = () => {
    setConfirmDeleteHandler(true)
   
  }
  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteHandler(false)
  }
  const openAddMemberHandler = () => { 
    dispacth(setIsAddMember(true))
  }
  const deleteHandler = () => {
     deleteGroup("Deleting group... ",chatId)
    navigate("/groups")
    closeConfirmDeleteHandler()
  }
  const removeMemberHandler = (userId) => {
    removeMember("Removing Member...",{chatId,userId})
  }

  useEffect(() => {
    if (chatId) {
      setGroupName(`Group Name ${chatId}`)
      setGroupNameUpdatedValue(`Group Name ${chatId}`)
    }
    return () => {

      setGroupName(``)
      setGroupNameUpdatedValue(``)
      setIsEdit(false)
    }

  }, [chatId])


  const Iconbtn = <>
    <Box sx={{ display: { xs: "block", sm: "none" }, position: "fixed", top: "1rem", right: "1rem" }}>
      <IconButton onClick={handleMobile}>
        <MenuIcon />
      </IconButton>
    </Box>
    <Tooltip title="back">
      <IconButton sx={{ position: "absolute", top: "2rem", left: "2rem", bgcolor: matBlack, color: "white", "&:hover": { bgcolor: "rgba(0,0,0,0.7)" } }} onClick={navigateBack}>
        <KeyboardBackspace />
      </IconButton>
    </Tooltip>
  </>

  const GroupName = <>
    <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} spacing={"1rem"} padding={"3rem"}>
      {isEdit ? <>
        <TextField value={groupNameUpdatedValue} onChange={(e) => setGroupNameUpdatedValue(e.target.value)} />
        <IconButton onClick={updateGroupName} disabled={updatedGroupLoading}>
          <DoneIcon />
        </IconButton>
      </> : <>
        <Typography variant='h4'>{groupName}</Typography>
        <IconButton disabled={updatedGroupLoading}onClick={() => setIsEdit(true)}>
          <EditIcon />
        </IconButton>
      </>}
    </Stack>
  </>

  const ButtonGroup = <Stack direction={{ xs: "column-reverse", sm: "row" }} spacing={"1rem"} p={{ xs: "0", sm: "1rem", md: "1rem 4rem" }}>
    <Button size='large' color='error' variant='outlined' startIcon={<DeleteIcon />} onClick={openConfirmDeleteHandler}>Delete Group</Button>
    <Button size='large' variant='contained' startIcon={<AddIcon />} onClick={openAddMemberHandler}>Add Member</Button>

  </Stack>


  return myGroups.isLoading ? <LayoutLoader /> : (
    <Grid container height={"100vh"}>
      <Grid item sx={{ display: { xs: "none", sm: "block" }, }} sm={4} >
        <GroupList myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Grid>
      <Grid item xs={12} sm={8} sx={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", padding: "1rem 3rem" }}>
        {Iconbtn}
        {groupName && <>
          {GroupName}
          <Typography>Members</Typography>
          <Stack maxWidth={"45rem"} width={"100%"} boxSizing={"border-box"} padding={{ sm: "1rem", xs: "0", md: "1rem 4rem" }} height={"50vh"} overflow={"auto"} spacing={"2rem"}>
            {removeMemberLoading?<CircularProgress/>:
              members.map((i) => (<UserItem user={i} key={i._id} isAdded styling={{ boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)", borderRadius: "1rem", padding: "1rem" }} handler={removeMemberHandler} />))
            }

          </Stack>
          {ButtonGroup}
        </>}
      </Grid>
      {
        isAddMember && <Suspense fallback={<Backdrop open />}> <AddMemberDialog chatId={chatId}/></Suspense>}
      {
        ConfirmDeleteHandler && (<Suspense fallback={<Backdrop open />}>
          <ConfirmDeleteDialog open={ConfirmDeleteDialog} handleClose={closeConfirmDeleteHandler} deleteHandler={deleteHandler} />
        </Suspense>)
      }
      <Drawer sx={{ display: { xs: "block", sm: "none" }, }} open={isMobileMenuOpen} onClose={handleMobileClose}>
        <GroupList w={'50vw'} myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Drawer>
    </Grid>
  )
}
const GroupList = ({ w = "100%", myGroups = [], chatId }) => (
  <Stack width={w} sx={{ backgroundImage: bgColor, height: "100vh" }}>
    {myGroups.length > 0 ? (myGroups.map((group) => (<GroupListItem group={group} chatId={chatId} key={group._id} />))) : (<Typography textAlign={"center"} padding={"1rem"}>No groups</Typography>)}
  </Stack>
)
const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group
  return <Link to={`?group=${_id}`} onClick={(e) => { if (chatId === _id) e.preventDefault() }}>
    <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
      <AvatarCard avatar={avatar} />
      <Typography>{name}</Typography>
    </Stack>
  </Link>
})




export default Groups