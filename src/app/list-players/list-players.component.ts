import { Component, OnInit } from '@angular/core';
import * as appStore from '../store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-list-players',
  templateUrl: './list-players.component.html',
  styleUrls: ['./list-players.component.scss']
})
export class ListPlayersComponent implements OnInit {
  data$: Observable<appStore.AppState>;
  originalPlayerList: any[] = [];
  playerList: any[] = [];
  playerSelections: any[] = [];
  teamName: string;

  constructor(private store$: Store<any>) {
    this.data$ = store$.select(r => r.app);
    this.data$.pipe(filter(r => r.players != undefined)).subscribe(r => {
      this.originalPlayerList = [...r.players];
      this.playerList = [...r.players];
    });
  }

  ngOnInit() {
    this.store$.dispatch(new appStore.GetPlayers({}));
    let getTeamsPl = {
      docType: 'teams',
      returnAction: appStore.ActionTypes.GetTeamsSuccess
    } as appStore.GetDocPayload;

    this.store$.dispatch(new appStore.GetDoc(getTeamsPl));
  }

  createTeam() {
    if (this.playerSelections.length != 2) {
      this.store$.dispatch(new appStore.ShowSnackbarError({ msg: 'Must Select 2 Players per Team' }));
      return;
    }

    if (this.teamName == undefined || this.teamName.length == 0) {
      this.store$.dispatch(new appStore.ShowSnackbarError({ msg: 'Must Enter a Team Name' }));
      return;
    }
    let players = this.playerSelections.map(r => r.id);
    let doc = {
      docType: 'teams',
      teams: [
        {
          players: [...players],
          name: this.teamName
        }
      ]
    }
    // this.store$.dispatch(new appStore.SaveDoc(doc));
  }

  playerSelected(event) {
    if (this.playerSelections.some(r => r.id == event.value)) {
      return;
    }
    this.playerList.find((el, idx) => {
      if (el.id === event.value) {
        console.log('pushing');
        this.playerSelections.push(el);
        let thisIdx = idx;
        setTimeout(() => {
          console.log(this.playerSelections);
          this.playerList.splice(thisIdx, 1);
        }, 100);
        return true;
      }
      return false;
    });
    // let sliceIndex = this.playerList.findIndex(el => el.id == event.value);
    // if (sliceIndex > -1) {
    //   this.playerList.splice(sliceIndex, 1);
    // }
  }

  openedChange(event) {
    console.log(event);
  }

  clearSelections() {
    this.playerSelections = [];
    this.playerList = [...this.originalPlayerList];
    this.teamName = '';
  }
}
