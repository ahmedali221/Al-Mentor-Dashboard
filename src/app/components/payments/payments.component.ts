import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PaymentsService } from '../../services/payments.service';
import { Payment } from '../../interfaces/payment';
import { User } from '../../interfaces/user.interface';
import { Subscription } from '../../interfaces/subscriptions';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

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
      user: ['', Validators.required],
      subscription: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      transactionId: ['', Validators.required],
      currency: ['USD', Validators.required],
      paymentMethod: ['Credit Card', Validators.required],
      status: this.fb.group({
        en: ['pending', Validators.required],  // Status in English
        ar: ['قيد الانتظار', Validators.required]  // Status in Arabic
      })
    });
  }

  ngOnInit(): void {
    this.loadPayments();
    this.loadUsers();
    this.loadSubscriptions();
  }

  loadUsers() {
    this.paymentsService.getUsers().subscribe({
      next: (users) => this.userList = users,
      error: () => this.userList = []
    });
  }

  loadSubscriptions() {
    this.paymentsService.getSubscriptions().subscribe({
      next: (subs) => this.subscriptionList = subs,
      error: () => this.subscriptionList = []
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
      const matchesUsername =
        !query ||
        (typeof p.user === 'string'
          ? p.user.toLowerCase().includes(query)
          : p.user?.username?.toLowerCase().includes(query));

      const matchesSubscription =
        !this.selectedSubscription ||
        (typeof p.subscription === 'string'
          ? p.subscription === this.selectedSubscription
          : p.subscription?.name === this.selectedSubscription);

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
    this.paymentForm.reset({
      currency: 'USD',
      paymentMethod: 'Credit Card',
      status: {
        en: 'pending',
        ar: 'قيد الانتظار',
      }
    });
    this.dialog.open(this.paymentDialog, { width: '400px' });
  }

  savePayment() {
    if (this.paymentForm.invalid) return;

    const paymentData = this.paymentForm.value;
    const formattedPayment = {
      ...paymentData,
      status: {
        en: paymentData.status.en,
        ar: paymentData.status.ar
      }
    };

    console.log('Formatted Payment:', formattedPayment); // Log the formatted payment data

    this.paymentsService.createPayment(formattedPayment).subscribe({
      next: () => {
        this.loadPayments();
        this.dialog.closeAll();
      },
      error: (err) => {
        console.error('Error saving payment:', err);
      }
    });
  }



}
