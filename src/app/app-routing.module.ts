import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditPlayerComponent } from './edit-player/edit-player.component';

const routes: Routes = [
  { path: 'player', component: EditPlayerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
