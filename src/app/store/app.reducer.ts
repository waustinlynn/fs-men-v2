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
    linkedPlayer: undefined
} as model.AppState;

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
            return { ...state, schedules: action.payload }
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

        default:
            return state;
    }
}