import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as appStore from '../store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { getBlankStats } from '../store/app.reducer';

@Component({
  selector: 'al-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  appData$: Observable<appStore.AppState>;
  scheduleData: any;
  columns: any[];
  matchMap: Map<string, any>;
  constructor(private store$: Store<any>) {
    this.appData$ = store$.select(r => r.app);
  }

  ngOnInit() {
    this.store$.dispatch(new appStore.SetTeamStats({}));
    this.appData$.pipe(filter(r => r.viewSeasonData != undefined && r.teamMap.size > 0 && r.teamsToMatchIdMap.size > 0 && r.matchMap.size > 0))
      .subscribe(r => {
        this.matchMap = r.matchMap;
        this.refresh(r.viewSeasonData, r.teamMap, r.scoreMap, r.teamsToMatchIdMap, r.teamStats);
      });
  }

  private isHome(homeTeam, matchId) {
    let match = this.matchMap.get(matchId);
    if (match.home != undefined) {
      if (match.home == homeTeam) return true;
    }
    return false;
  }

  private refresh(viewSeasonData: any, teamMap: Map<string, any>, scoreMap: Map<string, any>, teamsToMatchMap: Map<string, string>, teamStats: any) {
    let applicableTeams = this.findTeamsInSchedule(viewSeasonData);
    let thisTeamMap = new Map<string, any>();
    for (let i = 0; i < applicableTeams.length; i++) {
      let team = teamMap.get(applicableTeams[i]);
      thisTeamMap.set(applicableTeams[i], team);
    }
    this.columns = this.setColumns(viewSeasonData);
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

        team1['Week ' + (i + 1)] = {
          opponentName: team2.name,
          opponentId: team2.id,
          team: team1,
          home: this.isHome(team1.id, key)
        };
        team2['Week ' + (i + 1)] = {
          opponentName: team1.name,
          opponentId: team1.id,
          team: team2,
          home: this.isHome(team2.id, key)
        };

        //lookup score data
        let matchLookupKey = `${team1.id}|${team2.id}`;
        let matchId = teamsToMatchMap.get(matchLookupKey);
        let score = scoreMap.get(matchId);
        if (score != undefined) {
          team1['Week ' + (i + 1)].score = score;
          team2['Week ' + (i + 1)].score = score;
        }
      });
    }
    let theseStats = teamStats;
    this.scheduleData = Array.from(thisTeamMap.values()).map(el => {
      let stats = theseStats[el.id];
      if (stats == undefined) stats = getBlankStats();
      return { ...el, Name: { name: el.name }, stats }
    }).sort(this.sort);
  }

  private sort(a: any, b: any) {
    if (a.stats.points == b.stats.points) {
      return a.stats.pct > b.stats.pct ? -1 : 1;
    }
    return a.stats.points > b.stats.points ? -1 : 1;
  }

  private setColumns(viewSeasonData) {
    //unfortunately, this doesn't work
    // return [
    //   {
    //     header: 'Name',
    //     field: 'name'
    //   }
    // ].concat(Object.keys(viewSeasonData).map(r => {
    //   return {
    //     header: `Week ${+r + 1}`,
    //     field: `Week ${+r + 1}`
    //   }
    // }));

    return ["Name", "Record", "Points", "Win%"].concat(Object.keys(viewSeasonData).map(r => `Week ${+r + 1}`));
  }

  private findTeamsInSchedule(scheduleData) {
    let teams = {};
    for (let weekNum of Object.keys(scheduleData)) {
      for (let match of Object.keys(scheduleData[weekNum])) {
        teams[scheduleData[weekNum][match].team1] = undefined;
        teams[scheduleData[weekNum][match].team2] = undefined;
      }
    }
    return Object.keys(teams);
  }

}
