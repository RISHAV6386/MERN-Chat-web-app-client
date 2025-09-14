import { useFileHandler, useInputValidation } from "6pp";
import { CameraAlt } from "@mui/icons-material";
import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { VisuallyHiddenInput } from "../Components/Style/StyledComponents";
import { transformImage } from '../Lib/features';
import { bgColor } from '../constants/color';
import { server } from '../constants/config';
import { userExists } from '../redux/reducers/Auth';
import { usernameValidator } from "../utils/validation";
const Login = () => {

  const [islogin, setislogin] = useState(true);
  const [isloading, setIsLoading] = useState(false);
  const togglelogin = () => setislogin((prev) => (!prev));
  const name=useInputValidation("")
  const bio=useInputValidation("")
  const username=useInputValidation("",usernameValidator)
  const password=useInputValidation("")

  const avatar=useFileHandler("single")
  const dispatch=useDispatch()
  const handleLogin=async(e)=>{
    e.preventDefault()
    const toastId=toast.loading("Logging in...") 

    setIsLoading(true)
    const config= {withCredentials:true,headers:{"Content-Type":"application/json"}}
    try {
     const {data}= await axios.post(`${server}/api/v1/user/login`,{username:username.value,password:password.value},config)
     dispatch(userExists(data.user))
     toast.success(data.message,{id:toastId})
    } catch (error) {
      toast.error(error?.response?.data?.response.message ||"Something went Wrong",{id:toastId})
    }finally{
      setIsLoading(false)
    }

    }
  const handleSignup=async(e)=>{
    e.preventDefault()
    const toastId=toast.loading("Signing Up")
    setIsLoading(true)
  const formData=new FormData();
  formData.append("avatar",avatar.file);
  formData.append("name",name.value);
  formData.append("bio",bio.value);
  formData.append("username",username.value);
  formData.append("password",password.value);
  const config= {withCredentials:true,headers:{"Content-Type":"multipart/form-data"}};
    try {
      const {data}=await axios.post(`${server}/api/v1/user/signup`,formData,config)
      dispatch(userExists(data.user));
      toast.success(data.message,{id:toastId});
    } catch (error) {
      toast.error(error?.response?.data?.response.message || "Something went Wrong",{id:toastId})
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <div style={{backgroundImage:bgColor, padding:"3rem"}}>
      <Container component={"main"} maxWidth="xs" sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding:"",}}  >
      <Paper elevation={3} sx={{ padding: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {
          islogin ?
            <>
              <Typography variant='h5'>Login</Typography>
              <form style={{ width: "100%", marginTop: "1rem" }} onSubmit={handleLogin}> 
                <TextField required fullWidth label="Username" margin='normal' variant="outlined" value={username.value} onChange={username.changeHandler}/>
                <TextField required fullWidth label="Password" type='password' margin='normal' variant="outlined" value={password.value} onChange={password.changeHandler}/>
                <Button sx={{ marginTop: "1rem" }} fullWidth variant='contained' color='primary' type="submit" disabled={isloading}> Log In</Button>
                <Typography textAlign={"center"} m={"1rem"}>Or</Typography>
                <Button variant='text' fullWidth onClick={togglelogin} disabled={isloading}>Sign Up Instead</Button>
              </form>
            </>
            : <>
              <Typography variant='h5'>Sign Up</Typography>
              <form style={{ width: "100%", marginTop: "1rem" }} onSubmit={handleSignup}>
                <Stack position={'relative'} width={"10rem"} margin={"auto"}>

                  <Avatar sx={{ width: "10rem", height: "10rem", objectFit: "contain" }} src={transformImage(avatar.preview)}/>

                  <IconButton sx={{position:"absolute", bottom:0,right:0, backgroundColor:"white"}} component="label" >
                    <>
                      <CameraAlt />
                      <VisuallyHiddenInput type="file" onChange={avatar.changeHandler} />
                    </>
                  </IconButton>


                </Stack>
                  {avatar.error && (
                    <Typography m={" auto"} display={"block"} width={"fit-content"} color={"error"} variant='caption'>
                      {avatar.error}
                    </Typography>
                  )}

                <TextField required fullWidth label="Name" margin='normal' variant="outlined" value={name.value} onChange={name.changeHandler}/>
                <TextField required fullWidth label="Bio" margin='normal' variant="outlined" value={bio.value} onChange={bio.changeHandler} />
                <TextField required fullWidth label="Username" margin='normal' variant="outlined" value={username.value} onChange={username.changeHandler} />
                {
                  username.error && (
                    <Typography color={"error"} variant='caption'>
                      {username.error}
                    </Typography>
                  )

}

                <TextField required fullWidth label="Password" type='password' margin='normal' variant="outlined" value={password.value} onChange={password.changeHandler}/>
                <Button sx={{ marginTop: "1rem" }} fullWidth variant='contained' color='primary' type="submit" disabled={isloading}> Sign Up</Button>
                <Typography textAlign={"center"} m={"1rem"}>Or</Typography>
                <Button variant='text' fullWidth onClick={togglelogin} disabled={isloading} >Login Instead</Button>
              </form>
            </>
        }
      </Paper>

    </Container>
    </div>
  )
}

export default Login