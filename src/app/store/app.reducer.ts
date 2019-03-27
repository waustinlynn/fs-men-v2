import { Action } from '@ngrx/store';
import { ActionTypes } from './app.actions';
import * as model from './app.model';
import * as actions from './app.actions';

export const initialState = {
    users: [],
    user: undefined,
    loginData: undefined,
    loggedIn: false,
    admin: false
} as model.AppState;

export function appReducer(state: model.AppState = initialState, action: actions.Action) {
    switch (action.type) {
        case ActionTypes.GetUsersSuccess: {
            return { ...state, users: action.payload };
        }

        case ActionTypes.SetLoginData: {
            let newState = { ...state, loginData: action.payload };
            if (newState.loginData != undefined && newState.loginData.name != undefined) {
                newState.loggedIn = true;
            }
            return newState;
        }

        default:
            return state;
    }
}