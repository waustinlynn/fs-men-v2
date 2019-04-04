import { Action } from '@ngrx/store';

export enum ActionTypes {
    SaveUser = 'SaveUser',
    SaveUserSuccess = 'SaveUserSuccess',
    GetUsers = 'GetUsers',
    GetUsersSuccess = 'GetUsersSuccess',
    SetLoginData = 'SetLoginData',
    SetUser = 'SetUser',
    SaveDoc = 'SaveDoc',
    UpdateSuccess = 'UpdateSuccess',
    GetAdmins = 'GetAdmins',
    GetAdminsSuccess = 'GetAdminsSuccess',
    SetUserData = 'SetUserData',
    GetPlayers = 'GetPlayers',
    GetPlayersSuccess = 'GetPlayersSuccess'
}

export class GetPlayersSuccess implements Action {
    readonly type = ActionTypes.GetPlayersSuccess;
    constructor(public payload: any) { }
}

export class GetPlayers implements Action {
    readonly type = ActionTypes.GetPlayers;
    constructor(public payload: any) { }
}

export class SetUserData implements Action {
    readonly type = ActionTypes.SetUserData;
    constructor(public payload: any) { }
}

export class GetAdminsSuccess implements Action {
    readonly type = ActionTypes.GetAdminsSuccess;
    constructor(public payload: any) { }
}

export class GetAdmins implements Action {
    readonly type = ActionTypes.GetAdmins;
    constructor(public payload: any) { }
}

export class UpdateSuccess implements Action {
    readonly type = ActionTypes.UpdateSuccess;
    constructor(public payload: any) { }
}

export class SaveDoc implements Action {
    readonly type = ActionTypes.SaveDoc;
    constructor(public payload: any) { }
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
    | SaveDoc
    | UpdateSuccess
    | GetAdmins
    | GetAdminsSuccess
    | SetUserData
    | GetPlayers
    | GetPlayersSuccess