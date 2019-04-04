import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY } from 'rxjs';
import { map, mergeMap, withLatestFrom, first, switchMap, filter } from 'rxjs/operators';
import { DocService } from '../doc.service';
import * as appStore from './';

@Injectable()
export class AppEffects {

    @Effect({ dispatch: false })
    logIt$ = this.actions$
        .pipe(withLatestFrom(this.store$.select(r => r)),
        map(store => console.log('store', store)));

    @Effect()
    saveUser$ = this.actions$
        .pipe(ofType(appStore.ActionTypes.SaveUser),
        switchMap((action: any) => this.docService.save({ ...action.payload, docType: 'user' }).pipe(map(r => new appStore.SaveUserSuccess()))));

    @Effect()
    getUsers$ = this.actions$
        .pipe(ofType(appStore.ActionTypes.GetUsers),
        switchMap((action: any) => {
            return this.docService.getAll('user').pipe(map(r => {
                return new appStore.GetUsersSuccess(r);
            }));
        }));

    @Effect()
    getAdmins$ = this.actions$
        .pipe(ofType(appStore.ActionTypes.GetAdmins),
        switchMap((action: any) => {
            return this.docService.getLatest('admin').pipe(map(r => {
                return new appStore.GetAdminsSuccess(r);
            }));
        }));

    @Effect()
    saveDoc$ = this.actions$
        .pipe(
        ofType(appStore.ActionTypes.SaveDoc),
        switchMap((action: any) => {
            return this.docService.save(action.payload).pipe(map(r => new appStore.UpdateSuccess(r)));
        })
        )

    @Effect() getPlayers$ = this.actions$
        .pipe(
        filter(r => r.type == appStore.ActionTypes.GetPlayers),
        switchMap((action: any) => {
            return this.docService.getAll('player').pipe(map(r => new appStore.GetPlayersSuccess(r)));
        })
        )



    constructor(
        private actions$: Actions,
        private docService: DocService,
        private store$: Store<any>
    ) { }
}