import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "../../../../environments/environment";
import { Scheduled } from "../../models/shift/scheduled.model";

const ROOT_URL = `${environment.apiUrl}/scheduled`;

@Injectable({
  providedIn: "root",
})
export class ScheduledService {
  constructor(private http: HttpClient) {}

  //RAW SCHEDULED (NO LIMIT)
  getRawAllScheduled(): Observable<Scheduled[]> {
    return this.http
      .get<Scheduled[]>(`${ROOT_URL}/raw`)
      .pipe(map((shift: any) => shift.doc));
  }

  getAllScheduled(): Observable<Scheduled[]> {
    return this.http
      .get<Scheduled[]>(`${ROOT_URL}`)
      .pipe(map((scheduled: any) => scheduled.doc));
  }

  getScheduled(scheduledId: string): Observable<Scheduled> {
    return this.http.get<Scheduled>(`${ROOT_URL}/${scheduledId}`);
  }

  getEmployeeSchedule(employeeId: string): Observable<Scheduled[]> {
    return this.http.get<Scheduled[]>(`${ROOT_URL}/employee/${employeeId}`);
  }

  //PROTECTED----------------------------------------------------------

  //PROTECT ALL ROUTES FOR SCHEDULER FROM HERE
  createScheduled(scheduledData: Scheduled): Observable<Scheduled> {
    return this.http.post<Scheduled>(`${ROOT_URL}`, scheduledData);
  }

  deleteLastScheduled() {
    return this.http.delete(`${ROOT_URL}`);
  }

  deleteScheduled(scheduledId: string): Observable<Scheduled> {
    return this.http.delete<Scheduled>(`${ROOT_URL}/${scheduledId}`);
  }
}
