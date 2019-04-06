import { Component, OnInit } from '@angular/core';
import { Store, ActionsSubject } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import * as appStore from '../store';
import { GetDoc } from '../store';
import * as payloads from '../store/payloads';

@Component({
  selector: 'al-list-teams',
  templateUrl: './list-teams.component.html',
  styleUrls: ['./list-teams.component.scss']
})
export class ListTeamsComponent implements OnInit {
  appState$: Observable<appStore.AppState>;
  displayTeams: any[] = [];
  teamsDoc: any;

  constructor(private store$: Store<any>, private as$: ActionsSubject) {
    this.appState$ = store$.select(r => r.app);
  }

  ngOnInit() {
    this.appState$.pipe(filter(r => r.teamDoc != undefined && r.playerMap.size > 0))
      .subscribe(r => {
        this.teamsDoc = r.teamDoc;
        let dispTeams = [];
        r.teamDoc.teams.forEach(team => {
          let player1 = r.playerMap.get(team.players[0]);
          let player2 = r.playerMap.get(team.players[1]);
          dispTeams.push(
            {
              id: team.id,
              teamName: team.name,
              names: `${player1.firstName} ${player1.lastName} | ${player2.firstName} ${player2.lastName}`
            }
          );
        });
        this.displayTeams = dispTeams;
      })
  }

  delete(teamId) {
    let teams = [...this.teamsDoc.teams];
    let teamIdx = teams.findIndex(x => x.id == teamId);
    if (teamIdx > -1) {
      this.teamsDoc.teams.splice(teamIdx, 1);
    }
    this.deleteAndReload();
  }

  private deleteAndReload() {
    this.as$.pipe(filter(r => r.type == appStore.ActionTypes.UpdateSuccess), first())
      .subscribe(r => this.store$.dispatch(new GetDoc(payloads.getTeamsPayload)));
    this.store$.dispatch(new appStore.SaveDoc(this.teamsDoc));
  }

}
