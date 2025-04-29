

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
  private lessonsUrl = `${environment.apiUrl}/lessons`;
  private coursesUrl = `${environment.apiUrl}/courses`;
  
  constructor(private http: HttpClient) {}

  getLessons(): Observable<Lesson[]> {
    console.log('Fetching lessons from:', this.lessonsUrl); // Debug line
    return this.http.get<Lesson[]>(this.lessonsUrl);
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.coursesUrl);
  }

  addLesson(lesson: Omit<Lesson, 'id'>): Observable<Lesson> {
    return this.http.post<Lesson>(this.lessonsUrl, lesson);
  }

  updateLesson(id: string, lesson: Partial<Lesson>): Observable<Lesson> {
    return this.http.put<Lesson>(`${this.lessonsUrl}/${id}`, lesson);
  }

  deleteLesson(id: string): Observable<void> {
    return this.http.delete<void>(`${this.lessonsUrl}/${id}`);
  }
}


