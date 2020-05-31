import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import * as moment from "moment";

import { environment } from "../../environments/environment";
import { AuthData, AuthUpdateData, AuthResetData } from "./auth.model";
import { UserType } from "../shared/models/custom-types";
// import { AlertService } from "../components/alert/alert.service";

const ROOT_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private token: string;
  private userId: string;
  private userType: string;
  private tokenTimer: ReturnType<typeof setTimeout>;

  private employeeIsAuth = false;
  private employeeAuthStatusListener = new Subject<boolean>();
  private schedulerIsAuth = false;
  private schedulerAuthStatusListener = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private router: Router //, private alertService: AlertService
  ) {}

  //GETTERS----------------------------------------------------------

  getToken() {
    return this.token;
  }
  getUserId() {
    return this.userId;
  }
  getEmployeeIsAuth() {
    return this.employeeIsAuth;
  }
  getEmployeeAuthStatusListener() {
    return this.employeeAuthStatusListener.asObservable();
  }
  getSchedulerIsAuth() {
    return this.schedulerIsAuth;
  }
  getSchedulerAuthStatusListener() {
    return this.schedulerAuthStatusListener.asObservable();
  }

  //TOOLS----------------------------------------------------------

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const userType = localStorage.getItem("userType");
    const expirationDate = localStorage.getItem("expiration");

    if (!token || !userId || !userType || !expirationDate) {
      return;
    }

    return {
      token,
      userId,
      userType,
      expirationDate: new Date(expirationDate),
    };
  }

  private saveAuthData(
    token: string,
    userId: string,
    userType: UserType,
    expirationDate: Date
  ) {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("userType", userType);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");
    localStorage.removeItem("expiration");
  }

  //MAIN----------------------------------------------------------

  register(
    userType: UserType,
    authData: AuthData,
    employeeExtraData: Object | null
  ) {
    //1. GRAB EXTRA DATA IF EMPLOYEE (TEMPORARY)
    let newAuthData;
    if (userType === `employee`) {
      newAuthData = { ...authData, ...employeeExtraData };
    } else {
      newAuthData = authData;
    }

    //2. POST TO API
    this.http.post(`${ROOT_URL}/${userType}/register`, newAuthData).subscribe(
      () => {
        //3. ALERT AND LOGIN AUTOMATICALLY IF SUCCESSFUL
        // this.alertService.success("Welcome, you registered successfully.", {
        //   autoClose: true,
        //   keepAfterRouteChange: true,
        // });

        this.login(userType, authData.email, authData.password);
      },
      (err) => {
        //4. ALERT AND ENSURE LISTENERS OFF IF ERR
        // this.alertService.error("Unable to sign you up, please try again.", {
        //   autoClose: true,
        //   keepAfterRouteChange: true,
        // });

        if (userType === `employee`) {
          this.employeeAuthStatusListener.next(false);
        } else if (userType === `scheduler`) {
          this.schedulerAuthStatusListener.next(false);
        }
      }
    );
  }

  autoLogin() {
    //1. STOP IF NO AUTH DATA
    const authData = this.getAuthData();
    if (!authData) {
      return;
    }

    //2. SETUP DATE VARS FOR COMPARISON
    const now = new Date();
    const expiresIn = authData.expirationDate.getTime() - now.getTime();

    //3. VERIFY AUTH DATA NOT EXPIRED THEN ALERT AND LOGIN
    if (expiresIn > 0) {
      // this.alertService.info("You've been logged in automatically.", {
      //   autoClose: true,
      //   keepAfterRouteChange: true,
      // });

      this.token = authData.token;
      this.userId = authData.userId;
      this.userType = authData.userType;
      this.setAuthTimer(expiresIn / 1000);

      //4. ENSURE USER LOGINS ARE SEPARATED
      if (this.userType === `employee`) {
        this.employeeIsAuth = true;
        this.employeeAuthStatusListener.next(true);
        this.schedulerIsAuth = false;
        this.schedulerAuthStatusListener.next(false);
      } else if (this.userType === `scheduler`) {
        this.schedulerIsAuth = true;
        this.schedulerAuthStatusListener.next(true);
        this.employeeIsAuth = false;
        this.employeeAuthStatusListener.next(false);
      }
    }
  }

  login(userType: UserType, email: string, password: string) {
    //1. GRAB INPUT DATA
    const authData: AuthData = { email, password };

    //2. POST TO API
    this.http
      .post<{
        token: string;
        user: any;
        expiresIn: number;
      }>(`${ROOT_URL}/${userType}/login`, authData)
      .subscribe(
        (res) => {
          //3. GRAB TOKEN FROM RESPONSE AND SET
          const token = res.token;
          this.token = token;

          //4. RELATE TOKEN EXPIRATION FROM BACKEND TO UI
          if (token) {
            const expiresInDuration = res.expiresIn;
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );

            //5. START TIMER, SAVE AUTH DATA, AND ALERT
            this.userId = res.user._id;
            this.userType = res.user.userType;
            this.setAuthTimer(expiresInDuration);
            this.saveAuthData(token, this.userId, userType, expirationDate);

            // this.alertService.success("You logged in successfully.", {
            //   autoClose: true,
            //   keepAfterRouteChange: true,
            // });

            //5. DISPLAY IN UI USER IS LOGGED
            if (userType === `employee`) {
              this.employeeIsAuth = true;
              this.employeeAuthStatusListener.next(true);
              this.schedulerIsAuth = false;
              this.schedulerAuthStatusListener.next(false);
            } else if (userType === `scheduler`) {
              this.schedulerIsAuth = true;
              this.schedulerAuthStatusListener.next(true);
              this.employeeIsAuth = false;
              this.employeeAuthStatusListener.next(false);
            }

            //6. REROUTE
            this.router.navigate(["/"]);
          }
        },

        (err) => {
          //7. ALERT AND ENSURE LISTENERS OFF IF ERR
          // this.alertService.error(
          //   "Your email or password is incorrect, please try again.",
          //   {
          //     autoClose: true,
          //     keepAfterRouteChange: true,
          //   }
          // );

          if (userType === `employee`) {
            this.employeeAuthStatusListener.next(false);
          } else if (userType === `scheduler`) {
            this.schedulerAuthStatusListener.next(false);
          }
        }
      );
  }

  logout() {
    //1. ALERT
    // this.alertService.warn("You logged out successfully.", {
    //   autoClose: true,
    //   keepAfterRouteChange: true,
    // });

    //2. RESET ALL
    this.token = null;
    this.userId = null;
    this.employeeIsAuth = false;
    this.schedulerIsAuth = false;
    this.employeeAuthStatusListener.next(false);
    this.schedulerAuthStatusListener.next(false);
    this.clearAuthData();
    clearTimeout(this.tokenTimer);

    //3. RELOAD
    const today = moment().toISOString();
    this.router.navigate([`/calendar/${today}`]);
  }

  changePassword(
    userType: UserType,
    passwordCurrent: string,
    password: string,
    passwordConfirm: string
  ) {
    //1. GRAB INPUT DATA
    const authUpdateData: AuthUpdateData = {
      passwordCurrent,
      password,
      passwordConfirm,
    };

    //2. POST TO API
    this.http
      .patch<{ token: string; user: any; expiresIn: number }>(
        `${ROOT_URL}/${userType}/updateMyPassword`,
        authUpdateData
      )
      .subscribe(
        (res) => {
          //3. GRAB TOKEN FROM RESPONSE AND SET
          const token = res.token;
          this.token = token;

          //4. RELATE TOKEN EXPIRATION FROM BACKEND TO UI
          if (token) {
            const expiresInDuration = res.expiresIn;
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );

            //5. START TIMER, SAVE AUTH DATA, AND ALERT
            this.userId = res.user._id;
            this.userType = res.user.userType;
            this.setAuthTimer(expiresInDuration);
            this.saveAuthData(token, this.userId, userType, expirationDate);

            // this.alertService.success(
            //   "You successfully changed your password. Your page will reload in 8 seconds.",
            //   {
            //     autoClose: true,
            //     keepAfterRouteChange: true,
            //   }
            // );

            //6. DISPLAY IN UI USER IS LOGGED
            if (userType === `employee`) {
              this.employeeIsAuth = true;
              this.employeeAuthStatusListener.next(true);
              this.schedulerIsAuth = false;
              this.schedulerAuthStatusListener.next(false);
            } else if (userType === `scheduler`) {
              this.schedulerIsAuth = true;
              this.schedulerAuthStatusListener.next(true);
              this.employeeIsAuth = false;
              this.employeeAuthStatusListener.next(false);
            }

            //7. DELAY RELOAD FOR ALERT CLARITY
            setTimeout(() => {
              this.logout();
            }, 8000);
          }
        },

        (err) => {
          // 7. ALERT AND ENSURE LISTENERS OFF IF ERR
          // this.alertService.error("Your passwords don't match.", {
          //   autoClose: true,
          //   keepAfterRouteChange: true,
          // });

          if (userType === `employee`) {
            this.employeeAuthStatusListener.next(false);
          } else if (userType === `scheduler`) {
            this.schedulerAuthStatusListener.next(false);
          }
        }
      );
  }

  forgotPassword(userType: UserType, email: string) {
    //1. POST TO API
    this.http
      .post(`${ROOT_URL}/${userType}/forgotPassword`, { email })
      .subscribe(
        () => {
          //2. ALERT EMAIL SUCCESS
          // this.alertService.success("Your email has been sent.", {
          //   autoClose: true,
          //   keepAfterRouteChange: true,
          // });
        },
        (err) => {
          //3. ALERT AND ENSURE LISTENERS OFF IF ERR
          // this.alertService.error("That email does not exist in our server.", {
          //   autoClose: true,
          //   keepAfterRouteChange: true,
          // });

          if (userType === `employee`) {
            this.employeeAuthStatusListener.next(false);
          } else if (userType === `scheduler`) {
            this.schedulerAuthStatusListener.next(false);
          }
        }
      );
  }

  resetPassword(
    userType: UserType,
    token: string,
    password: string,
    passwordConfirm: string
  ) {
    //1. GRAB INPUT DATA
    const authResetData: AuthResetData = {
      password,
      passwordConfirm,
    };

    //2. POST TO API
    this.http
      .patch<{ token: string; user: any; expiresIn: number }>(
        `${ROOT_URL}/${userType}/resetPassword/${token}`,
        authResetData
      )
      .subscribe(
        (res) => {
          //3. FETCH TOKEN FROM RESPONSE AND SET
          const token = res.token;
          this.token = token;

          //4. RELATE TOKEN EXPIRATION FROM BACKEND TO UI
          if (token) {
            const expiresInDuration = res.expiresIn;
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );

            //5. START TIMER, SAVE AUTH DATA, AND ALERT
            this.userId = res.user._id;
            this.userType = res.user.userType;
            this.setAuthTimer(expiresInDuration);
            this.saveAuthData(token, this.userId, userType, expirationDate);

            // this.alertService.success("You successfully reset your password.", {
            //   autoClose: true,
            //   keepAfterRouteChange: true,
            // });

            //6. DISPLAY IN UI USER IS LOGGED
            if (userType === `employee`) {
              this.employeeIsAuth = true;
              this.employeeAuthStatusListener.next(true);
              this.schedulerIsAuth = false;
              this.schedulerAuthStatusListener.next(false);
            } else if (userType === `scheduler`) {
              this.schedulerIsAuth = true;
              this.schedulerAuthStatusListener.next(true);
              this.employeeIsAuth = false;
              this.employeeAuthStatusListener.next(false);
            }

            //7. REROUTE
            this.router.navigate(["/"]);
          }
        },
        (err) => {
          // 8. ALERT AND ENSURE LISTENERS OFF IF ERR
          // this.alertService.error("Your passwords don't match.", {
          //   autoClose: true,
          //   keepAfterRouteChange: true,
          // });

          if (userType === `employee`) {
            this.employeeAuthStatusListener.next(false);
          } else if (userType === `scheduler`) {
            this.schedulerAuthStatusListener.next(false);
          }
        }
      );
  }
}
