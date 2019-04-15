import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditPlayerComponent } from './edit-player/edit-player.component';
import { ListPlayersComponent } from './list-players/list-players.component';
import { EditDivisionsComponent } from './edit-divisions/edit-divisions.component';
import { SeasonComponent } from './season/season.component';
import { ViewSchedulesComponent } from './view-schedules/view-schedules.component';

import { AdminGuard } from './admin.guard';

const routes: Routes = [
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
