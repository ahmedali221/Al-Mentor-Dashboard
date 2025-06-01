import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Instructor } from '../interfaces/instructor.interface';

interface InstructorResponse {
  success: boolean;
  message: string;
  data: Instructor[];
  count: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class InstructorsService {
  private apiUrl = `${environment.apiUrl}/instructors`;

  constructor(private http: HttpClient) { }

  getInstructors(page: number = 1, limit: number = 12): Observable<InstructorResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    console.log('Fetching from:', this.apiUrl, 'Page:', page, 'Limit:', limit);

    return this.http.get<InstructorResponse>(this.apiUrl, { params });
  }

  getInstructor(id: string): Observable<Instructor> {
    return this.http.get<{ data: Instructor }>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  addInstructor(instructor: Instructor): Observable<Instructor> {
    return this.http.post<{ data: Instructor }>(this.apiUrl, instructor).pipe(
      map(response => response.data)
    );
  }

  updateInstructor(instructor: Instructor): Observable<Instructor> {
    return this.http.put<{ data: Instructor }>(`${this.apiUrl}/${instructor._id}`, instructor).pipe(
      map(response => response.data)
    );
  }

  deleteInstructor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}