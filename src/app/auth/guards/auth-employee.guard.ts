import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";

import { AuthService } from "../auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthEmployeeGuard implements CanActivate {
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

    if (!employeeIsAuth) {
      this.router.navigate(["/"]);
      return false;
    } else if (employeeIsAuth) {
      return true;
    }
  }
}
