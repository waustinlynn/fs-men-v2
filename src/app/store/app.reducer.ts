import { Action } from '@ngrx/store';
import { ActionTypes } from './app.actions';
import * as model from './app.model';
import * as actions from './app.actions';

export const initialState = {
    users: [],
    user: undefined,
    loading: true,
    userMap: undefined,
    loginData: undefined,
    loggedIn: false,
    admin: false,
    adminData: undefined,
    players: undefined,
    teamDoc: undefined,
    divisionDoc: undefined,
    teamMap: new Map<string, any>(),
    playerTeamMap: new Map<string, string>(),
    playerMap: new Map<string, any>(),
    viewSeasonData: undefined,
    schedules: undefined,
    editingPlayer: undefined,
    linkedPlayer: undefined,
    linkedTeam: undefined,
    teamsSchedule: undefined,
    scoreEntryData: undefined,
    scores: [],
    scoreMap: new Map<string, any>(),
    teamsToMatchIdMap: new Map<string, string>(),
    teamStats: undefined,
    matchMap: new Map<string, any>()
} as model.AppState;

function initTeam(dataObj, teamId) {
    dataObj[teamId] = getBlankStats();
}

export function getBlankStats() {
    return { wins: 0, losses: 0, gamesWon: 0, gamesPlayed: 0, points: 0, pct: 0.00 } as any;
}

