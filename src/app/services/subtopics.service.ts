import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Subtopics } from '../interfaces/subtopics';

@Injectable({
  providedIn: 'root'
})
export class SubtopicsService {
  private apiUrl = `${environment.apiUrl}/subtopics`;

  constructor(private http: HttpClient) { }

  getSubTopicsByTopic(topicId: string): Observable<Subtopics[]> {
    return this.http.get<Subtopics[]>(`${this.apiUrl}/topic/${topicId}`);
  }

  getAllSubTopics(): Observable<Subtopics[]> {
    return this.http.get<Subtopics[]>(this.apiUrl);
  }

  getSubTopicById(id: string): Observable<Subtopics> {
    return this.http.get<Subtopics>(`${this.apiUrl}/${id}`);
  }

  createSubTopic(subTopic: Subtopics): Observable<Subtopics> {
    return this.http.post<Subtopics>(this.apiUrl, subTopic);
  }

  updateSubTopic(id: string, subTopic: Partial<Subtopics>): Observable<Subtopics> {
    return this.http.put<Subtopics>(`${this.apiUrl}/${id}`, subTopic);
  }

  deleteSubTopic(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}