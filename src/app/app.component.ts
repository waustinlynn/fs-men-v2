import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as appStore from './store';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'FS MEN';
  storeData$: Observable<appStore.AppState>;

  constructor(private store: Store<any>) {
    this.storeData$ = store.select(r => r.app);
  }

  ngOnInit() {
  }


  onSignIn(event: any) {
    this.store.dispatch(new appStore.SetLoginData(event));
  }
}
