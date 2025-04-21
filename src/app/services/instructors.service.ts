import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Instructor } from '../interfaces/instructor.interface';

interface InstructorResponse {
  success: boolean;
  message: string;
  data: Instructor[];
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class InstructorsService {
  private apiUrl = `${environment.apiUrl}/instructors`;

  constructor(private http: HttpClient) { }

  getInstructors(): Observable<Instructor[]> {
    console.log('Fetching from:', this.apiUrl);
    return this.http.get<InstructorResponse>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }

  getInstructor(id: string): Observable<Instructor> {
    return this.http.get<{ data: Instructor }>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  createInstructor(instructor: Instructor): Observable<Instructor> {
    return this.http.post<{ data: Instructor }>(this.apiUrl, instructor).pipe(
      map(response => response.data)
    );
  }

  updateInstructor(id: string, instructor: Partial<Instructor>): Observable<Instructor> {
    return this.http.put<{ data: Instructor }>(`${this.apiUrl}/${id}`, instructor).pipe(
      map(response => response.data)
    );
  }

  deleteInstructor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
