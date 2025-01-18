import {Roles} from '../../MiddleWare/auth.js'


export const EndPoints = {
    CreateProject:[Roles.Senior],
    getProject:[Roles.Senior,Roles.Junior,Roles.Admin],
}