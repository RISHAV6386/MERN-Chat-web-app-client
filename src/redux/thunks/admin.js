import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { server } from "../../constants/config"

const adminLogin = createAsyncThunk("admin/login", async (secretKey) => {
    try {
        const config = { withCredentials: true, headers: { "Content-Type": "application/json" } }
        const { data } = await axios.post(`${server}/api/v1/admin/verify`, { secretKey }, config)
        return data.message
    } catch (error) {
        console.log(error?.response?.data?.response?.message)
        throw error?.response?.data?.response?.message
    }
})
const getAdmin = createAsyncThunk("admin/getAdmin", async (secretKey) => {
    try {
        const { data } = await axios.get(`${server}/api/v1/admin/`, { withCredentials: true })
        return data.admin
    } catch (error) {
        throw error?.response?.data?.response?.message
    }
})
const adminLogout = createAsyncThunk("admin/logout", async (secretKey) => {
    try {
        const { data } = await axios.get(`${server}/api/v1/admin/logout`, { withCredentials: true })
        return data.message
    } catch (error) {
        throw error?.response?.data?.response?.message
    }
})
export { adminLogin, getAdmin, adminLogout};