import * as appStore from './';

export const getTeamsPayload = {
    docType: 'teams',
    returnAction: appStore.ActionTypes.GetTeamsSuccess
} as appStore.GetDocPayload;
