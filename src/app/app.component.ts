import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as appStore from './store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'mylist';
  loggedIn: boolean = false;
  storeData$: Observable<appStore.AppState>;

  constructor(private store: Store<any>) {
    this.storeData$ = store.select(r => r.app);
  }

  ngOnInit() {
    this.storeData$.subscribe(r => this.loggedIn = r.hasLoggedIn);
  }

  login() {
    this.store.dispatch(new appStore.Login());
  }
}
