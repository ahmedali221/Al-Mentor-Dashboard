import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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
    const query = this.searchTerm.trim().toLowerCase();
    this.filteredPayments = this.payments.filter(p => {
      // Filter by username only
      const matchesUsername =
        !query ||
        (typeof p.user === 'string'
          ? p.user.toLowerCase().includes(query)
          : p.user?.username?.toLowerCase().includes(query));

      // Filter by subscription name from dropdown
      const matchesSubscription =
        !this.selectedSubscription ||
        (typeof p.subscription === 'string'
          ? p.subscription === this.selectedSubscription
          : p.subscription?.name === this.selectedSubscription);

      return matchesUsername && matchesSubscription;
    });
  }

  onSubscriptionFilterChange() {
    this.applyFilter();
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