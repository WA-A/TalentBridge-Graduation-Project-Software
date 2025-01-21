import {Roles} from '../../MiddleWare/auth.js'


export const EndPoints = {
    CreateTask:[Roles.Senior],
    getTask:[Roles.Senior,Roles.Junior,Roles.Admin],
}