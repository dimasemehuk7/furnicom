import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, NavigationEnd, Params, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, ReplaySubject} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class NavigationService {

  public params: any;
  public params$: ReplaySubject<Params>;

  constructor(private router: Router) {
    // TODO use routerState facade
    this.params$ = new ReplaySubject<Params>(1);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const routerState: RouterStateSnapshot = this.router.routerState.snapshot;
        let state: ActivatedRouteSnapshot = routerState.root;
        while (state.firstChild) {
          state = state.firstChild;
        }
        this.params = state.params;
        this.params$.next(state.params);
      }
    });
  }

  getUrlParam(paramKey: string): string {
    return this.params[paramKey];
  }

  getUrlParam$(paramKey: string): Observable<string> {
    return this.params$.asObservable().pipe(map(params => params[paramKey]));
  }

  goToHome(): void {
    this.router.navigate(['home']);
  }
}
