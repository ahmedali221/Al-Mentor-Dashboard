import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserSubscriptions } from '../interfaces/user-subscriptions';

@Injectable({
  providedIn: 'root',
})
export class UserSubscriptionsService {
  private apiUrl = `${environment.apiUrl}/user-subscriptions`;

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }

  getAll(): Observable<UserSubscriptions[]> {
    return this.http
      .get<UserSubscriptions[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  updateStatus(
    userId: string,
    status: 'active' | 'expired' | 'canceled'
  ): Observable<void> {
    return this.http
      .patch<void>(`${this.apiUrl}/${userId}/status`, { status })
      .pipe(catchError(this.handleError));
  }

  sendNotification(
    userId: string,
    type: 'renewalWarning' | 'expiredNotice'
  ): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/${userId}/notifications`, { type })
      .pipe(catchError(this.handleError));
  }

  update(subscription: UserSubscriptions): Observable<UserSubscriptions> {
    return this.http
      .put<UserSubscriptions>(
        `${this.apiUrl}/${subscription.userId}`,
        subscription
      )
      .pipe(catchError(this.handleError));
  }

  delete(_id: string): Observable<void> {
    if (!_id) {
      console.error('ID is required for deletion');
      return throwError(() => new Error('ID is required'));
    }

    const url = `${this.apiUrl}/${_id}`;

    return this.http.delete<void>(url).pipe(
      catchError((error) => {
        console.error('Error deleting user subscription:', error);
        return throwError(
          () => new Error(error.message || 'Failed to delete user subscription')
        );
      })
    );
  }

  create(subscription: UserSubscriptions): Observable<UserSubscriptions> {
    return this.http
      .post<UserSubscriptions>(this.apiUrl, subscription)
      .pipe(catchError(this.handleError));
  }

  toggleSubscriptionStatus(
    id: string,
    action: 'activate' | 'cancel'
  ): Observable<UserSubscriptions> {
    if (!id) {
      console.error('ID is required for toggling status');
      return throwError(() => new Error('ID is required'));
    }

    const url = `http://localhost:5000/api/user-subscriptions/${action}/${id}`;

    return this.http.put<UserSubscriptions>(url, {}).pipe(
      catchError((error) => {
        return throwError(
          () =>
            new Error(
              error.message || `Failed to ${action} subscription status`
            )
        );
      })
    );
  }

  createUserSubscription(data: {
    userId: string;
    subscriptionId: string;
  }): Observable<UserSubscriptions> {
    const url = `http://localhost:5000/api/subscriptions/user`;
    return this.http.post<UserSubscriptions>(url, data).pipe(
      catchError((error) => {
        console.error('Error creating user subscription:', error);
        return throwError(
          () => new Error(error.message || 'Failed to create user subscription')
        );
      })
    );
  }
}
