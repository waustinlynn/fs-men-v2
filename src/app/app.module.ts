import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { LoginModule } from './login/login.module';
import { AppComponent } from './app.component';

import { DocService } from './doc.service';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { appReducer } from './store/app.reducer';
import { AppEffects } from './store/app.effects';

import { MaterialModule } from './material.module';
import { EditPlayerComponent } from './edit-player/edit-player.component';



@NgModule({
  declarations: [
    AppComponent,
    EditPlayerComponent
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
    FormsModule
  ],
  providers: [DocService],
  bootstrap: [AppComponent]
})
export class AppModule { }
