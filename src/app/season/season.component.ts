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
  teamDoc: any;
  divisionDoc: any;
  viewSeasonData: any;
  scheduleName: string;


  appData$: Observable<appStore.AppState>;

  constructor(private store$: Store<any>) {
    this.appData$ = store$.select(r => r.app);
  }

  ngOnInit() {
    this.appData$.pipe(filter(r => r.divisionDoc != undefined && r.teamDoc != undefined))
      .subscribe(r => {
        this.teamDoc = r.teamDoc;
        this.divisionDoc = r.divisionDoc;
        this.divisionList = r.divisionDoc.divisions;
        this.viewSeasonData = r.viewSeasonData;
      });

    this.store$.dispatch(new appStore.GetSchedules({}));
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
    this.create();
    // console.log('pl', payload);
  }

  private create() {
    //first create a map of the team ids and teams they can play
    let teamIds = this.divisionDoc.divisions.filter(x => x.id == this.selectedDivisionId)[0].teams;
    teamIds = teamIds
      .map(r => {
        return { id: r, order: Math.random() };
      })
      .sort((a: any, b: any) => a.order > b.order ? 1 : -1)
      .map(r => r.id);
    let teamAvailOpponentMap = new Map<string, string[]>();
    [...teamIds].forEach(teamId => {
      teamAvailOpponentMap.set(teamId, []);
      [...teamIds].forEach(subTeamId => {
        if (teamId == subTeamId) return;
        teamAvailOpponentMap.get(teamId).push(subTeamId);
      });
    });
    let scheduleObj = {};
    console.log(teamAvailOpponentMap);
    //loop through each week and create the schedule
    for (let i = 0; i < this.matchNumber; i++) {
      scheduleObj[i] = {};
      let subTeamIds = [...teamIds];
      while (subTeamIds.length > 1) {
        let startingLength = subTeamIds.length;
        let returnData = this.createMatches(scheduleObj[i], subTeamIds, teamAvailOpponentMap);
        teamAvailOpponentMap = returnData.teamAvailOpponentMap;
        subTeamIds = returnData.teamIds;
        if (startingLength == subTeamIds.length) {
          console.error('could not make matches');
          break;
        }
      }
    }

    console.log(scheduleObj);
    this.store$.dispatch(new appStore.SetViewSeasonData(scheduleObj));
  }

  private createMatches(scheduleObj, teamIds, dataMap) {
    let idsTemp = [...teamIds];
    let team = idsTemp[0];
    let locCounter = 1;
    while (true) {
      let teamsMap = dataMap.get(team);
      let opponentsId = idsTemp[locCounter];
      let opponentsMap = dataMap.get(opponentsId);
      let opponentsMapIndex = teamsMap.findIndex(x => x == opponentsId);
      let teamsMapIndex = opponentsMap.findIndex(x => x == team);
      // console.log('setup data', {
      //   teamsMap,
      //   opponentsId,
      //   opponentsMapIndex,
      //   teamsMapIndex,
      //   team
      // })
      if (opponentsMapIndex > -1 && teamsMapIndex > -1) {
        let teamCombo = `${team}|${opponentsId}`;
        scheduleObj[teamCombo] = {};
        idsTemp.splice(locCounter, 1);
        idsTemp.splice(0, 1);
        teamsMap.slice(opponentsMapIndex, 1);
        opponentsMap.splice(opponentsMap.findIndex(x => x == team), 1);
        dataMap.set(team, teamsMap);
        dataMap.set(opponentsId, opponentsMap);
        // console.log('splicedData', {
        //   teamIds,
        //   teamsMap
        // })
        break;
      } else {
        locCounter++;
        if (locCounter == idsTemp.length) {
          break;
        }
      }
    }
    return { teamIds: idsTemp, teamAvailOpponentMap: dataMap };
  }

  setSchedule() {
    if (this.scheduleName == undefined || this.scheduleName.length == 0) {
      this.store$.dispatch(new appStore.ShowSnackbarError({ msg: 'Must Enter Schedule Name' }));
      return;
    }
    let payload = {
      division: this.selectedDivisionId,
      schedule: this.viewSeasonData,
      docType: 'schedule',
      scheduleName: this.scheduleName
    }
    this.store$.dispatch(new appStore.SaveDoc(payload));
  }

}
