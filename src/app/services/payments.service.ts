import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Payment } from '../interfaces/payment';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
  private baseUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) { }

  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.baseUrl);
  }

  getPaymentsByUser(userId: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}/user/${userId}`);
  }


  createPayment(data: {
    user: string;
    subscription: string;
    amount: number;
    currency: string;
    transactionId: string;
    status: { en: string; ar: string };
    paymentMethod: string;
  }): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }
}