import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from '../interfaces/subscriptions';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {
  private apiUrl = `${environment.apiUrl}/subscriptions`;

  constructor(private http: HttpClient) {}

  getSubscriptions(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(this.apiUrl);
  }

  createSubscription(data: Subscription): Observable<Subscription> {
    return this.http.post<Subscription>(this.apiUrl, data);
  }
}