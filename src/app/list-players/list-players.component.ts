import { Component, OnInit, ViewChild } from '@angular/core';
import * as appStore from '../store';
import { Store, ActionsSubject } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { Guid } from 'guid-typescript';
import * as payloads from '../store/payloads';
import { MatSelect } from '@angular/material';

@Component({
  selector: 'al-list-players',
  templateUrl: './list-players.component.html',
  styleUrls: ['./list-players.component.scss']
})
export class ListPlayersComponent implements OnInit {
  @ViewChild('matselect') matselect: MatSelect;
  data$: Observable<appStore.AppState>;
  playerList: any[] = [];
  playerSelections: any[] = [];
  teamName: string;
  teamDoc: any;

  constructor(private store$: Store<any>, private as$: ActionsSubject) {
    this.data$ = store$.select(r => r.app);
  }

  ngOnInit() {
    this.data$.pipe(filter(r => r.players != undefined)).subscribe(r => {
      this.teamDoc = r.teamDoc;
      this.refreshData(r);
    });
  }

  private refreshData(appData: appStore.AppState) {
    let plyrList = [];
    appData.players.forEach(player => {
      if (!appData.playerTeamMap.has(player.id)) {
        plyrList.push(player);
      }
    });
    this.playerList = plyrList;
    this.matselect.writeValue(undefined);
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
    this.teamDoc.teams.push({
      id: Guid.create().toString(),
      players: [...players],
      name: this.teamName
    });
    this.store$.dispatch(new appStore.SaveDoc(this.teamDoc));
    this.as$.pipe(filter(r => r.type == appStore.ActionTypes.UpdateSuccess), first())
      .subscribe(r => {
        this.store$.dispatch(new appStore.GetDoc(payloads.getTeamsPayload));
        this.clearSelections();
      });
  }

  playerSelected(event) {
    if (this.playerSelections.some(r => r.id == event.value)) {
      this.matselect.writeValue(undefined);
      return;
    }
    this.playerList.find(el => {
      if (el.id === event.value) {
        this.playerSelections.push(el);
        return true;
      }
      return false;
    });
    this.matselect.writeValue(undefined);
  }

  openedChange(event) {
    console.log(event);
  }

  clearSelections() {
    this.playerSelections = [];
    this.teamName = '';
    this.matselect.writeValue(undefined);
  }
}
