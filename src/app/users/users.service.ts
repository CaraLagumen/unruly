import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { UserType } from "../shared/models/custom-types";
import { EmployeeData, SchedulerData } from "./users-data.model";

const ROOT_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: "root",
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getUser(userType: UserType): Observable<any> {
    return this.http
      .get<any>(`${ROOT_URL}/${userType}/me`)
      .pipe(map((user: any) => user.doc));
  }

  updateUser(userType: UserType, userData: EmployeeData | SchedulerData) {
    this.http
      .patch<EmployeeData | SchedulerData>(
        `${ROOT_URL}/${userType}/updateMe`,
        userData
      )
      .subscribe(() => location.reload());
  }
}
