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
  }

  createTeam() {

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
