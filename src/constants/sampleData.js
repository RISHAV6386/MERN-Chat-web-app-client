
const sampleChats = [{
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "jhon Doe",
    _id: "1",
    groupChat: false,
    members: ["1", "2"]

},
{
    avatar: ["https://www.w3schools.com/howto/img_avatar.png",],
    name: "jhon Djg",
    _id: "2",
    groupChat: true,
    members: ["1", "2"]

}
]
export default sampleChats

export const sampleUsers = [
    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png",],
        name: "jhon Djg",
        _id: "1",
    },
    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png",],
        name: "jhon Djgkj",
        _id: "2",
    }]
export const sampleNotifications = [
    {
        sender: {
            avatar: ["https://www.w3schools.com/howto/img_avatar.png",],
            name: "jhon Djg",
        },
        _id: "1",
    },
    {
        sender: {
            avatar: ["https://www.w3schools.com/howto/img_avatar.png",],
            name: "jhon Djgkj",
        },
        _id: "2",
    }]


export const sampleMessage = [
    {
        content: "message hai",
        _id: "ikutgrfedsddff",
        sender: {
            _id: "user._id",
            name: "Chaman",
        },
        chat: "chatId",
        createdAt: "2024-02-12T10:41:30.630Z"
    },
    {
        attachments: [{
            public_id: "asdf",
            url: "https://www.w3schools.com/howto/img_avatar.png"
        }],
        content: "",
        _id: "ikutgrkjfedsddff",
        sender: {
            _id: "lkjgfds",
            name: "Chaman",
        },
        chat: "chatId",
        createdAt: "2024-02-12T10:41:30.630Z"
    }
]

export const dashboardData={
    users:[{
        name: "jhon Doe",
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        _id: "1",
        username:"sdfgj",
        friends:20,
        groups:5
    },
    {
        name: "jhon Doe",
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        _id: "1",
        username:"sdfgj",
        friends:20,
        groups:5
    },
]
}