import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PaymentsService } from '../../services/payments.service';
import { UsersService } from '../../services/users.service';
import { SubscriptionsService } from '../../services/subscriptions.service';
import { Payment } from '../../interfaces/payment';
import { User } from '../../interfaces/user.interface';
import { Subscription } from '../../interfaces/subscriptions';
import { ReactiveFormsModule } from '@angular/forms';

// Material
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {
  payments: Payment[] = [];
  userList: User[] = [];
  subscriptionList: Subscription[] = [];
  displayedColumns: string[] = [
    'user',
    'subscription',
    'amount',
    'transactionId'
  ];

  paymentForm: FormGroup;
  @ViewChild('paymentDialog') paymentDialog!: TemplateRef<any>;

  constructor(
    private paymentsService: PaymentsService,
    private usersService: UsersService,
    private subscriptionsService: SubscriptionsService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.paymentForm = this.fb.group({
      userId: ['', Validators.required],
      subscriptionName: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      transactionId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadPayments();
    this.loadUsers();
    this.loadSubscriptions();
  }

  loadPayments() {
    this.paymentsService.getPayments().subscribe({
      next: (p) => (this.payments = p || []),
      error: () => (this.payments = [])
    });
  }

  loadUsers() {
    this.usersService.getUsers().subscribe({
      next: (users) => (this.userList = users),
      error: () => (this.userList = [])
    });
  }

  loadSubscriptions() {
    this.subscriptionsService.getSubscriptions().subscribe({
      next: (subs) => (this.subscriptionList = subs),
      error: () => (this.subscriptionList = [])
    });
  }

  openAddDialog() {
    this.paymentForm.reset();
    this.dialog.open(this.paymentDialog, { width: '400px' });
  }

  savePayment() {
    if (this.paymentForm.invalid) return;
    this.paymentsService.createPayment(this.paymentForm.value).subscribe({
      next: () => {
        this.loadPayments();
        this.dialog.closeAll();
      }
    });
  }
}