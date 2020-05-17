import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "../../../../environments/environment";
import { WeeklyScheduled, WeeklyScheduledData } from "../../models/shift/weekly-scheduled.model";

const ROOT_URL = `${environment.apiUrl}/weeklyScheduled`;

@Injectable({
  providedIn: "root",
})
export class WeeklyScheduledService {
  constructor(private http: HttpClient) {}

  getAllWeeklyScheduled(): Observable<WeeklyScheduled[]> {
    return this.http
      .get<WeeklyScheduled[]>(`${ROOT_URL}`)
      .pipe(map((weeklyScheduled: any) => weeklyScheduled.doc));
  }

  getWeeklyScheduled(weeklyScheduledId: string): Observable<WeeklyScheduled> {
    return this.http.get<WeeklyScheduled>(`${ROOT_URL}/${weeklyScheduledId}`);
  }

  //PROTECTED----------------------------------------------------------

  //PROTECT ALL ROUTES FOR SCHEDULER FROM HERE
  populateAllToScheduled() {
    return this.http.post(`${ROOT_URL}/populate`, null);
  }

  populateToScheduled(
    weeklyScheduledId: string,
    weeklyScheduledData: WeeklyScheduled
  ): Observable<WeeklyScheduled> {
    return this.http.post<WeeklyScheduled>(
      `${ROOT_URL}/populate/${weeklyScheduledId}`,
      weeklyScheduledData
    );
  }

  createWeeklyScheduled(
    weeklyScheduledData: WeeklyScheduledData
  ): Observable<WeeklyScheduled> {
    return this.http.post<WeeklyScheduled>(`${ROOT_URL}`, weeklyScheduledData);
  }

  updateWeeklyScheduled(
    weeklyScheduledId: string,
    weeklyScheduledData: WeeklyScheduled
  ): Observable<WeeklyScheduled> {
    return this.http.patch<WeeklyScheduled>(
      `${ROOT_URL}/${weeklyScheduledId}`,
      weeklyScheduledData
    );
  }

  deleteWeeklyScheduled(
    weeklyScheduledId: string
  ): Observable<WeeklyScheduled> {
    return this.http.delete<WeeklyScheduled>(
      `${ROOT_URL}/${weeklyScheduledId}`
    );
  }
}
