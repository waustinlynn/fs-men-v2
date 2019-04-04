import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as appStore from '../store';

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.scss']
})
export class EditPlayerComponent implements OnInit {

  player: any = {};
  constructor(private store$: Store<any>) { }

  ngOnInit() {
  }

  save() {
    console.log(this.player);
    this.store$.dispatch(new appStore.SaveDoc({ ...this.player, docType: 'player' }));
  }

}
