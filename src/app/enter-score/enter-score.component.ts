import { Component, OnInit } from '@angular/core';
import { Store, ActionsSubject } from '@ngrx/store';
import * as appStore from '../store';
import { Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'al-enter-score',
  templateUrl: './enter-score.component.html',
  styleUrls: ['./enter-score.component.scss']
})
export class EnterScoreComponent implements OnInit {

  appData$: Observable<appStore.AppState>;
  opponent: any;
  usersTeam: any;
  matchId: string;
  renderEntry: boolean = false;
  score: any = {};
  errorMessage: string = '';
  constructor(private store$: Store<any>, private router: Router, private as$: ActionsSubject) {
    this.appData$ = store$.select(r => r.app);
  }

  ngOnInit() {
    this.appData$.pipe(first()).subscribe(r => {
      if (r.scoreEntryData == undefined) {
        this.router.navigate(['/']);
      } else {
        this.renderEntry = true;
      }
    })
    this.appData$.pipe(filter(r => r.scoreEntryData != undefined && r.linkedTeam != undefined)).subscribe(r => {
      this.opponent = r.scoreEntryData.team;
      this.usersTeam = r.linkedTeam;
      this.matchId = r.scoreEntryData.matchId;
    });
  }

  validate() {
    this.errorMessage = '';
    if (this.score.set1 == undefined || !this.validateScore(this.score.set1)) {
      this.errorMessage = 'Set 1 score not entered correctly';
      return;
    }

    if (this.score.set2 == undefined || !this.validateScore(this.score.set2)) {
      this.errorMessage = 'Set 2 score not entered correctly';
      return;
    }

    if (this.score.set3 != undefined && !this.validateScore(this.score.set3)) {
      this.errorMessage = 'Set 3 score not entered correctly';
      return;
    }
    this.errorMessage = '';

  }

  private validateScore(score) {
    if (score == undefined) return false;
    if (score == '') return false;
    let trimmedEntry = score.trim();
    let scoreSplit = trimmedEntry.split('-');
    if (scoreSplit.length != 2) return false;
    if (isNaN(scoreSplit[0])) return false;
    if (isNaN(scoreSplit[1])) return false;
    return true;
  }

  save() {
    this.validate();
    if (this.errorMessage.length > 0) return;
    let scoreData = {
      usersGamesWon: 0,
      opponentsGamesWon: 0,
      usersSetsWon: 0,
      opponentsSetsWon: 0,
      usersTeamId: this.usersTeam.id
    } as any;
    this.parseSet(scoreData, this.score.set1);
    this.parseSet(scoreData, this.score.set2);
    if (this.score.set3 != undefined && this.score.set3.length > 0) {
      this.parseSet(scoreData, this.score.set3);
    }
    if (scoreData.usersSetsWon == scoreData.opponentsSetsWon) {
      this.errorMessage = 'Neither team has won 2 sets, please check scores';
      return;
    }
    scoreData.winner = scoreData.usersSetsWon > scoreData.opponentsSetsWon ? this.usersTeam.id : this.opponent.id;
    scoreData.games = {} as any;
    scoreData.games[this.usersTeam.id] = scoreData.usersGamesWon;
    scoreData.games[this.opponent.id] = scoreData.opponentsGamesWon;
    scoreData.score = `${this.score.set1},${this.score.set2}`;
    if (this.score.set3 != undefined && this.score.set3.length > 0) {
      scoreData.score = `${scoreData.score},${this.score.set3}`;
    }
    scoreData.docType = 'score';
    scoreData.matchId = this.matchId;
    this.store$.dispatch(new appStore.SaveDoc(scoreData));
    this.as$.pipe(filter(r => r.type == appStore.ActionTypes.UpdateSuccess), first()).subscribe(r => {
      this.store$.dispatch(new appStore.SetupScoreEntryData(undefined));
      this.store$.dispatch(new appStore.GetScores({}));
      this.router.navigate(['/teamschedule']);
    })
  }

  private parseSet(scoreData, set) {
    let setResult = this.parseScore(set);
    scoreData.usersGamesWon = scoreData.usersGamesWon + setResult.usersGamesWon;
    scoreData.opponentsGamesWon = scoreData.opponentsGamesWon + setResult.opponentsGamesWon;
    if (setResult.userWon) {
      scoreData.usersSetsWon++;
    } else {
      scoreData.opponentsSetsWon++
    }
  }

  private parseScore(score) {
    let trimmedEntry = score.trim();
    let scoreSplit = trimmedEntry.split('-');
    return {
      usersGamesWon: +scoreSplit[0],
      opponentsGamesWon: +scoreSplit[1],
      userWon: +scoreSplit[0] > +scoreSplit[1]
    }
  }

}
