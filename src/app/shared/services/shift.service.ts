import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { Shift } from "../models/shift/shift.model";
import { ShiftEvent } from "../models/custom-types";

const ROOT_URL = `${environment.apiUrl}/shifts`;

@Injectable({
  providedIn: "root",
})
export class ShiftService {
  constructor(private http: HttpClient) {}

  getAllShift(): Observable<Shift[]> {
    return this.http
      .get<Shift[]>(`${ROOT_URL}`)
      .pipe(map((shift: any) => shift.doc));
  }

  getShift(shiftId: string): Observable<Shift> {
    return this.http.get<Shift>(`${ROOT_URL}/${shiftId}`);
  }

  getShiftsByHour(shiftEvent: ShiftEvent, shiftTime: number) {
    return this.http.get<Shift>(
      `${ROOT_URL}/search?${shiftEvent}=${shiftTime}`
    );
  }

  //PROTECTED----------------------------------------------------------

  //PROTECT ALL ROUTES FOR SCHEDULER FROM HERE
  createShift(shiftData: Shift): Observable<Shift> {
    return this.http.post<Shift>(`${ROOT_URL}`, shiftData);
  }

  updateShift(shiftId: number, shiftData: Shift) {
    this.http.patch<Shift>(`${ROOT_URL}/${shiftId}`, shiftData);
  }

  deleteShift(shiftId: string): Observable<Shift> {
    return this.http.delete<Shift>(`${ROOT_URL}/${shiftId}`);
  }
}
