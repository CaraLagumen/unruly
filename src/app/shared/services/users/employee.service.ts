import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "../../../../environments/environment";
import { Employee } from '../../models/users/employee.model';

const ROOT_URL = `${environment.apiUrl}/employee`;

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  getAllEmployee(): Observable<Employee[]> {
    return this.http
      .get<Employee[]>(`${ROOT_URL}`)
      .pipe(map((employee: any) => employee.doc));
  }

  getEmployee(employeeId: string): Observable<Employee> {
    return this.http.get<Employee>(`${ROOT_URL}/${employeeId}`);
  }

  //PROTECTED----------------------------------------------------------

  //PROTECT ALL ROUTES FOR SCHEDULER FROM HERE
  createEmployee(employeeData: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${ROOT_URL}`, employeeData);
  }

  updateEmployee(employeeId: number, employeeData: Employee) {
    this.http.patch<Employee>(`${ROOT_URL}/${employeeId}`, employeeData);
  }

  deleteEmployee(employeeId: string): Observable<Employee> {
    return this.http.delete<Employee>(`${ROOT_URL}/${employeeId}`);
  }
}
