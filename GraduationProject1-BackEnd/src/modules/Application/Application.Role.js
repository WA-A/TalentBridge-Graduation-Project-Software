import {Roles} from '../../MiddleWare/auth.js'


export const EndPoints = {
    CreateApplication:[Roles.Junior,Roles.Senior],
    getApplication:[Roles.Senior],
}

