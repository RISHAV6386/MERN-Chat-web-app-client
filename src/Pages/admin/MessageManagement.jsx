import { useFetchData } from '6pp'
import { Avatar, Skeleton, Stack } from '@mui/material'
import moment from 'moment'
import { useEffect, useState } from 'react'
import AdminLayout from '../../Components/layout/AdminLayout'
import Table from '../../Components/shared/Table'
import { server } from '../../constants/config'
import { useErrors } from '../../Hooks/Hook'
import { transformImage } from '../../Lib/features'



const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200
  },
  {
    field: "attachments",
    headerName: "Attachments",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => <Avatar alt={params.row.name} src={params.row.avatar} />
  },
  {
    field: "content",
    headerName: "Content",
    headerClassName: "table-header",
    width: 400
  },
  {
    field: "sender",
    headerName: "Sent By",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <Stack direction="row" alignItems="center" spacing={"1rem"}>
        <Avatar alt={params.row.sender.name} src={params?.row?.sender?.avatar} />
        <span>{params.row.sender.name}</span>
      </Stack>
    )
  },
  {
    field: "chat",
    headerName: "Chat",
    headerClassName: "table-header",
    width: 220
  },
  {
    field: "groupChat",
    headerName: "Group Chat",
    headerClassName: "table-header",
    width: 100
  },
  {
    field: "createdAt",
    headerName: "Time",
    headerClassName: "table-header",
    width: 250
  },
]
const MessageManagement = () => {
  const { loading, data, error } = useFetchData(`${server}/api/v1/admin/messages`, "dashboard-messages")
  useErrors([{isError:error,error:error}])
  const [rows, setRows] = useState([])
  useEffect(() => {
    setRows(
      data?.transformMessages?.map((i) => ({
        ...i,
        id: i._id,
        sender: {
          name: i.sender.name,
          avatar: transformImage(i.sender.avatar),
        },
        createdAt: moment(i.createdAt).format("MMM Do YYYY,h:mm:ss a")
      }))
    )
  }, [data])
  
  return (
    <AdminLayout>
      {
        loading ? <Skeleton height={"100vh"} /> : <Table heading={"All Messages"} columns={columns} rows={rows} />
      }
    </AdminLayout>
  )
}

export default MessageManagement