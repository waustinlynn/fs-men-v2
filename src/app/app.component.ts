import { Component, OnInit } from '@angular/core';
import { Store, ActionsSubject } from '@ngrx/store';
import * as appStore from './store';
import { Observable, combineLatest } from 'rxjs';
import { first, filter, withLatestFrom } from 'rxjs/operators';
import * as payloads from './store/payloads';

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
  displayLabel: string;

  constructor(private store: Store<any>, private as$: ActionsSubject) {
    this.storeData$ = store.select(r => r.app);
    this.storeData$.subscribe(r => this.storeData = r);
    this.actionsForSnackbar = [appStore.ActionTypes.UpdateSuccess, appStore.ActionTypes.ShowSnackbarError];
  }

  ngOnInit() {
    //initialize the calls for all the data
    this.store.dispatch(new appStore.GetAdmins({}));
    this.store.dispatch(new appStore.GetUsers({}));
    this.store.dispatch(new appStore.GetPlayers({}));
    this.store.dispatch(new appStore.GetDoc({ ...payloads.getTeamsPayload }));
    this.store.dispatch(new appStore.GetDivisions({}));
    this.store.dispatch(new appStore.GetSchedules({}));
    this.store.dispatch(new appStore.GetScores({}));

    //disable loading once we have received users and admins
    combineLatest(
      this.as$.pipe(filter(r => r.type == appStore.ActionTypes.GetUsersSuccess), first()),
      this.as$.pipe(filter(r => r.type == appStore.ActionTypes.GetAdminsSuccess), first())
    ).subscribe(r => this.store.dispatch(new appStore.SetLoading(false)));

    //listen for a linked player and for teams to be set, then associate the linked player with their team
    combineLatest(
      this.as$.pipe(filter(r => r.type == appStore.ActionTypes.SetLinkedPlayer)),
      this.as$.pipe(filter(r => r.type == appStore.ActionTypes.GetTeamsSuccess))
    ).pipe(first()).subscribe(r => this.store.dispatch(new appStore.SetLinkedTeam({})));

    //initialize get users
    combineLatest(
      this.as$.pipe(filter(r => r.type == appStore.ActionTypes.GetUsersSuccess)),
      this.as$.pipe(filter(r => r.type == appStore.ActionTypes.SetLoginData)),
      this.as$.pipe(filter(r => r.type == appStore.ActionTypes.GetAdminsSuccess))
    ).pipe(first()).subscribe(_ => {

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
          this.displayLabel = `${pl.email} - no player linked to account`;
          this.store.dispatch(new appStore.SetLoading(false));
        } else {
          this.setPlayerAdmin();
        }
      })
    });

    //listen to set team's schedule
    combineLatest(
      this.as$.pipe(filter(r => r.type == appStore.ActionTypes.SetLinkedTeam)),
      this.as$.pipe(filter(r => r.type == appStore.ActionTypes.GetSchedulesSuccess))
    ).pipe(first()).subscribe(r => this.store.dispatch(new appStore.SetTeamsSchedule({})));

  }

  private setPlayerAdmin() {
    let admin = this.storeData.adminData.admins.some(r => r.userId == this.storeData.user.id);
    this.store.dispatch(new appStore.SetAdmin(admin));
    this.storeData$.pipe(filter(r => r.players != undefined && r.players.length > 0), first())
      .subscribe(r => {
        let user = r.user;
        this.displayLabel = `${user.email} - no player linked to account`;
        for (let i = 0; i < r.players.length; i++) {
          let player = { ...r.players[i] };
          if (player.accounts == undefined) continue;
          if (player.accounts.some(r => r == user.email)) {
            this.store.dispatch(new appStore.SetLinkedPlayer(player));
            this.displayLabel = `${player.firstName} ${player.lastName}`;
            break;
          }
        }
        this.store.dispatch(new appStore.SetLoading(false));
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
