import { Component, OnInit } from '@angular/core';
import { Store, ActionsSubject } from '@ngrx/store';
import * as appStore from './store';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { first, filter, withLatestFrom } from 'rxjs/operators';
import * as payloads from './store/payloads';
import { Router, NavigationEnd, ActivatedRoute, NavigationStart } from '@angular/router';

import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angular-6-social-login';

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
  redirectToStandings: BehaviorSubject<boolean>;
  currentRoute: string = '';

  constructor(
    private store: Store<any>,
    private as$: ActionsSubject,
    private router: Router,
    private actRoute: ActivatedRoute,
    private socialAuthService: AuthService) {
    this.storeData$ = store.select(r => r.app);
    this.storeData$.subscribe(r => this.storeData = r);
    this.actionsForSnackbar = [appStore.ActionTypes.UpdateSuccess, appStore.ActionTypes.ShowSnackbarError];
    this.actRoute.url.subscribe(r => {
      this.currentRoute = r[0].path;
    });

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


    // this.socialAuthService.authState.pipe(filter(r => r == null)).subscribe(r => this.onSignIn.emit(undefined));
    // this.socialAuthService.authState.pipe(filter(r => r != undefined && r != null), first())
    //   .subscribe(r => {
    //     this.onSignIn.emit(r);
    //   });
    this.socialAuthService.authState.subscribe(r => {
      if (r == null) {
        this.store.dispatch(new appStore.SetLoginData(undefined));
      } else {
        this.store.dispatch(new appStore.SetLoginData(r));
      }
    });

    // this.as$.pipe(filter(r => r.type == appStore.ActionTypes.SetLoginData))
    //   .subscribe((r: any) => {
    //     if (this.currentRoute == '' && r.payload == undefined) {
    //       this.router.navigate(['/login']);
    //     }
    //   })


    //disable loading once we have received users and admins
    combineLatest(
      this.as$.pipe(filter(r => r.type == appStore.ActionTypes.GetUsersSuccess), first()),
      this.as$.pipe(filter(r => r.type == appStore.ActionTypes.GetAdminsSuccess), first())
    ).subscribe(r => {
      setTimeout(() => {
        this.store.dispatch(new appStore.SetLoading(false))
      }, 100);

    });

    //listen for a linked player and for teams to be set, then associate the linked player with their team
    combineLatest(
      this.as$.pipe(filter(r => r.type == appStore.ActionTypes.SetLinkedPlayer)),
      this.as$.pipe(filter(r => r.type == appStore.ActionTypes.GetTeamsSuccess))
    ).pipe(first()).subscribe(r => {
      this.store.dispatch(new appStore.SetLinkedTeam({}));
    });

    //initialize get users
    combineLatest(
      this.as$.pipe(filter(r => r.type == appStore.ActionTypes.GetUsersSuccess)),
      this.as$.pipe(filter((r: any) => r.type == appStore.ActionTypes.SetLoginData && r.payload != null)),
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
          this.router.events.pipe(filter(r => r instanceof NavigationEnd), first()).subscribe(r => this.store.dispatch(new appStore.SetLoading(false)));

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

    //listen to setup team stats for schedule
    combineLatest(
      this.as$.pipe(filter(r => r.type == appStore.ActionTypes.GetTeamsSuccess)),
      this.as$.pipe(filter(r => r.type == appStore.ActionTypes.GetScoresSuccess))
    ).pipe(first()).subscribe(r => this.store.dispatch(new appStore.SetTeamStats({})));
  }

  private setPlayerAdmin() {
    let admin = this.storeData.adminData.admins.some(r => r.userId == this.storeData.user.id);
    this.store.dispatch(new appStore.SetAdmin(admin));
    this.storeData$.pipe(filter(r => r.players != undefined && r.players.length > 0), first())
      .subscribe(r => {
        let user = r.user;
        this.displayLabel = `${user.email} - no player linked to account`;
        let playerFound = false;
        for (let i = 0; i < r.players.length; i++) {
          let player = { ...r.players[i] };
          if (player.accounts == undefined) continue;
          if (player.accounts.some(r => r == user.email)) {
            this.store.dispatch(new appStore.SetLinkedPlayer(player));
            this.displayLabel = `${player.firstName} ${player.lastName}`;
            playerFound = true;
            break;
          }
        }
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
