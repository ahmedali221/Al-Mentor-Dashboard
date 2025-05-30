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

  constructor(private http: HttpClient) { }

  getLessons(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.apiUrl}/lessons`)
      .pipe(
        tap(lessons => console.log('Fetched lessons:', lessons)),
        catchError(this.handleError('getLessons'))
      );
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses`)
      .pipe(
        catchError(this.handleError('getCourses'))
      );
  }

  addLesson(lesson: Partial<Lesson>): Observable<Lesson> {
    return this.http.post<Lesson>(`${this.apiUrl}/lessons`, lesson)
      .pipe(
        tap(response => console.log('Add lesson response:', response)),
        catchError(this.handleError('addLesson'))
      );
  }

  updateLesson(id: string, lesson: Partial<Lesson>): Observable<Lesson> {
    return this.http.put<Lesson>(`${this.apiUrl}/lessons/${id}`, lesson)
      .pipe(
        tap(response => console.log('Update lesson response:', response)),
        catchError(this.handleError('updateLesson'))
      );
  }

  deleteLesson(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/lessons/${id}`)
      .pipe(
        catchError(this.handleError('deleteLesson'))
      );
  }

  getLessonsByCourse(courseId: string): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.apiUrl}/lessons/course/${courseId}`)
      .pipe(
        catchError(this.handleError('getLessonsByCourse'))
      );
  }

  getLessonById(id: string): Observable<Lesson> {
    return this.http.get<Lesson>(`${this.apiUrl}/lessons/${id}`)
      .pipe(
        catchError(this.handleError('getLessonById'))
      );
  }

  private handleError(operation = 'operation') {
    return (error: HttpErrorResponse): Observable<never> => {
      console.error(`${operation} failed:`, error);

      let errorMessage = 'An error occurred';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Client-side error: ${error.error.message}`;
      } else {
        errorMessage = `Server returned code ${error.status}, body: ${JSON.stringify(error.error)}`;
      }

      return throwError(() => new Error(errorMessage));
    };
  }
}