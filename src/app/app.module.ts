import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { LoginModule } from './login/login.module';
import { AppComponent } from './app.component';
import { AlSnackbarModule } from './al-snackbar/al-snackbar.module';

import { DocService } from './doc.service';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { appReducer } from './store/app.reducer';
import { AppEffects } from './store/app.effects';

import { MaterialModule } from './material.module';
import { EditPlayerComponent } from './edit-player/edit-player.component';
import { ListPlayersComponent } from './list-players/list-players.component';
import { ListTeamsComponent } from './list-teams/list-teams.component';
import { EditDivisionsComponent } from './edit-divisions/edit-divisions.component';
import { SeasonComponent } from './season/season.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ViewSchedulesComponent } from './view-schedules/view-schedules.component';
import { TeamScheduleComponent } from './team-schedule/team-schedule.component';
import { EnterScoreComponent } from './enter-score/enter-score.component';
import { MatchDisplayComponent } from './match-display/match-display.component';
import { SetHomeComponent } from './set-home/set-home.component';
import { RulesComponent } from './rules/rules.component';
import { NologinComponent } from './nologin/nologin.component';



@NgModule({
  declarations: [
    AppComponent,
    EditPlayerComponent,
    ListPlayersComponent,
    ListTeamsComponent,
    EditDivisionsComponent,
    SeasonComponent,
    ScheduleComponent,
    ViewSchedulesComponent,
    TeamScheduleComponent,
    EnterScoreComponent,
    MatchDisplayComponent,
    SetHomeComponent,
    RulesComponent,
    NologinComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot({ app: appReducer }),
    EffectsModule.forRoot([AppEffects]),
    MaterialModule,
    LoginModule,
    FormsModule,
    AlSnackbarModule
  ],
  providers: [DocService],
  bootstrap: [AppComponent]
})
export class AppModule { }
