import {Roles} from '../../MiddleWare/auth.js'
import { SubmitTask } from './Tasks.controller.js'


export const EndPoints = {
    CreateTask:[Roles.Senior],
    GetAllTaskBySenior:[Roles.Senior],
    GetAllTasksForJunior:[Roles.Junior],
    DeleteTask:[Roles.Senior],
    SubmitTask:[Roles.Junior],
    GetAllJuniorSubmissions:[Roles.Junior],
    GetTaskSubmissionsBySenior:[Roles.Senior]
}