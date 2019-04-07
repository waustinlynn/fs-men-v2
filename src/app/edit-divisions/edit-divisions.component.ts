import { Component, OnInit } from '@angular/core';
import { Store, ActionsSubject } from '@ngrx/store';
import * as appStore from '../store';
import { Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import * as helpers from '../store/helpers';
import * as payloads from '../store/payloads';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'al-edit-divisions',
  templateUrl: './edit-divisions.component.html',
  styleUrls: ['./edit-divisions.component.scss']
})
export class EditDivisionsComponent implements OnInit {

  appData$: Observable<appStore.AppState>;
  displayTeams: any[];
  divisionName: string;
  displayDivisions: any[];
  divisionDoc: any;
  constructor(private store$: Store<any>, private as$: ActionsSubject) {
    this.appData$ = store$.select(r => r.app);
  }

  ngOnInit() {
    this.appData$.pipe(filter(this.subscribeFilter))
      .subscribe(r => {
        this.divisionDoc = r.divisionDoc;
        this.displayTeams = helpers.teamsToDisplayTeams(r.teamDoc.teams, r.playerMap);
        this.displayDivisions = helpers.divisionsToDisplayDivisions(r.divisionDoc.divisions, this.displayTeams);
        this.displayTeams = this.displayTeams.filter(team => !this.displayDivisions.some(r => r.teams.some(r => r.id == team.id)));
      })
  }

  private subscribeFilter(appData: appStore.AppState) {
    return appData.teamDoc != undefined && appData.playerMap.size > 0 && appData.divisionDoc != undefined;
  }

  createDivision() {
    let teamIds = this.displayTeams.filter(x => x.add).map(r => r.id);
    this.divisionDoc.divisions.push(
      {
        id: Guid.create().toString(),
        divisionName: this.divisionName,
        teams: teamIds
      }
    )

    this.updateAndReload();
  }

  deleteDivision(division) {
    let divisions = [...this.divisionDoc.divisions];
    let divIdx = divisions.findIndex(x => x.id == division.id);
    if (divIdx > -1) {
      this.divisionDoc.divisions.splice(divIdx, 1);
    }
    this.updateAndReload();
  }

  private updateAndReload() {
    this.as$.pipe(filter(r => r.type == appStore.ActionTypes.UpdateSuccess), first())
      .subscribe(r => {
        this.divisionName = undefined;
        this.store$.dispatch(new appStore.GetDivisions({}))
      });
    this.store$.dispatch(new appStore.SaveDoc(this.divisionDoc));
  }

}
