import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Payment } from '../interfaces/payment';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { Subscription } from '../interfaces/subscriptions';

@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
  private baseUrl = 'http://localhost:5000/api/payments';

  constructor(private http: HttpClient) {}

  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.baseUrl);
  }

  getPaymentsByUser(userId: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}/user/${userId}`);
  }

  createPayment(data: {
    user: string; // User ID
    subscription: string; // Subscription ID
    amount: number;
    transactionId: string;
    currency: string; // Currency (USD, EGP, etc.)
    paymentMethod: string; // Payment method (Credit Card, PayPal, etc.)
    status: { en: string; ar: string }; // New status with both English and Arabic
  }): Observable<any> {
    // Ensure you're sending the correct structure of the data
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // Include Authorization header if necessary
      // 'Authorization': `Bearer ${yourAuthToken}` 
    });

    const payload = {
      user: data.user,
      subscription: data.subscription,
      amount: data.amount,
      currency: data.currency,
      transactionId: data.transactionId,
      paymentMethod: data.paymentMethod,
      status: data.status // This now contains both `en` and `ar` fields
    };

    // Log the request payload to ensure the data is in the correct format
    console.log('Sending Payment Data:', payload);

    // Make the HTTP POST request to your backend
    return this.http.post<any>(`${this.baseUrl}`, payload, { headers });
  }
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:5000/api/users');
  }
  
  getSubscriptions(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>('http://localhost:5000/api/subscriptions');
  }
}
