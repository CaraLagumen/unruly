import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";

import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const employeeIsAuth = this.authService.getEmployeeIsAuth();
    const schedulerIsAuth = this.authService.getSchedulerIsAuth();

    if (!employeeIsAuth || !schedulerIsAuth) {
      this.router.navigate(["/"]);
    } else if (employeeIsAuth || schedulerIsAuth) {
      return;
    }
  }
}
