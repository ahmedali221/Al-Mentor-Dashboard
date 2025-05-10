import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PaymentsService } from '../../services/payments.service';
import { Payment } from '../../interfaces/payment';
import { User } from '../../interfaces/user.interface';
import { Subscription } from '../../interfaces/subscriptions';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

// Material
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { UsersService } from '../../services/users.service';
import { SubscriptionsService } from '../../services/subscriptions.service';

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
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  searchTerm: string = '';
  selectedSubscription: string = '';
  selectedStatus: string = '';
  selectedPaymentMethod: string = '';
  userList: User[] = [];
  subscriptionList: Subscription[] = [];
  displayedColumns: string[] = [
    'user',
    'subscription',
    'amount',
    'transactionId',
    'status',
    'paymentMethod',
  ];

  // Status options for filtering
  statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' }
  ];

  // Payment method options for filtering
  paymentMethodOptions = [
    { value: '', label: 'All Payment Methods' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'bank_transfer', label: 'Bank Transfer' }
  ];

  paymentForm: FormGroup;
  @ViewChild('paymentDialog') paymentDialog!: TemplateRef<any>;

  constructor(
    private paymentsService: PaymentsService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private usersService: UsersService,
    private subscriptionsService: SubscriptionsService
  ) {
    this.paymentForm = this.fb.group({
      userId: ['', Validators.required],
      subscriptionId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      currency: ['USD', Validators.required],
      transactionId: ['', Validators.required],
      statusEn: ['pending', Validators.required],
      statusAr: ['قيد الانتظار', Validators.required],
      paymentMethod: ['credit_card', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadPayments();
    this.loadUsers();
    this.loadSubscriptions();
  }

  loadUsers() {
    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.userList = users || [];
      },
      error: () => {
        this.userList = [];
      }
    });
  }

  loadSubscriptions() {
    this.subscriptionsService.getAll().subscribe({
      next: (subs) => {
        this.subscriptionList = subs || [];
      },
      error: () => {
        this.subscriptionList = [];
      }
    });
  }

  loadPayments() {
    this.paymentsService.getPayments().subscribe({
      next: (p) => {
        this.payments = p || [];
        this.filteredPayments = [...this.payments];
      },
      error: () => {
        this.payments = [];
        this.filteredPayments = [];
      }
    });
  }

  applyFilter() {
    this.filteredPayments = this.payments.filter(p => {
      // Get user data for this payment
      const userObj = typeof p.user === 'object' ? p.user : this.userList.find(u => u === p.user);

      // Search by username and name
      const username = userObj?.username?.toLowerCase() || '';
      const firstName = userObj?.firstName?.en?.toLowerCase() || '';
      const lastName = userObj?.lastName?.en?.toLowerCase() || '';
      const fullName = `${firstName} ${lastName}`.trim().toLowerCase();
      const searchTermLower = this.searchTerm.trim().toLowerCase();

      const matchesUser = !this.searchTerm ||
        username.includes(searchTermLower) ||
        firstName.includes(searchTermLower) ||
        lastName.includes(searchTermLower) ||
        fullName.includes(searchTermLower);

      // Filter by subscription
      const matchesSubscription = !this.selectedSubscription ||
        (typeof p.subscription === 'object' && p.subscription._id === this.selectedSubscription);

      // Filter by status
      const status = typeof p.status === 'object' ? p.status.en?.toLowerCase() : '';
      const matchesStatus = !this.selectedStatus ||
        status === this.selectedStatus;

      // Filter by payment method
      const matchesPaymentMethod = !this.selectedPaymentMethod ||
        p.paymentMethod === this.selectedPaymentMethod;

      return matchesUser && matchesSubscription && matchesStatus && matchesPaymentMethod;
    });
  }

  onSubscriptionFilterChange() {
    this.applyFilter();
  }

  onStatusFilterChange() {
    this.applyFilter();
  }

  onPaymentMethodFilterChange() {
    this.applyFilter();
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedSubscription = '';
    this.selectedStatus = '';
    this.selectedPaymentMethod = '';
    this.applyFilter();
  }

  openAddDialog() {
    this.paymentForm.reset();
    this.dialog.open(this.paymentDialog, { width: '400px' });
  }

  savePayment() {
    if (this.paymentForm.invalid) return;
    const formValue = this.paymentForm.value;
    const paymentData = {
      user: formValue.userId,
      subscription: formValue.subscriptionId,
      amount: formValue.amount,
      currency: formValue.currency,
      transactionId: formValue.transactionId,
      status: {
        en: formValue.statusEn,
        ar: formValue.statusAr
      },
      paymentMethod: formValue.paymentMethod
    };
    this.paymentsService.createPayment(paymentData).subscribe({
      next: () => {
        this.loadPayments();
        this.dialog.closeAll();
      }
    });
  }



}