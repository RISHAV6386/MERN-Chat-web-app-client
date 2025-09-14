import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material';
import { IconButton, Skeleton, Stack } from '@mui/material';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import FileMenu from '../Components/dialogs/FileMenu';
import AppLayout from "../Components/layout/AppLayout";
import MessageComponent from '../Components/shared/MessageComponent';
import { InputBox } from '../Components/Style/StyledComponents';
import { grayColor, orange } from '../constants/color';
import { getSocket } from '../Socket';
import { useInfiniteScrollTop } from "6pp";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TypingLoader } from '../Components/layout/Loaders';
import { useErrors, useSocketEvents } from '../Hooks/Hook';
import { useChatDeatilsQuery, useGetMessagesQuery } from '../redux/api/api';
import { removeMessageAlert } from '../redux/reducers/chat';
import { setIsFileMenu } from '../redux/reducers/misc';



const Chat = ({ chatId, user }) => {

  const containerRef = useRef(null);
  const socket = getSocket()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [page, setPage] = useState(1)
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null)

  const [typing, setTyping] = useState(false)
  const [userTyping, setUserTyping] = useState(false)
  const typingTimeOut = useRef(null)

  const bottomRef = useRef(null)
  const chatDetails = useChatDeatilsQuery({ chatId, skip: !chatId })
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page })


  // console.log(chatDetails)
  const members = chatDetails?.data?.chat?.members
  // console.log(messages)
  const messageChange = (e) => {
    setMessage(e.target.value)
    if (!typing) {
      socket.emit("START_TYPING", { members, chatId });
      setTyping(true)
    }
    if (typingTimeOut.current) clearTimeout(typingTimeOut.current)

    typingTimeOut.current = setTimeout(() => {
      socket.emit("STOP_TYPING", { members, chatId })
      setTyping(false)
    }, [1000])
  }

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(containerRef, oldMessagesChunk.currentData?.totalPages, page, setPage, oldMessagesChunk.currentData?.messages
  )
  const errors = [{ isError: chatDetails.isError, error: chatDetails.error },
  { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error }
  ]
  // console.log(oldMessages)

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true))
    setFileMenuAnchor(e.currentTarget)
  }

  const submitHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    // console.log(members);
    socket.emit('NEW_MESSAGE', { chatId, members, message })
    setMessage("");
  }

  useEffect(() => {
    socket.emit("CHAT_JOINED", {userId:user._id,members})
    dispatch(removeMessageAlert(chatId))
    return () => {
      setMessages([])
      setMessage("")
      setPage(1)
      setOldMessages([])
    socket.emit("CHAT_LEAVED", {userId:user._id,members})
      

    }
  }, [chatId])

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (chatDetails.isError) return navigate("/")
  }, [chatDetails.isError])
  const newMessageListener = useCallback((data) => {
    if (data.chatId !== chatId) return;
    setMessages((prev) => [...prev, data.message])
  }, [chatId])

  const startTypingListener = useCallback((data) => {
    if (data?.chatId !== chatId) return;
    setUserTyping(true)
  }, [chatId])

  const stopTypingListener = useCallback((data) => {
    if (data?.chatId !== chatId) return;
    setUserTyping(false)
  }, [chatId])

  const alertListener = useCallback((data) => {

    if (data.chatId !== chatId) return
    const messageForAlert = {
      content: data.message,
      sender: {
        _id: "klkhgfdsadfg",
        name: "Admin",
      },
      chat: chatId,
      createdAt: new Date().toISOString()
    }
    setMessages((prev) => [...prev, messageForAlert])
  }, [chatId])


  const eventArr = {
    ['ALERT']: alertListener,
    ['NEW_MESSAGE']: newMessageListener,
    ['START_TYPING']: startTypingListener,
    ['STOP_TYPING']: stopTypingListener,

  }
  useSocketEvents(socket, eventArr)
  useErrors([{errors}])

  const allMessages = [...oldMessages, ...messages]

  return (chatDetails.isLoading ? (<Skeleton />) :
    (<Fragment>
      <Stack ref={containerRef} boxSizing={"border-box"} padding={"1rem"} spacing={"1rem"} bgcolor={grayColor} height={"90%"} sx={{ overflowX: "hidden", overflowY: "auto" }} >

        {allMessages.map((i) => (
          <MessageComponent key={i._id} message={i} user={user} />
        ))}

        {userTyping && <TypingLoader />}
        <div ref={bottomRef} />

      </Stack>
      <form onSubmit={submitHandler} style={{ height: "10%" }}>
        <Stack direction={"row"} height={"100%"} padding={"1rem"} alignItems={"center"} position={"relative"}  >
          <IconButton sx={{ rotate: "30deg", position: "absolute", left: "1.5rem", rotate: "30deg" }} onClick={handleFileOpen} >
            <AttachFileIcon />
          </IconButton>
          <InputBox placeholder='Type Message Here...' value={message} onChange={messageChange} />

          <IconButton type='submit' sx={{ bgcolor: `${orange}`, color: "white", marginLeft: "1rem", padding: "0.5rem", "&:hover": { bgcolor: "error.dark" }, rotate: "-30deg" }}  >
            <SendIcon />
          </IconButton>

        </Stack>
      </form>
      <FileMenu anchorEl={fileMenuAnchor} chatId={chatId} />
    </Fragment>

    ))
}

export default AppLayout()(Chat)