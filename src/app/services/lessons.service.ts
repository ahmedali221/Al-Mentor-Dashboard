

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Course } from '../interfaces/course';
import { Lesson } from '../interfaces/lesson';

@Injectable({
  providedIn: 'root'
})
export class LessonsService {
  private apiUrl = `${environment.apiUrl}`;
  
  constructor(private http: HttpClient) {}

  getLessons(): Observable<Lesson[]> {
    console.log('Fetching lessons from:', this.apiUrl); // Debug line
    return this.http.get<Lesson[]>(`${this.apiUrl}/lessons`);
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses`);
  }

  addLesson(lesson: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/lessons`, lesson);
  }

  updateLesson(id: string, lesson: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/lessons/${id}`, lesson);
  }

  deleteLesson(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/lessons/${id}`);
  }
}


