import {Roles} from '../../MiddleWare/auth.js'


export const EndPoints = {
    CreateTask:[Roles.Senior],
    getAllTaskBySenior:[Roles.Senior],
}