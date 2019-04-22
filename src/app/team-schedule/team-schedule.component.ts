import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as appStore from '../store';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'al-team-schedule',
  templateUrl: './team-schedule.component.html',
  styleUrls: ['./team-schedule.component.scss']
})
export class TeamScheduleComponent implements OnInit {

  teamSchedule: any[];
  appData$: Observable<appStore.AppState>;
  scoreMap: Map<string, any>;
  playerMap: Map<string, any>;
  matchMap: Map<string, any>;
  constructor(private store$: Store<any>, private router: Router) {
    this.appData$ = store$.select(r => r.app);
  }

  ngOnInit() {
    this.appData$.pipe(filter(r => r.teamsSchedule != undefined && r.playerMap.size > 0 && r.matchMap.size > 0)).subscribe(r => {
      if (r.scoreMap == undefined) {
        this.scoreMap = new Map<string, any>();
      } else {
        this.scoreMap = r.scoreMap;
      }
      this.playerMap = r.playerMap;
      this.matchMap = r.matchMap;
      this.setSchedule(r.teamsSchedule);
    })

  }

  private setSchedule(teamSchedule) {
    let sched = [];
    for (let key of Object.keys(teamSchedule)) {
      let matchId = teamSchedule[key].matchId;
      let schedData = { ...teamSchedule[key], week: +key + 1 };
      schedData.opponent1 = this.playerMap.get(schedData.team.players[0]);
      schedData.opponent2 = this.playerMap.get(schedData.team.players[1]);
      schedData.home = this.matchMap.get(matchId).home != schedData.team.id;
      let scoreData = this.scoreMap.get(matchId);
      if (scoreData != undefined) {
        schedData.score = scoreData.score;
        if (teamSchedule[key].team.id == scoreData.winner) {
          schedData.loser = true;
        } else {
          schedData.winner = true;
        }
      }
      sched.push(schedData);
    }
    this.teamSchedule = sched;
    console.log(this.teamSchedule);
  }

  postScore(team) {
    this.store$.dispatch(new appStore.SetupScoreEntryData(team));
    this.router.navigate(['/scoreentry']);
  }

}
