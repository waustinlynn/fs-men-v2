import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { Store, ActionsSubject } from '@ngrx/store';
import * as appStore from './store';
import { filter, first, withLatestFrom } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private store$: Store<any>, private as$: ActionsSubject) {

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return Observable.create((obs: Observer<boolean>) => {
      this.as$.pipe(
        filter(r => r.type == appStore.ActionTypes.SetAdmin),
        withLatestFrom(this.store$.select(r => r.app)),
        first()).subscribe(([actions, store]) => {
          obs.next(store.admin);
          obs.complete();
        })
    })
  }
}
