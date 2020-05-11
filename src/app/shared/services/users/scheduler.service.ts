import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "../../../../environments/environment";
import { Scheduler } from "../../models/users/scheduler.model";

const ROOT_URL = `${environment.apiUrl}/scheduler`;

@Injectable({
  providedIn: "root",
})
export class SchedulerService {
  constructor(private http: HttpClient) {}

  getAllScheduler(): Observable<Scheduler[]> {
    return this.http
      .get<Scheduler[]>(`${ROOT_URL}?sort=lastName`)
      .pipe(map((scheduler: any) => scheduler.doc));
  }

  getScheduler(schedulerId: string): Observable<Scheduler> {
    return this.http.get<Scheduler>(`${ROOT_URL}/${schedulerId}`);
  }
}
