import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "../../../../environments/environment";
import { Vacation } from "../../models/shift/vacation.model";

const ROOT_URL = `${environment.apiUrl}/vacations`;

@Injectable({
  providedIn: "root",
})
export class VacationService {
  constructor(private http: HttpClient) {}

  //PROTECTED----------------------------------------------------------

  //ALLOW EMPLOYEE TO GET, CREATE WITH VALIDATION, AND DELETE WITH VALIDATION

  getAllMyVacations(): Observable<Vacation[]> {
    return this.http
      .get<Vacation[]>(`${ROOT_URL}/me`)
      .pipe(map((vacation: any) => vacation.doc));
  }

  createMyVacation(vacationData: Vacation): Observable<Vacation> {
    return this.http.post<Vacation>(`${ROOT_URL}/me`, vacationData);
  }

  deleteMyVacation(vacationId: string): Observable<Vacation> {
    return this.http.delete<Vacation>(`${ROOT_URL}/me/${vacationId}`);
  }

  //PROTECT ALL ROUTES FOR SCHEDULER FROM HERE
  getAllVacations(): Observable<Vacation[]> {
    return this.http
      .get<Vacation[]>(`${ROOT_URL}`)
      .pipe(map((vacation: any) => vacation.doc));
  }

  createVacation(vacationData: Vacation): Observable<Vacation> {
    return this.http.post<Vacation>(`${ROOT_URL}`, vacationData);
  }

  getVacation(vacationId: string): Observable<Vacation> {
    return this.http.get<Vacation>(`${ROOT_URL}/${vacationId}`);
  }

  updateVacation(vacationId: number, vacationData: Vacation) {
    this.http.patch<Vacation>(`${ROOT_URL}/${vacationId}`, vacationData);
  }

  deleteVacation(vacationId: string): Observable<Vacation> {
    return this.http.delete<Vacation>(`${ROOT_URL}/${vacationId}`);
  }
}
