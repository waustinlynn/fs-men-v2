import * as appStore from './';

export const getTeamsPayload = {
    docType: 'teams',
    returnAction: appStore.ActionTypes.GetTeamsSuccess
} as appStore.GetDocPayload;

export const getDivisionsPayload = {
    docType: 'division',
    returnAction: appStore.ActionTypes.GetDivisionsSuccess
} as appStore.GetDocPayload;
