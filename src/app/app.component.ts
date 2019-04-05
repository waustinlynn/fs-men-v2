import { Component, OnInit } from '@angular/core';
import { Store, ActionsSubject } from '@ngrx/store';
import * as appStore from './store';
import { Observable, combineLatest } from 'rxjs';
import { first, filter, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'FS MEN';
  storeData$: Observable<appStore.AppState>;
  storeData: appStore.AppState;
  actionsForSnackbar: string[];

  constructor(private store: Store<any>, private as$: ActionsSubject) {
    this.storeData$ = store.select(r => r.app);
    this.storeData$.subscribe(r => this.storeData = r);
    this.actionsForSnackbar = [appStore.ActionTypes.UpdateSuccess, appStore.ActionTypes.ShowSnackbarError];
  }

  ngOnInit() {
    this.store.dispatch(new appStore.GetAdmins({}));
    this.store.dispatch(new appStore.GetUsers({}));

    //initialize get users
    combineLatest(
      this.as$.pipe(filter(r => r.type == appStore.ActionTypes.GetUsersSuccess), first()),
      this.as$.pipe(filter(r => r.type == appStore.ActionTypes.SetLoginData), first()),
      this.as$.pipe(filter(r => r.type == appStore.ActionTypes.GetAdminsSuccess), first())
    ).subscribe(_ => {
      this.store.dispatch(new appStore.SetUserData({}));
      this.as$.pipe(
        filter(r => r.type == appStore.ActionTypes.SetUserData),
        withLatestFrom(this.storeData$),
        first()
      ).subscribe(([actionData, storeData]) => {
        if (storeData.user == undefined) {
          let pl = { ...storeData.loginData };
          delete pl.id;
          this.store.dispatch(new appStore.SaveUser(pl));
        }
      })
    });

  }

  saveAdmin() {
    let admins = [{ userId: this.storeData.user.id }];
    this.store.dispatch(new appStore.SaveDoc({ docType: 'admin', admins }));
  }


  onSignIn(event: any) {
    this.store.dispatch(new appStore.SetLoginData(event));
  }
}
