import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Subscription } from '../interfaces/subscriptions';

@Injectable({
    providedIn: 'root',
})
export class SubscriptionsService {
    private apiUrl = `${environment.apiUrl}/subscriptions`;

    constructor(private http: HttpClient) { }

    // Handle errors globally
    private handleError(error: HttpErrorResponse) {
        console.error('API Error:', error);
        return throwError(() => new Error(error.message || 'Server error'));
    }

    getAll(): Observable<Subscription[]> {
        return this.http
            .get<Subscription[]>(this.apiUrl)
            .pipe(catchError(this.handleError));
    }

    getById(id: string): Observable<Subscription> {
        if (!id) throw new Error('ID is required');
        return this.http
            .get<Subscription>(`${this.apiUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }

    create(subscription: Subscription): Observable<Subscription> {
        if (!subscription) throw new Error('Subscription data is required');
        return this.http
            .post<Subscription>(this.apiUrl, subscription)
            .pipe(catchError(this.handleError));
    }

    update(subscription: Subscription): Observable<Subscription> {
        if (!subscription?._id) throw new Error('Subscription ID is missing');
        return this.http
            .put<Subscription>(`${this.apiUrl}/${subscription._id}`, subscription)
            .pipe(catchError(this.handleError));
    }

    delete(id: string): Observable<void> {
        if (!id) throw new Error('ID is required');
        console.log('Deleting subscription with ID:', id);

        return this.http
            .delete<void>(`${this.apiUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }
}
