import { Roles } from '../src/MiddleWare/auth.js'


export const EndPoints = {
    AddLanguages: [Roles.Senior, Roles.Junior],
}