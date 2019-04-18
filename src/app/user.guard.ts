import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { Store, ActionsSubject } from '@ngrx/store';
import * as appStore from './store';
import { filter, first, withLatestFrom } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(private store$: Store<any>, private as$: ActionsSubject) {

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return Observable.create((obs: Observer<boolean>) => {
      this.store$.select(r => r.app).pipe(filter(r => r.linkedTeam != undefined)).subscribe(r => {
        obs.next(true);
        obs.complete();
      })
    })
  }
}
