import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SubscriptionsService } from '../../services/subscriptions.service';
import { Subscription } from '../../interfaces/subscriptions';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
  providers: [SubscriptionsService],
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss'],
})
export class SubscriptionsComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'displayName',
    'price',
    'isActive',
    'actions',
  ];
  subscriptions: Subscription[] = [];
  error = '';

  selectedSubscription: Subscription | null = null;
  updateSubscriptionForm: FormGroup;
  addSubscriptionForm: FormGroup;

  @ViewChild('updateSubscriptionDialog')
  updateSubscriptionDialog!: TemplateRef<any>;

  @ViewChild('addSubscriptionDialog')
  addSubscriptionDialog!: TemplateRef<any>;

  constructor(
    private subscriptionsService: SubscriptionsService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    // Initialize Update Subscription Form
    this.updateSubscriptionForm = this.fb.group({
      name: ['', Validators.required],
      displayName: this.fb.group({
        en: ['', Validators.required],
        ar: ['', Validators.required],
      }),
      description: this.fb.group({
        en: ['', Validators.required],
        ar: ['', Validators.required],
      }),
      price: this.fb.group({
        amount: [0, Validators.required],
        originalAmount: [null], // Optional
        currency: ['', Validators.required],
      }),
      duration: this.fb.group({
        value: [0, Validators.required],
        unit: ['', Validators.required],
      }),
      trialPeriod: this.fb.group({
        enabled: [false],
        durationDays: [null], // Optional
      }),
      features: this.fb.array([]), // Optional
      isActive: [true, Validators.required],
      priority: [0], // Optional
    });

    // Initialize Add Subscription Form
    this.addSubscriptionForm = this.fb.group({
      name: ['', Validators.required],
      displayName: this.fb.group({
        en: ['', Validators.required],
        ar: ['', Validators.required],
      }),
      description: this.fb.group({
        en: ['', Validators.required],
        ar: ['', Validators.required],
      }),
      price: this.fb.group({
        amount: [0, Validators.required],
        originalAmount: [null], // Optional
        currency: ['', Validators.required],
      }),
      duration: this.fb.group({
        value: [0, Validators.required],
        unit: ['', Validators.required],
      }),
      trialPeriod: this.fb.group({
        enabled: [false],
        durationDays: [null], // Optional
      }),
      features: this.fb.array([]), // Optional
      isActive: [true, Validators.required],
      priority: [0], // Optional
    });
  }

  ngOnInit() {
    this.loadSubscriptions();
  }

  searchQuery: string = '';
  filteredSubscriptions: Subscription[] = [];

  applySearchFilter() {
    if (!this.searchQuery) {
      this.filteredSubscriptions = [...this.subscriptions];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredSubscriptions = this.subscriptions.filter(
      (subscription) =>
        subscription.name.toLowerCase().includes(query) ||
        subscription.displayName.en.toLowerCase().includes(query) ||
        subscription.displayName.ar.toLowerCase().includes(query) ||
        subscription.price.currency.toLowerCase().includes(query) ||
        (subscription.isActive ? 'active' : 'inactive').includes(query)
    );
  }

  loadSubscriptions() {
    this.subscriptionsService.getAll().subscribe((subscriptions) => {
      this.subscriptions = subscriptions;
      this.filteredSubscriptions = [...subscriptions];
    });
  }

  get totalSubscriptions(): number {
    return this.subscriptions.length;
  }

  deleteSubscription(subscriptionId: string) {
    // Log the ID being sent
    console.log('Attempting to delete subscription with ID:', subscriptionId);

    // Validate the ID format (assuming MongoDB ObjectId format)
    const objectIdRegex = /^[a-f\d]{24}$/i;
    if (!objectIdRegex.test(subscriptionId)) {
      console.error('Invalid subscription ID format:', subscriptionId);
      this.error = 'Invalid subscription ID format';
      return;
    }

    if (confirm('Are you sure you want to delete this subscription?')) {
      this.subscriptionsService.delete(subscriptionId).subscribe({
        next: () => {
          console.log('Subscription deleted successfully:', subscriptionId);
          this.loadSubscriptions();
        },
        error: (error) => {
          console.error('Error deleting subscription:', error); // Log the error
          console.error('Error details:', error.message); // Log error details
          this.error = 'Failed to delete subscription';
        },
      });
    }
  }

  openUpdateSubscriptionForm(subscription: Subscription) {
    console.log('Opening Update Subscription Form for:', subscription); // Debugging log

    this.selectedSubscription = subscription;
    this.updateSubscriptionForm.patchValue({
      name: subscription.name,
      displayName: subscription.displayName,
      description: subscription.description,
      price: subscription.price,
      duration: subscription.duration,
      trialPeriod: subscription.trialPeriod,
      features: subscription.features,
      isActive: subscription.isActive,
      priority: subscription.priority,
    });

    // Open the dialog
    if (this.updateSubscriptionDialog) {
      this.dialog.open(this.updateSubscriptionDialog, { width: '70%' });
    } else {
      console.error('updateSubscriptionDialog TemplateRef is not defined'); // Debugging log
    }
  }

  updateSubscription() {
    if (this.updateSubscriptionForm.valid && this.selectedSubscription) {
      const updatedSubscription = {
        ...this.selectedSubscription,
        ...this.updateSubscriptionForm.value,
      };
      this.subscriptionsService.update(updatedSubscription).subscribe({
        next: () => {
          this.loadSubscriptions();
          this.dialog.closeAll();
        },
        error: (error) => {
          this.error = 'Failed to update subscription';
          console.error('Error updating subscription:', error);
        },
      });
    }
  }

  openAddSubscriptionForm() {
    console.log('Opening Add Subscription Form'); // Debugging log

    // Reset the form with default values
    this.addSubscriptionForm.reset({
      name: '',
      displayName: { en: '', ar: '' },
      description: { en: '', ar: '' },
      price: { amount: 0, originalAmount: null, currency: '' },
      duration: { value: 0, unit: '' },
      trialPeriod: { enabled: false, durationDays: null },
      features: [],
      isActive: true,
      priority: 0,
    });

    // Open the dialog
    if (this.addSubscriptionDialog) {
      this.dialog.open(this.addSubscriptionDialog, { width: '70%' });
    } else {
      console.error('addSubscriptionDialog TemplateRef is not defined'); // Debugging log
    }
  }

  addSubscription() {
    if (this.addSubscriptionForm.valid) {
      const formValue = this.addSubscriptionForm.value;
      console.log('Submitting new subscription:', formValue); // Debugging log

      this.subscriptionsService.create(formValue).subscribe({
        next: () => {
          console.log('Subscription added successfully'); // Debugging log
          this.loadSubscriptions();
          this.dialog.closeAll();
        },
        error: (error) => {
          this.error = 'Failed to add subscription';
          console.error('Error adding subscription:', error); // Debugging log
        },
      });
    } else {
      console.error(
        'Add Subscription Form is invalid:',
        this.addSubscriptionForm.value
      ); // Debugging log
    }
  }

  addFeature() {
    const featuresArray = this.addSubscriptionForm.get('features') as any;
    featuresArray.push(
      this.fb.group({
        title: this.fb.group({
          en: ['', Validators.required],
          ar: ['', Validators.required],
        }),
        description: this.fb.group({
          en: ['', Validators.required],
          ar: ['', Validators.required],
        }),
        icon: [''], // Optional
      })
    );
  }

  removeFeature(index: number) {
    const featuresArray = this.addSubscriptionForm.get('features') as any;
    featuresArray.removeAt(index);
  }
}
