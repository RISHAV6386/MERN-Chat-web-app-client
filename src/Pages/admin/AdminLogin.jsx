import { useInputValidation } from '6pp'
import { Button, Container, Paper, TextField, Typography } from '@mui/material'
import { useDispatch, useSelector } from "react-redux"
import { Navigate } from 'react-router-dom'
import { bgColor } from '../../constants/color'
import { adminLogin, getAdmin,  } from '../../redux/thunks/admin'
import { useEffect } from 'react'

const AdminLogin = () => {
    const dispatch=useDispatch()
    const {isAdmin}=useSelector(state=>state.auth)
    const secretKey = useInputValidation("")
    const subminHandler = (e) => { 
        e.preventDefault()
        dispatch(adminLogin(secretKey.value))
     }

     useEffect(()=>{
        dispatch(getAdmin())
     },[dispatch])

    if(isAdmin) return <Navigate to="/admin/dashboard"/>
    return (
        <div style={{ backgroundImage: bgColor, padding: "3rem" }}>
            <Container component={"main"} maxWidth="xs" sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "", }}  >
                <Paper elevation={3} sx={{ padding: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Typography variant='h5'>Admin Login</Typography>
                    <form style={{ width: "100%", marginTop: "1rem" }} onSubmit={subminHandler}>
                        <TextField required fullWidth label="Secret Key" type='password' margin='normal' variant="outlined" value={secretKey.value} onChange={secretKey.changeHandler} />
                        <Button sx={{ marginTop: "1rem" }} fullWidth variant='contained' color='primary' type="submit"> Log In</Button>

                    </form>


                </Paper>

            </Container>
        </div>
    )
}

export default AdminLogin