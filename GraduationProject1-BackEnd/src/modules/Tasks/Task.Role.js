import {Roles} from '../../MiddleWare/auth.js'


export const EndPoints = {
    CreateTask:[Roles.Senior],
    GetAllTaskBySenior:[Roles.Senior],
    GetAllTasksForJunior:[Roles.Junior],

}