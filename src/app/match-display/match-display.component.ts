import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as helpers from '../store/helpers';
@Component({
  selector: 'al-match-display',
  templateUrl: './match-display.component.html',
  styleUrls: ['./match-display.component.scss']
})
export class MatchDisplayComponent implements OnInit, OnChanges {


  displayLabel: string;
  className: string;
  styleName: string;
  homeMatch: boolean = false;
  @Input() data: any;
  @Input() column: any;
  constructor() { }

  ngOnInit() {
    this.resetLabel();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.resetLabel();
  }

  private resetLabel() {
    switch (this.column) {
      case 'Name':
        this.displayLabel = this.data.Name.name;
        return;
      case 'Record':
        this.displayLabel = `${this.data.stats.wins}-${this.data.stats.losses}`;
        return;
      case 'Points':
        this.displayLabel = this.data.stats.points;
        return;
      case 'Win%':
        this.displayLabel = `${Math.round(this.data.stats.pct * 100).toString()}%`;
        return;
      default: break;
    }
    let itemData = { ...this.data[this.column] };
    if (itemData.home != undefined) {
      this.homeMatch = itemData.home;
    }
    let score = itemData.score;
    if (score != undefined) {
      let displayScore = score.score;
      if (itemData.opponentId == score.winner) {
        this.className = 'orange';
        if (itemData.opponentId == score.usersTeamId) {
          displayScore = helpers.reverseScore(displayScore);
        }
      } else {
        if (score.winner != score.usersTeamId) {
          displayScore = helpers.reverseScore(displayScore);
        }
        this.className = 'olive';
      }
      this.displayLabel = `${itemData.opponentName} (${displayScore})`;

    } else {
      this.displayLabel = itemData.opponentName;
    }
  }
}
