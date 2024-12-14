import {Roles} from '../../MiddleWare/auth.js'


export const EndPoints = {
    CreateProfile:[Roles.Junior,Roles.Senior],
    UpdateProfile:[Roles.Junior,Roles.Senior],

}