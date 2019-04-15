import { Component, OnInit } from '@angular/core';
import { Store, ActionsSubject } from '@ngrx/store';
import * as appStore from '../store';
import { Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.scss']
})
export class EditPlayerComponent implements OnInit {

  player: any = {};
  appData$: Observable<appStore.AppState>;
  displayPlayers: any[] = [];
  linkedAccount: string;
  linkedAccounts: string[] = [];
  constructor(private store$: Store<any>, private as$: ActionsSubject, private router: Router) {
    this.appData$ = store$.select(r => r.app);
  }

  ngOnInit() {
    this.appData$.pipe(filter(r => r.players != undefined)).subscribe(r => {
      this.player = r.editingPlayer == undefined ? {} : r.editingPlayer;
      this.setLinkedAccounts();
      this.displayPlayers = r.players.sort((a: any, b: any) => a.lastName > b.lastName ? 1 : -1);
    })
  }

  save() {
    this.player.accounts = this.linkedAccounts;
    this.store$.dispatch(new appStore.SaveDoc({ ...this.player, docType: 'player' }));
    this.as$.pipe(filter(r => r.type == appStore.ActionTypes.UpdateSuccess), first())
      .subscribe(r => {
        this.reset();
        this.store$.dispatch(new appStore.SetEditingPlayer(undefined));
        this.store$.dispatch(new appStore.GetPlayers({}))
      });
  }

  private setLinkedAccounts() {
    this.reset();
    if (this.player == undefined || this.player.accounts == undefined) return;
    this.linkedAccounts = [...this.player.accounts];
  }

  private reset() {
    this.linkedAccount = undefined;
    this.linkedAccounts = [];
  }

  addLinkedAccount() {
    this.linkedAccounts.push(this.linkedAccount);
    this.linkedAccount = undefined;
  }

  editPlayer(player) {
    this.store$.dispatch(new appStore.SetEditingPlayer(player));
    this.router.navigate(['/player']);
  }

}
