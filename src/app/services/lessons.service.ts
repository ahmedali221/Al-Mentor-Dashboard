import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Course } from '../interfaces/course';
import { Lesson } from '../interfaces/lesson';

@Injectable({
  providedIn: 'root'
})
export class LessonsService {
  private apiUrl = `${environment.apiUrl}`;
 
  constructor(private http: HttpClient) {}

  getLessons(): Observable<Lesson[]> {
    console.log('Fetching lessons from:', `${this.apiUrl}/lessons`);
    return this.http.get<Lesson[]>(`${this.apiUrl}/lessons`)
      .pipe(
        tap(lessons => console.log(`Fetched ${lessons.length} lessons`)),
        catchError(this.handleError('getLessons'))
      );
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses`)
      .pipe(
        catchError(this.handleError('getCourses'))
      );
  }

  addLesson(lesson: any): Observable<any> {
    console.log('Sending ADD lesson data to API:', lesson);
    return this.http.post<any>(`${this.apiUrl}/lessons`, lesson)
      .pipe(
        tap(response => console.log('Add lesson API response:', response)),
        catchError(this.handleError('addLesson'))
      );
  }

  updateLesson(id: string, lesson: any): Observable<any> {
    console.log(`Sending UPDATE lesson data to API for ID ${id}:`, lesson);
    console.log('UPDATE endpoint:', `${this.apiUrl}/lessons/${id}`);
    
    return this.http.put<any>(`${this.apiUrl}/lessons/${id}`, lesson)
      .pipe(
        tap(response => console.log('Update lesson API response:', response)),
        catchError(this.handleError('updateLesson'))
      );
  }

  deleteLesson(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/lessons/${id}`)
      .pipe(
        catchError(this.handleError('deleteLesson'))
      );
  }

  // Generic error handler with contextual information
  private handleError(operation = 'operation') {
    return (error: HttpErrorResponse): Observable<never> => {
      console.error(`${operation} failed:`, error);
      
      // Log detailed error information
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        console.error(`Client-side error: ${error.error.message}`);
      } else {
        // Server-side error
        console.error(`Server returned code ${error.status}, body:`, error.error);
        
        // Log API response details if available
        if (error.error) {
          console.error('Error details:', error.error);
        }
      }
      
      // Return an observable with a user-facing error message
      const message = error.error?.message || error.message || `Error in ${operation}`;
      return throwError(() => new Error(message));
    };
  }
}