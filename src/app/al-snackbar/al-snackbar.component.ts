import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActionsSubject } from '@ngrx/store';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'al-snackbar',
  templateUrl: './al-snackbar.component.html',
  styleUrls: ['./al-snackbar.component.scss']
})
export class AlSnackbarComponent implements OnInit {
  //accept an array of actions to list for and display msg payload
  @Input() actions: any;

  constructor(private snackBar: MatSnackBar, private as$: ActionsSubject) { }

  ngOnInit() {
    this.as$.pipe(filter(r => this.actions.some(el => el == r.type))).subscribe((r: any) => {
      this.snackBar.open(r.payload.msg == undefined || r.payload.msg == null ? 'Update Successful' : r.payload.msg, 'Got it', { duration: 3000 });
    })
  }
}
