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
    let applicableTeams = this.findTeamsInSchedule(viewSeasonData);
    let thisTeamMap = new Map<string, any>();
    for (let i = 0; i < applicableTeams.length; i++) {
      let team = teamMap.get(applicableTeams[i]);
      thisTeamMap.set(applicableTeams[i], team);
    }
    console.log(applicableTeams);
    console.log(thisTeamMap);
    this.columns = ["name"].concat(Object.keys(viewSeasonData).map(r => `Week ${+r + 1}`));
    let weekObjs = Object.values(viewSeasonData);
    for (let i = 0; i < weekObjs.length; i++) {
      //object with one object for each match scheduled, each key will be a match guid, value will have team1 and team2 properties
      let weekObj = weekObjs[i];
      let matchKeys = Object.keys(weekObj);
      matchKeys.forEach(key => {
        let team1 = weekObj[key].team1;
        let team2 = weekObj[key].team2;
        team1 = thisTeamMap.get(team1);
        team2 = thisTeamMap.get(team2);
        team1['Week ' + (i + 1)] = team2.name;
        team2['Week ' + (i + 1)] = team1.name;
      });
    }
    this.scheduleData = Array.from(thisTeamMap.values());
    console.log(this.scheduleData);
  }

  private findTeamsInSchedule(scheduleData) {
    let teams = {};
    for (let weekNum of Object.keys(scheduleData)) {
      console.log(weekNum);
      for (let match of Object.keys(scheduleData[weekNum])) {
        console.log(match);
        console.log(scheduleData[weekNum][match]);
        teams[scheduleData[weekNum][match].team1] = undefined;
        teams[scheduleData[weekNum][match].team2] = undefined;
      }
    }
    return Object.keys(teams);
  }

}
