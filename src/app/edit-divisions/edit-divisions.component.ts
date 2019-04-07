import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as appStore from '../store';
import { Observable } from 'rxjs';

@Component({
  selector: 'al-edit-divisions',
  templateUrl: './edit-divisions.component.html',
  styleUrls: ['./edit-divisions.component.scss']
})
export class EditDivisionsComponent implements OnInit {

  appData$: Observable<appStore.AppState>;
  constructor(private store$: Store<any>) {
    this.appData$ = store$.select(r => r.app);
  }

  ngOnInit() {

  }

}
