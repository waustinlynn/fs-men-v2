import { Component, OnInit } from '@angular/core';
import { Store, ActionsSubject } from '@ngrx/store';
import * as appStore from './store';
import { Observable, combineLatest } from 'rxjs';
import { first, filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'FS MEN';
  storeData$: Observable<appStore.AppState>;

  constructor(private store: Store<any>, private as$: ActionsSubject) {
    this.storeData$ = store.select(r => r.app);
  }

  ngOnInit() {

    //initialize get users
    this.store.dispatch(new appStore.GetUsers());
    combineLatest(
      this.storeData$.pipe(filter(r => r.users != undefined && r.users.length > 0), first()),
      this.as$.pipe(filter(r => r.type == appStore.ActionTypes.SetLoginData), first())
    ).subscribe(([st, act]) => {
      st = st as any;
      let actionData = { ...act } as any;
      let user = st.users.find(r => r.email == actionData.payload.email);
      if (user != undefined) {
        this.store.dispatch(new appStore.SetUser(user));
      } else {
        delete actionData.payload.id;
        this.store.dispatch(new appStore.SaveUser(actionData.payload));
      }
    })

  }


  onSignIn(event: any) {
    this.store.dispatch(new appStore.SetLoginData(event));
  }
}
