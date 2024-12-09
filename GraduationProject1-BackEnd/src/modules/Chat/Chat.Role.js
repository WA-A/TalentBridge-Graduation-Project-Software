import { Roles } from '../../MiddleWare/auth.js'


export const EndPoints = {
    CreateChat: [Roles.Senior, Roles.Junior],
    GetChatUsers: [Roles.Senior, Roles.Junior],
}