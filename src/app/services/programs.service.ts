import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {  Program } from '../interfaces/program.interface';

@Injectable({
  providedIn: 'root'
})
export class ProgramsService {
  private apiUrl = `${environment.apiUrl}/programs`;

  constructor(private http: HttpClient) { }

  getPrograms(): Observable<Program[]> {
    console.log("Fetching data from ", this.apiUrl);
    return this.http.get<Program[]>(this.apiUrl);
  }

  addProgram(program: Program): Observable<Program> {
    return this.http.post<Program>(this.apiUrl, program);
  }

  getProgramById(id: string): Observable<Program> {
    return this.http.get<Program>(`${this.apiUrl}/${id}`);
  }

  getProgramByCategory(category: string): Observable<Program[]> {
    const url = `${this.apiUrl}?category=${category}`;
    return this.http.get<Program[]>(url);
  }

  updateProgram(program: Program): Observable<Program> {
    const url = `${this.apiUrl}/${program._id}`;
    return this.http.put<Program>(url, program);
  }

  deleteProgram(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
