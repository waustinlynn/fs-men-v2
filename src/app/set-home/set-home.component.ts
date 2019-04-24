import { Component, OnInit } from '@angular/core';
import { Store, ActionsSubject } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as appStore from '../store';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'al-set-home',
  templateUrl: './set-home.component.html',
  styleUrls: ['./set-home.component.scss']
})
export class SetHomeComponent implements OnInit {

  storeData$: Observable<appStore.AppState>;
  selectedSchedule: any;
  schedules: any[];
  scheduleOptions: any[];
  teamMap: Map<string, any>;
  constructor(private store$: Store<any>, private as$: ActionsSubject) {
    this.storeData$ = store$.select(r => r.app);
  }

  ngOnInit() {
    this.storeData$.pipe(filter(r => r.schedules != undefined && r.schedules.length > 0 && r.teamMap.size > 0))
      .subscribe(r => {
        this.schedules = r.schedules;
        this.teamMap = r.teamMap;
        this.setOptions();
      })
  }

  scheduleSelected(matSelect) {
    this.selectedSchedule = this.schedules.find(x => x.id == matSelect.value);
    this.setOptions();
  }

  private setOptions() {
    if (this.selectedSchedule == undefined) return;
    let schedOptions = [];
    Object.keys(this.selectedSchedule.schedule)
      .forEach(weekNum => {
        let obj = { week: 'Week ' + (+weekNum + 1) } as any;
        obj.weekNum = weekNum;
        obj.matches = [];
        Object.keys(this.selectedSchedule.schedule[weekNum]).forEach(matchId => {
          obj.matches.push({ ...this.selectedSchedule.schedule[weekNum][matchId], id: matchId });
        });
        schedOptions.push(obj);
      });
    this.scheduleOptions = schedOptions;
  }

  teamLookup(teamId) {
    return this.teamMap.get(teamId).name;
  }

  setHome(weekNum, matchId, homeTeam) {
    this.selectedSchedule.schedule[weekNum][matchId].home = homeTeam;
    this.store$.dispatch(new appStore.SaveDoc(this.selectedSchedule));
    this.as$.pipe(filter(r => r.type == appStore.ActionTypes.UpdateSuccess)).subscribe(r => this.store$.dispatch(new appStore.GetSchedules({})));
    // this.setOptions();
  }

}
