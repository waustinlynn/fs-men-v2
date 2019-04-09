import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as appStore from '../store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'al-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  appData$: Observable<appStore.AppState>;
  scheduleData: any;
  columns: any[];
  constructor(private store$: Store<any>) {
    this.appData$ = store$.select(r => r.app);
  }

  ngOnInit() {
    this.appData$.pipe(filter(r => r.viewSeasonData != undefined))
      .subscribe(r => this.refresh(r.viewSeasonData, r.teamMap));
  }

  private refresh(viewSeasonData: any, teamMap: Map<string, any>) {
    let thisTeamMap = teamMap;
    this.columns = ["name"].concat(Object.keys(viewSeasonData).map(r => `Week ${+r + 1}`));
    let weekObjs = Object.values(viewSeasonData);
    for (let i = 0; i < weekObjs.length; i++) {
      //object with one object for each match scheduled, each key will have a string with the teams joined with a pipe
      let weekObj = weekObjs[i];
      let matchKeys = Object.keys(weekObj);
      matchKeys.forEach(key => {
        let teams = key.split('|');
        let team1 = thisTeamMap.get(teams[0]);
        // console.log(team1);
        let team2 = thisTeamMap.get(teams[1]);
        team1['Week ' + (i + 1)] = team2.name;
        team2['Week ' + (i + 1)] = team1.name;
      });
    }
    this.scheduleData = Array.from(thisTeamMap.values());
    console.log(this.scheduleData);
  }

}
