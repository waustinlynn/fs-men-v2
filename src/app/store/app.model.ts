export interface AppState {
    users: any[];
    user: any;
    userMap: Map<string, any>;
    loginData: any;
    loggedIn: boolean;
    admin: boolean;
    adminData: any;
    players: any[];
    teams: any[];
    playerTeamMap: Map<string, string>;
}

export class GetDocPayload {
    docType: string;
    returnAction: string;
}