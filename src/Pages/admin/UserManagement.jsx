import { useFetchData } from '6pp'
import { Avatar, Skeleton } from '@mui/material'
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
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => <Avatar alt={params.row.name} src={params.row.avatar} />
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 200
  },
  {
    field: "username",
    headerName: "Username",
    headerClassName: "table-header",
    width: 200
  },
  {
    field: "friends",
    headerName: "Friends",
    headerClassName: "table-header",
    width: 150
  },
  {
    field: "groups",
    headerName: "Groups",
    headerClassName: "table-header",
    width: 200
  },
]
const UserManagement = () => {

  const { loading, data, error } = useFetchData(`${server}/api/v1/admin/users`, "dashboard-users")
  useErrors([{ isError: error, error: error }])
  const [rows, setRows] = useState([])
  useEffect(() => {
    if (data) setRows(data?.transformsAllUser.map((i) => ({ ...i, id: i._id, avatar: transformImage(i.avatar, 50) })))
  }, [data])
  return (
    <AdminLayout>
      {

        loading ? <Skeleton height={"100vh"} /> : <Table heading={"All Users"} rows={rows} columns={columns} />
      }
    </AdminLayout>
  )
}

export default UserManagement