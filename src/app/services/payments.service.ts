import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Payment } from '../interfaces/payment';
import { Observable } from 'rxjs';

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
    userId: string;
    subscriptionName: string;
    amount: number;
    transactionId: string;
  }): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

 
}