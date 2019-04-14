import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditPlayerComponent } from './edit-player/edit-player.component';
import { ListPlayersComponent } from './list-players/list-players.component';
import { EditDivisionsComponent } from './edit-divisions/edit-divisions.component';
import { SeasonComponent } from './season/season.component';
import { ViewSchedulesComponent } from './view-schedules/view-schedules.component';

const routes: Routes = [
  { path: 'player', component: EditPlayerComponent },
  { path: 'players', component: ListPlayersComponent },
  { path: 'divisions', component: EditDivisionsComponent },
  { path: 'season', component: SeasonComponent },
  { path: 'standings', component: ViewSchedulesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
