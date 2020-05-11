import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "../../../../environments/environment";
import { Preferred } from "../../models/shift/preferred.model";

const ROOT_URL = `${environment.apiUrl}/preferred`;

@Injectable({
  providedIn: "root",
})
export class PreferredService {
  constructor(private http: HttpClient) {}

  //PROTECTED----------------------------------------------------------

  //PROTECT ALL ROUTES FOR EMPLOYEE FROM HERE
  getAllPreferred(): Observable<Preferred[]> {
    return this.http
      .get<Preferred[]>(`${ROOT_URL}`)
      .pipe(map((preferred: any) => preferred.doc));
  }

  getAllMyPreferred(): Observable<Preferred[]> {
    return this.http
      .get<Preferred[]>(`${ROOT_URL}/me`)
      .pipe(map((preferred: any) => preferred.doc));
  }

  saveMyPreferred(
    shiftId: string,
    preferredData: Preferred
  ): Observable<Preferred> {
    return this.http.post<Preferred>(
      `${ROOT_URL}/me/${shiftId}`,
      preferredData
    );
  }

  deleteMyPreferred(preferredId: string): Observable<Preferred> {
    return this.http.delete<Preferred>(`${ROOT_URL}/me/${preferredId}`);
  }
}
