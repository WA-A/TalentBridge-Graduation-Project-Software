import { Roles } from '../src/MiddleWare/auth.js'


export const EndPoints = {
    AddSkills: [Roles.Senior, Roles.Junior],
}