export function appReducer(state: model.AppState = initialState, action: actions.Action) {
    switch (action.type) {
        case ActionTypes.SetLoading: {
            return { ...state, loading: action.payload };
        }

        case ActionTypes.GetUsersSuccess: {
            let newState = { ...state, users: action.payload };
            let um = new Map<string, any>();
            (action.payload as any[]).forEach(el => {
                um.set(el.id, el);
            });
            newState.userMap = um;
            return newState;
        }

        case ActionTypes.SetLoginData: {
            let newState = { ...state, loginData: action.payload };
            if (newState.loginData != undefined && newState.loginData.name != undefined) {
                newState.loggedIn = true;
            }
            return newState;
        }

        case ActionTypes.SetUser: {
            return { ...state, user: action.payload }
        }

        case ActionTypes.GetAdminsSuccess: {
            return { ...state, adminData: action.payload }
        }

        case ActionTypes.SetUserData: {
            let newState = { ...state };
            newState.user = state.users.find(r => r.email == state.loginData.email);

            return newState;
        }

        case ActionTypes.GetPlayersSuccess: {
            let newState = { ...state, players: action.payload, playerMap: new Map<string, any>() };
            newState.players.forEach(player => {
                if (!newState.playerMap.has(player.id)) {
                    newState.playerMap.set(player.id, player);
                }
            });
            return newState;
        }

        case ActionTypes.GetTeamsSuccess: {
            let newState = { ...state, teamDoc: action.payload, playerTeamMap: new Map<string, string>() };
            newState.teamDoc.teams.forEach(team => {
                newState.teamMap.set(team.id, team);
                team.players.forEach(player => {
                    if (!newState.playerTeamMap.has(player)) {
                        newState.playerTeamMap.set(player, team.name);
                    }
                })
            });
            return newState;
        }

        case ActionTypes.GetDivisionsSuccess: {
            return { ...state, divisionDoc: action.payload };
        }

        case ActionTypes.SetViewSeasonData: {
            return { ...state, viewSeasonData: action.payload }
        }

        case ActionTypes.GetSchedulesSuccess: {
            //setup teamsToMatchIdMap
            let newState = { ...state, schedules: action.payload }

            for (let schedule of action.payload) {
                let schedObj = { ...schedule }.schedule;
                let weeks = Object.keys(schedObj);
                weeks.forEach(week => {
                    let matchObj = { ...schedObj[week] };
                    let matchIds = Object.keys(matchObj);
                    matchIds.forEach(matchId => {
                        newState.matchMap.set(matchId, matchObj[matchId]);
                        let teamId = `${matchObj[matchId].team1}|${matchObj[matchId].team2}`;
                        newState.teamsToMatchIdMap.set(teamId, matchId);
                        teamId = `${matchObj[matchId].team2}|${matchObj[matchId].team1}`;
                        newState.teamsToMatchIdMap.set(teamId, matchId);
                    })
                })
            }

            return newState;
        }

        case ActionTypes.SetEditingPlayer: {
            return { ...state, editingPlayer: action.payload }
        }

        case ActionTypes.SetLinkedPlayer: {
            return { ...state, linkedPlayer: action.payload }
        }

        case ActionTypes.SetAdmin: {
            return { ...state, admin: action.payload }
        }

        case ActionTypes.SetLinkedTeam: {
            let newState = { ...state };
            if (newState.teamDoc == undefined) return newState;
            for (let i = 0; i < newState.teamDoc.teams.length; i++) {
                let team = newState.teamDoc.teams[i];
                for (let j = 0; j < team.players.length; j++) {
                    let player = team.players[j];
                    if (player == newState.linkedPlayer.id) {
                        newState.linkedTeam = team;
                        return newState;
                    }
                }
            }

            return newState;
        }

        case ActionTypes.SetTeamsSchedule: {
            let newState = { ...state };
            let linkedTeam = { ...newState.linkedTeam };
            let teamsMatches = {};
            for (let i = 0; i < newState.schedules.length; i++) {
                let schedule = { ...newState.schedules[i].schedule };
                let scheduleKeys = Object.keys(schedule);
                for (let week of scheduleKeys) {
                    let weekMatches = { ...schedule[week] };
                    let weekMatchesKeys = Object.keys(weekMatches);
                    for (let match of weekMatchesKeys) {
                        let team1Id = weekMatches[match].team1;
                        let team2Id = weekMatches[match].team2;
                        let matchData = {
                            matchId: match
                        } as any;
                        if (team1Id == linkedTeam.id || team2Id == linkedTeam.id) {
                            if (team1Id == linkedTeam.id) {
                                matchData.team = newState.teamMap.get(team2Id);
                                teamsMatches[week] = matchData;
                            }
                            if (team2Id == linkedTeam.id) {
                                matchData.team = newState.teamMap.get(team1Id);
                                teamsMatches[week] = matchData;
                            }
                        }
                    }
                }
            }
            newState.teamsSchedule = teamsMatches;
            return newState;
        }

        case ActionTypes.SetupScoreEntryData: {
            return { ...state, scoreEntryData: action.payload }
        }

        case ActionTypes.GetScoresSuccess: {
            let newState = { ...state, scores: action.payload };
            for (let score of newState.scores) {
                newState.scoreMap.set(score.matchId, score);
            }
            return newState;
        }

        case ActionTypes.SetTeamStats: {
            if (state.scores.length == 0 || state.teamMap.size == 0) {
                return { ...state, teamStats: {} };
            }
            let newState = { ...state };
            let data = {} as any;
            for (let score of newState.scores) {
                let team = score.usersTeamId;
                let opponent = score.opponentId;
                if (data[team] == undefined) {
                    initTeam(data, team);
                }
                if (data[opponent] == undefined) {
                    initTeam(data, opponent);
                }
                if (team == score.winner) {
                    data[team].wins++;
                    data[opponent].losses++;
                } else {
                    data[team].losses++;
                    data[opponent].wins++;
                }
                data[team].gamesWon += score.games[team];
                data[team].gamesPlayed += (score.games[team] + score.games[opponent]);
                data[opponent].gamesWon += score.games[opponent];
                data[opponent].gamesPlayed += (score.games[team] + score.games[opponent]);
                data[team].points += score.usersSetsWon;
                data[opponent].points += score.opponentsSetsWon;
            }
            for (let teamId of Object.keys(data)) {
                data[teamId].pct = data[teamId].gamesWon / data[teamId].gamesPlayed;
            }
            console.log(data);
            newState.teamStats = data;
            return newState;
        }

        default:
            return state;
    }
}