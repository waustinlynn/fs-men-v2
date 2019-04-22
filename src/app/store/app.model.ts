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
    linkedTeam: any;
    teamsSchedule: any;
    scoreEntryData: any;
    scores: any[];
    scoreMap: Map<string, any>;
    teamsToMatchIdMap: Map<string, string>;
    teamStats: any;
    matchMap: Map<string, any>;
}

export class GetDocPayload {
    docType: string;
    returnAction: string;
}