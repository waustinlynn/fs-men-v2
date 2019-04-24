import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import * as appStore from '../store';

@Component({
  selector: 'al-nologin',
  templateUrl: './nologin.component.html',
  styleUrls: ['./nologin.component.scss']
})
export class NologinComponent implements OnInit {

  constructor(private router: Router, private store$: Store<any>) {
    store$.select(r => r.app).pipe(filter(r => r.loggedIn)).subscribe(r => this.router.navigate(['/standings']));
  }

  ngOnInit() {
  }

  showStandings() {
    this.router.navigate(['/standings']);
  }

  onSignIn(event: any) {
    this.store$.dispatch(new appStore.SetLoginData(event));
  }

}
