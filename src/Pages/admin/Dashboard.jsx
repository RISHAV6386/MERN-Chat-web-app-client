import React from 'react'
import AdminLayout from '../../Components/layout/AdminLayout'
import { Box, Container, Paper, Skeleton, Stack, Typography } from '@mui/material'
import { AdminPanelSettings as AdminPanelSettingsIcon, Group as GroupIcon, Message as MessageIcon, Notifications as NotificationsIcon, Person as PersonIcon } from '@mui/icons-material'
import { CurvButton, Searchfield } from '../../Components/Style/StyledComponents'
import moment from 'moment'
import { DoughnutChart, LineCharts } from '../../Components/Specific/Charts'
import { useFetchData } from "6pp"
import { server } from '../../constants/config'
import { LayoutLoader } from "../../Components/layout/Loaders"
import { useErrors } from '../../Hooks/Hook'




const Dashboard = () => {
  const { loading, data, error} = useFetchData(`${server}/api/v1/admin/stats`, "dashboard-stats")
  const { stats } = data || {} 
  useErrors([{isError:error,error:error}])
  const Appbar = <Paper elevation={3} sx={{ padding: "2rem", margin: "2rem 0", borderRadius: "1rem" }}>
    <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
      <AdminPanelSettingsIcon sx={{ fontSize: "3rem" }} />
      <Searchfield placeholder='Seach...' />
      <CurvButton > Search</CurvButton>
      <Box flexGrow={1} />
      <Typography display={{ xs: "none", lg: "block" }} textAlign={"center"} color={"rgba(0,0,0,0.7)"}>{moment().format("dddd,D MMMM YYYY")}</Typography>
      <NotificationsIcon />
    </Stack>
  </Paper>

  const Widgets = <Stack direction={{ xs: "column", sm: "row" }} justifyContent={"space-between"} alignItems={"center"} margin={"2rem 0"} spacing={"2rem"}>
    <Widget title={"Users"} value={stats?.usersCount||0} icon={<PersonIcon />} />
    <Widget title={"Chats"} value={stats?.totalChatsCount} icon={<GroupIcon />} />
    <Widget title={"Messages"} value={stats?.messagesCount} icon={<MessageIcon />} />
  </Stack>

  return  (
    <AdminLayout>
      {
        loading?<Skeleton height={"100vh"} />:<Container component={"main"}>{Appbar}
        <Stack direction={{ md: "column", lg: "row" }} justifyContent={"center"} alignItems={{ xs: "center", lg: "stretch" }} flexWrap={"wrap"} sx={{ gap: "2rem" }}>
          <Paper elevation={3} sx={{ padding: "2rem 3.5rem", borderRadius: "1rem", width: "100%", maxWidth: "45rem", }}>
            <Typography margin={"2rem 0"} variant='h4'>Last Messages</Typography>
            <LineCharts value={stats?.messagesChart} />
          </Paper>
          <Paper elevation={3} sx={{ padding: "1rem", borderRadius: "1rem", display: "flex", justifyContent: "center", alignItems: "center", width: { xs: "100%", sm: "50%" }, position: "relative", width: "100%", maxWidth: "25rem" }}>
            <DoughnutChart labels={["Single Chats", "Group Chats"]} value={[stats?.totalChatsCount - stats?.groupsCount || 0, stats?.groupsCount || 0]} />
            <Stack position={"absolute"} direction={"row"} justifyContent={"center"} alignItems={"center"} spacing={"0.5rem"} width={"100%"} height={"100%"} >
              <GroupIcon /> <Typography>Vs</Typography>

              <PersonIcon />
            </Stack>
          </Paper>
        </Stack>
        {Widgets}
      </Container>
      }
    </AdminLayout>
  )
}

const Widget = ({ title, value, icon }) => <Paper elevation={3} sx={{ padding: "2rem", margin: "2rem 0", borderRadius: "1rem", width: "20rem" }}>
  <Stack alignItems={"center"} spacing={"1rem"}>
    <Typography sx={{ color: "rgba(0,0,0,0.7)", borderRadius: "50%", border: "5px solid rgba(0,0,0,0.9)", width: "5rem", height: "5rem", display: "flex", justifyContent: "center", alignItems: "center" }}>{value}</Typography>
    <Stack direction={"row"} spacing={"1rem"} alignItems={"center"} >
      {icon}
      <Typography>{title}</Typography>
    </Stack>
  </Stack>
</Paper>

export default Dashboard