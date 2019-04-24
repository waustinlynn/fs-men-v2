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
  linkedTeamId: string;
  constructor(private store$: Store<any>) {
    this.appData$ = store$.select(r => r.app);
  }

  ngOnInit() {
    this.appData$.pipe(filter(r => r.schedules != undefined && r.schedules.length > 0), first())
      .subscribe(r => {
        this.schedules = r.schedules;
        this.selectedSchedule = this.schedules[0].id;
        this.checkSetTeamsSchedule();
        this.scheduleSelected({ value: this.selectedSchedule });
      });
    this.store$.dispatch(new appStore.GetSchedules({}));
    this.appData$.pipe(filter(r => r.linkedTeam != undefined), first())
      .subscribe(r => {
        this.linkedTeamId = r.linkedTeam.id;
        this.checkSetTeamsSchedule();
      })
  }

  private checkSetTeamsSchedule() {
    if (this.linkedTeamId == undefined || this.selectedSchedule == undefined) return;

    for (let i = 0; i < this.schedules.length; i++) {
      let foundSched = false;
      let week1MatchIds = Object.keys(this.schedules[i].schedule['0']);
      for (let j = 0; j < week1MatchIds.length; j++) {
        if (this.schedules[i].schedule['0'][week1MatchIds[j]].team1 == this.linkedTeamId) {
          this.scheduleSelected({ value: this.schedules[i].id });
          this.selectedSchedule = this.schedules[i].id;
          foundSched = true;
          break;
        }
      }
      if (foundSched) break;
    }
  }

  scheduleSelected(event) {
    let viewData = this.schedules.filter(x => x.id == event.value)[0].schedule;
    this.store$.dispatch(new appStore.SetViewSeasonData(viewData));
  }

}
