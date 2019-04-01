import { Action } from '@ngrx/store';

export enum ActionTypes {
    SaveUser = 'SaveUser',
    SaveUserSuccess = 'SaveUserSuccess',
    GetUsers = 'GetUsers',
    GetUsersSuccess = 'GetUsersSuccess',
    SetLoginData = 'SetLoginData',
    SetUser = 'SetUser'

}

export class SetUser implements Action {
    readonly type = ActionTypes.SetUser;
    constructor(public payload: any) { }
}

export class SetLoginData implements Action {
    readonly type = ActionTypes.SetLoginData;
    constructor(public payload: any) { }
}


export class GetUsersSuccess implements Action {
    readonly type = ActionTypes.GetUsersSuccess;
    constructor(public payload: any) { }
}
export class GetUsers implements Action {
    readonly type = ActionTypes.GetUsers;
}

export class SaveUser implements Action {
    readonly type = ActionTypes.SaveUser;
    constructor(public payload: any) { }
}

export class SaveUserSuccess implements Action {
    readonly type = ActionTypes.SaveUserSuccess;
}

export type Action = SaveUser
    | SaveUserSuccess
    | GetUsers
    | GetUsersSuccess
    | SetLoginData
    | SetUser    