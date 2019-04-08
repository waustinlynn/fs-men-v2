export interface AppState {
    users: any[];
    user: any;
    userMap: Map<string, any>;
    loginData: any;
    loggedIn: boolean;
    admin: boolean;
    adminData: any;
    players: any[];
    teamDoc: any;
    teamMap: Map<string, any>;
    playerTeamMap: Map<string, string>;
    playerMap: Map<string, any>;
    divisionDoc: any;
}

export class GetDocPayload {
    docType: string;
    returnAction: string;
}