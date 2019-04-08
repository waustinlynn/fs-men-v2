import { Component, OnInit } from '@angular/core';
import { Store, ActionsSubject } from '@ngrx/store';
import * as appStore from '../store';
import { Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.scss']
})
export class EditPlayerComponent implements OnInit {

  player: any = {};
  appData$: Observable<appStore.AppState>;
  displayPlayers: any[] = [];
  constructor(private store$: Store<any>, private as$: ActionsSubject) {
    this.appData$ = store$.select(r => r.app);
  }

  ngOnInit() {
    this.appData$.pipe(filter(r => r.players != undefined)).subscribe(r => {
      this.displayPlayers = r.players.sort((a: any, b: any) => a.lastName > b.lastName ? 1 : -1);
    })
  }

  save() {
    this.store$.dispatch(new appStore.SaveDoc({ ...this.player, docType: 'player' }));
    this.as$.pipe(filter(r => r.type == appStore.ActionTypes.UpdateSuccess), first()).subscribe(r => this.store$.dispatch(new appStore.GetPlayers({})));
    this.player = {};
  }

}
