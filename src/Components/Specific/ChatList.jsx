import { Stack } from '@mui/material'
import { bgColor } from '../../constants/color'
import ChatItem from '../shared/ChatItem'

const ChatList = ({ w = "100%", chats = [], chatId, onlineUsers=[] , newMassagesAlert = [{ chatId: "", count: 0 }], handleDeleteChat }) => {
  return (
    <Stack width={w} direction={"column"} overflow={"auto"} height={"100%"} sx={{ backgroundImage: bgColor }}>
      {
        chats?.map((data, index) => {
          const { avatar, _id, name, groupChat, members } = data;
          const newMessageAlert = newMassagesAlert.find(
            ({ chatId }) => chatId === _id
          );
          const isOnline = members?.some((member) => onlineUsers.includes(member));

          return <ChatItem newMessageAlert={newMessageAlert} isOnline={isOnline} avatar={avatar} name={name} _id={_id} key={_id} groupChat={groupChat} sameSender={chatId === _id} handleDeleteChat={handleDeleteChat} index={index} />

        })}
    </Stack>
  )
}
export default ChatList