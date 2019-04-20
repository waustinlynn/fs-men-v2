import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as appStore from '../store';
import { filter, first } from 'rxjs/operators';
@Component({
  selector: 'app-view-schedules',
  templateUrl: './view-schedules.component.html',
  styleUrls: ['./view-schedules.component.scss']
})
export class ViewSchedulesComponent implements OnInit {

  appData$: Observable<appStore.AppState>;
  schedules: any[];
  scheduleOptions: any[];
  selectedSchedule: string;
  constructor(private store$: Store<any>) {
    this.appData$ = store$.select(r => r.app);
  }

  ngOnInit() {
    this.appData$.pipe(filter(r => r.schedules != undefined && r.schedules.length > 0), first())
      .subscribe(r => {
        this.schedules = r.schedules;
        this.selectedSchedule = this.schedules[0].id;
        this.scheduleSelected({ value: this.selectedSchedule });
      });
    this.store$.dispatch(new appStore.GetSchedules({}));
  }

  scheduleSelected(event) {
    let viewData = this.schedules.filter(x => x.id == event.value)[0].schedule;
    this.store$.dispatch(new appStore.SetViewSeasonData(viewData));
  }

}
