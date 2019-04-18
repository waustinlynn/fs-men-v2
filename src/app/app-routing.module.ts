import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditPlayerComponent } from './edit-player/edit-player.component';
import { ListPlayersComponent } from './list-players/list-players.component';
import { EditDivisionsComponent } from './edit-divisions/edit-divisions.component';
import { SeasonComponent } from './season/season.component';
import { ViewSchedulesComponent } from './view-schedules/view-schedules.component';
import { TeamScheduleComponent } from './team-schedule/team-schedule.component';
import { EnterScoreComponent } from './enter-score/enter-score.component';

import { AdminGuard } from './admin.guard';
import { UserGuard } from './user.guard';

const routes: Routes = [
  { path: 'teamschedule', component: TeamScheduleComponent, canActivate: [UserGuard] },
  { path: 'scoreentry', component: EnterScoreComponent, canActivate: [UserGuard] },
  { path: 'player', component: EditPlayerComponent, canActivate: [AdminGuard] },
  { path: 'players', component: ListPlayersComponent, canActivate: [AdminGuard] },
  { path: 'divisions', component: EditDivisionsComponent, canActivate: [AdminGuard] },
  { path: 'season', component: SeasonComponent, canActivate: [AdminGuard] },
  { path: 'standings', component: ViewSchedulesComponent, canActivate: [AdminGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
