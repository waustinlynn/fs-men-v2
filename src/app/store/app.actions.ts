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
    GetPlayersSuccess = 'GetPlayersSuccess',
    ShowSnackbarError = 'ShowSnackbarError',
    GetTeamsSuccess = 'GetTeamsSuccess',
    GetDivisions = 'GetDivisions',
    GetDivisionsSuccess = 'GetDivisionsSuccess',
    GetDoc = 'GetDoc',
    SetViewSeasonData = 'SetViewSeasonData',
    GetList = 'GetList',
    // GetListSuccess = 'GetListSuccess'
}

export class SetViewSeasonData {
    readonly type = ActionTypes.SetViewSeasonData;
    constructor(public payload: any) { }
}

export class GetDivisions {
    readonly type = ActionTypes.GetDivisions;
    constructor(public payload: any) { }
}

export class GetDivisionsSuccess {
    readonly type = ActionTypes.GetDivisionsSuccess;
    constructor(public payload: any) { }
}

export class GetDoc {
    readonly type = ActionTypes.GetDoc;
    constructor(public payload: any) { }
}

// export class GetDocSuccess {
//     readonly type = GetDocSuccess;
//     constructor(public payload: any) { }
// }

export class GetList {
    readonly type = ActionTypes.GetList;
    constructor(public payload: any) { }
}

// export class GetListSuccess {
//     readonly type = GetListSuccess;
//     constructor(public payload: any) { }
// }

export class GetTeamsSuccess {
    readonly type = ActionTypes.GetTeamsSuccess;
    constructor(public payload: any) { }
}

export class ShowSnackbarError implements Action {
    readonly type = ActionTypes.ShowSnackbarError;
    constructor(public payload: any) { }
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
    constructor(public payload: any) { }
}

export class SaveUser implements Action {
    readonly type = ActionTypes.SaveUser;
    constructor(public payload: any) { }
}

export class SaveUserSuccess implements Action {
    readonly type = ActionTypes.SaveUserSuccess;
    constructor(public payload: any) { }
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
    | ShowSnackbarError
    | GetTeamsSuccess
    | GetDoc
    | GetList
    | GetDivisionsSuccess
    | GetDivisions
    | SetViewSeasonData