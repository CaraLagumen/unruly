import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "../../../../environments/environment";
import { Preferred, PreferredData } from "../../models/shift/preferred.model";

const ROOT_URL = `${environment.apiUrl}/preferred`;

@Injectable({
  providedIn: "root",
})
export class PreferredService {
  constructor(private http: HttpClient) {}

  //PROTECTED----------------------------------------------------------

  //PROTECT ALL ROUTES FOR EMPLOYEE FROM HERE
  getRawAllPreferred(): Observable<Preferred[]> {
    return this.http
      .get<Preferred[]>(`${ROOT_URL}/raw`)
      .pipe(map((preferred: any) => preferred.doc));
  }

  getAllMyPreferred(): Observable<Preferred[]> {
    return this.http
      .get<Preferred[]>(`${ROOT_URL}/me`)
      .pipe(map((preferred: any) => preferred.doc));
  }

  saveMyPreferred(preferredData: PreferredData): Observable<Preferred> {
    return this.http.post<Preferred>(`${ROOT_URL}/me`, preferredData);
  }

  updateMyPreferred(
    preferredId: string,
    preferredData: PreferredData
  ): Observable<Preferred> {
    return this.http.patch<Preferred>(
      `${ROOT_URL}/${preferredId}`,
      preferredData
    );
  }

  deleteMyPreferred(preferredId: string): Observable<Preferred> {
    return this.http.delete<Preferred>(`${ROOT_URL}/${preferredId}`);
  }
}
