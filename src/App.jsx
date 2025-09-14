import axios from "axios";
import { lazy, Suspense, useEffect } from 'react';
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectRoute from './Components/auth/ProtectRoute';
import { LayoutLoader } from './Components/layout/Loaders';
import { server } from "./constants/config";
import { userExists, userNotExists } from './redux/reducers/Auth';
import { SocketProvider } from './Socket';
const Login = lazy(() => import("./Pages/Login"))
const Home = lazy(() => import("./Pages/Home"))
const Chat = lazy(() => import("./Pages/Chat"))
const Groups = lazy(() => import("./Pages/Groups"))
const NotFound = lazy(() => import("./Pages/NotFound"))
const AdminLogin = lazy(() => import("./Pages/admin/AdminLogin"))
const Dashboard = lazy(() => import("./Pages/admin/Dashboard"))
const ChatManagement = lazy(() => import("./Pages/admin/ChatManagement"))
const MessageManagement = lazy(() => import("./Pages/admin/MessageManagement"))
const UserManagement = lazy(() => import("./Pages/admin/UserManagement"))

const App = () => {
  const { user, loader } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  useEffect(() => {
    axios.get(`${server}/api/v1/user/profile`, { withCredentials: true }).then((res) => dispatch(userExists(res.data.user))).catch((err) => dispatch(userNotExists()))
  }, [dispatch])

  return loader ? (<LayoutLoader />) : (
    <BrowserRouter>
      <Suspense fallback={<LayoutLoader />}>
        <Routes>
          <Route element={<SocketProvider><ProtectRoute user={user} /></SocketProvider>}>

            <Route path="/" element={<Home />} />
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="/groups" element={<Groups />} />
          </Route>
          <Route path="/login" element={<ProtectRoute user={!user} redirect='/'><Login /></ProtectRoute>} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/chats" element={<ChatManagement />} />
          <Route path="/admin/messages" element={<MessageManagement />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position='bottom-center' />
    </BrowserRouter>
  )
}

export default App