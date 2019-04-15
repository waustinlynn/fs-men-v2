export interface AppState {
    users: any[];
    loading: boolean;
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
    viewSeasonData: any;
    schedules: any[];
    editingPlayer: any;
    linkedPlayer: any;
}

export class GetDocPayload {
    docType: string;
    returnAction: string;
}