import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "../../../../environments/environment";
import { WeeklyShift } from "../../models/shift/weekly-shift.model";

const ROOT_URL = `${environment.apiUrl}/weeklyShifts`;

@Injectable({
  providedIn: "root",
})
export class WeeklyShiftService {
  constructor(private http: HttpClient) {}

  getAllWeeklyShifts(): Observable<WeeklyShift[]> {
    return this.http
      .get<WeeklyShift[]>(`${ROOT_URL}`)
      .pipe(map((weeklyShift: any) => weeklyShift.doc));
  }

  getWeeklyShift(weeklyShiftId: string): Observable<WeeklyShift> {
    return this.http.get<WeeklyShift>(`${ROOT_URL}/${weeklyShiftId}`);
  }

  //PROTECTED----------------------------------------------------------

  //PROTECT ALL ROUTES FOR SCHEDULER FROM HERE
  createWeeklyShift(weeklyShiftData: WeeklyShift): Observable<WeeklyShift> {
    return this.http.post<WeeklyShift>(`${ROOT_URL}`, weeklyShiftData);
  }

  updateWeeklyShift(weeklyShiftId: string, weeklyShiftData: WeeklyShift) {
    this.http.patch<WeeklyShift>(
      `${ROOT_URL}/${weeklyShiftId}`,
      weeklyShiftData
    );
  }

  deleteWeeklyShift(weeklyShiftId: string): Observable<WeeklyShift> {
    return this.http.delete<WeeklyShift>(`${ROOT_URL}/${weeklyShiftId}`);
  }
}
