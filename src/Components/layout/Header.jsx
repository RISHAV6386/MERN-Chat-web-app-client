import { AppBar, Box, IconButton, Toolbar, Tooltip, Typography, Backdrop, Badge } from '@mui/material'
import React, { lazy, Suspense, useState } from 'react'
import { orange } from '../../constants/color'
import { useNavigate } from "react-router-dom";
import { Logout as LogoutIcon, Group as GroupIcon, Notifications as NotificationIcon, Add as AddIcon, Menu as MenuIcon, Search as SearchIcon } from "@mui/icons-material";
import axios from 'axios';
import { server } from '../../constants/config';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { userNotExists } from '../../redux/reducers/Auth';
import { setIsMobile, setIsNewGroup, setIsNotification, setIsSearch } from '../../redux/reducers/misc';
import { resetNotification } from '../../redux/reducers/chat';

const SearchDiloge = lazy(() => import("../Specific/Search"))
const NotificationDiloge = lazy(() => import("../Specific/Notifications"))
const NewGroupDiloge = lazy(() => import("../Specific/NewGroup"))

const Header = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isSearch, isNotification,isNewGroup } = useSelector((state) => state.misc)
  const { notificationCount } = useSelector((state) => state.chat)

  const handleMobile = () => dispatch(setIsMobile(true))
  const openSearch = () => dispatch(setIsSearch(true))
  const openNewGroup = () => dispatch(setIsNewGroup(true))
  const openNotifications = () => {
    dispatch(setIsNotification(true))
    dispatch(resetNotification())
  }

  const LogoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, { withCredentials: true })
      dispatch(userNotExists())
      toast.success(data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went Wrong")
    }
  }
  
  const navigateToGroup = () => navigate("/groups")

  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={"4rem"} >
        <AppBar position='static' sx={{ bgcolor: orange }}>
          <Toolbar>
            <Typography variant='h6' sx={{ display: { xs: "none", sm: "block" } }}>ChatApp</Typography>
            <Box sx={{ display: { xs: "block", sm: "none" } }}>
              <IconButton color='inherit' onClick={handleMobile}>
                <MenuIcon />
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box>
              <Iconbtn title={"Search"} icon={<SearchIcon />} onclick={openSearch} />
              <Iconbtn title={"New Group"} icon={<AddIcon />} onclick={openNewGroup} />
              <Iconbtn title={"Manage Group"} icon={<GroupIcon />} onclick={navigateToGroup} />
              <Iconbtn title={"Notifications"} icon={<NotificationIcon />} onclick={openNotifications} value={notificationCount} />
              <Iconbtn title={"Logout"} icon={<LogoutIcon />} onclick={LogoutHandler} />

            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      {isSearch && <Suspense fallback={<Backdrop open />}><SearchDiloge /></Suspense>}
      {isNotification && <Suspense fallback={<Backdrop open />}><NotificationDiloge /></Suspense>}
      {isNewGroup && <Suspense fallback={<Backdrop open />}><NewGroupDiloge /></Suspense>}
    </>
  )
}
const Iconbtn = ({ title, icon, onclick, value }) => {
  return (
    <Tooltip title={title}>
      <IconButton color='inherit' size='large' onClick={onclick}>
        {value ? <Badge badgeContent={value} color='error'>{icon}</Badge> : icon}
      </IconButton>
    </Tooltip>
  )
}
export default Header