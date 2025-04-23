import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { program } from '../interfaces/program.interface';

@Injectable({
  providedIn: 'root'
})
export class ProgramsService {
  private apiUrl = `${environment.apiUrl}/programs`;

  constructor(private http: HttpClient) { }

  getPrograms(): Observable<program[]> {
    console.log("Fetching data from ", this.apiUrl);
    return this.http.get<program[]>(this.apiUrl);
  }

  addProgram(program: program): Observable<program> {
    return this.http.post<program>(this.apiUrl, program);
  }

  updateProgram(program: program): Observable<program> {
    const url = `${this.apiUrl}/${program._id}`;
    return this.http.put<program>(url, program);
  }

  deleteProgram(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
