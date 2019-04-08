import { Component, OnInit } from '@angular/core';
import * as appStore from '../store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-season',
  templateUrl: './season.component.html',
  styleUrls: ['./season.component.scss']
})
export class SeasonComponent implements OnInit {

  matchNumber: number;
  divisionList: any[] = [];
  selectedDivisionId: string;

  appData$: Observable<appStore.AppState>;

  constructor(private store$: Store<any>) {
    this.appData$ = store$.select(r => r.app);
  }

  ngOnInit() {
    this.appData$.pipe(filter(r => r.divisionDoc != undefined && r.teamDoc != undefined))
      .subscribe(r => {
        this.divisionList = r.divisionDoc.divisions;
      })
  }

  divisionSelected(event) {
    this.selectedDivisionId = event.value;
  }

  createSchedule() {
    if (this.matchNumber == undefined || this.matchNumber < 1) {
      this.store$.dispatch(new appStore.ShowSnackbarError({ msg: 'Must Enter Number of Matches' }));
      return;
    }

    if (this.selectedDivisionId == undefined || this.selectedDivisionId.length == 0) {
      this.store$.dispatch(new appStore.ShowSnackbarError({ msg: 'Must Select a Division' }));
      return;
    }
    let payload = {
      matchNumber: this.matchNumber,
      division: this.selectedDivisionId
    }
    console.log('pl', payload);
  }

}
