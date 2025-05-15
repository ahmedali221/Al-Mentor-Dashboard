import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { UserSubscriptionsService } from '../../services/user-subscriptions.service';
import { UserSubscriptions } from '../../interfaces/user-subscriptions';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-subscriptions',
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
    MatInputModule,
    MatSelectModule,
  ],
  providers: [UserSubscriptionsService],
  templateUrl: './user-subscriptions.component.html',
  styleUrls: ['./user-subscriptions.component.scss'],
})
export class UserSubscriptionsComponent implements OnInit {
  displayedColumns: string[] = [
    'userId',
    'subscriptionId', // Now shows subscription.name
    'startDate',
    'endDate',
    'status',
    'actions',
  ];
  userSubscriptions: UserSubscriptions[] = [];
  filteredUserSubscriptions: UserSubscriptions[] = [];
  error = '';
  searchQuery: string = '';

  addUserSubscriptionForm: FormGroup;

  @ViewChild('addUserSubscriptionDialog')
  addUserSubscriptionDialog!: TemplateRef<any>;

  constructor(
    private userSubscriptionsService: UserSubscriptionsService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    // Initialize Add User Subscription Form
    this.addUserSubscriptionForm = this.fb.group({
      userId: ['', Validators.required],
      subscriptionId: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadUserSubscriptions();
  }

  loadUserSubscriptions() {
    this.userSubscriptionsService.getAll().subscribe({
      next: (subscriptions) => {
        console.log('Subscriptions:', subscriptions); // Add logging to check data
        this.userSubscriptions = subscriptions;
        this.filteredUserSubscriptions = [...subscriptions];
      },
      error: (err) => {
        console.error('Error loading subscriptions:', err);
        this.error = 'Failed to load user subscriptions';
      },
    });
  }

  applySearchFilter() {
    if (!this.searchQuery) {
      this.filteredUserSubscriptions = [...this.userSubscriptions];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredUserSubscriptions = this.userSubscriptions.filter(
      (subscription) => {
        // Log the subscription to see its structure
        console.log('Subscription:', subscription);

        const userName = `${subscription.userId?.firstName?.en || ''} ${subscription.userId?.lastName?.en || ''}`.toLowerCase();
        const subscriptionName = subscription.subscriptionId?.name?.toLowerCase() || '';
        
        // Handle status based on the actual structure
        const status = String(subscription.status || '').toLowerCase();

        return userName.includes(query) ||
               subscriptionName.includes(query) ||
               status.includes(query);
      }
    );
  }

  deleteUserSubscription(subscriptionId: string) {
    if (!subscriptionId) {
      console.error('Subscription ID is required for deletion');
      this.error = 'Subscription ID is required';
      return;
    }

    if (confirm('Are you sure you want to delete this user subscription?')) {
      this.userSubscriptionsService.delete(subscriptionId).subscribe({
        next: () => {
          this.loadUserSubscriptions();
        },
        error: (error) => {
          console.error('Error deleting user subscription:', error);
          this.error = 'Failed to delete user subscription';
        },
      });
    }
  }

  openAddUserSubscriptionForm() {
    this.addUserSubscriptionForm.reset({
      userId: '',
      subscriptionId: '',
    });

    if (this.addUserSubscriptionDialog) {
      this.dialog.open(this.addUserSubscriptionDialog, { width: '70%' });
    }
  }

  addUserSubscription() {
    if (this.addUserSubscriptionForm.valid) {
      const formValue = this.addUserSubscriptionForm.value;
      this.userSubscriptionsService
        .createUserSubscription(formValue)
        .subscribe({
          next: () => {
            this.loadUserSubscriptions();
            this.dialog.closeAll();
          },
          error: (error) => {
            console.error('Error adding user subscription:', error);
            this.error =
              'Failed to add user subscription. Please try again later.';
          },
        });
    }
  }

  // Add these methods to the UserSubscriptionsComponent class:

  cancelSubscription(subscriptionId: string) {
    if (!subscriptionId) {
      console.error('Subscription ID is required for cancellation');
      this.error = 'Subscription ID is required';
      return;
    }

    this.userSubscriptionsService.cancelSubscription(subscriptionId).subscribe({
      next: () => {
        this.loadUserSubscriptions(); // Reload the list after cancellation
      },
      error: (error) => {
        console.error('Error canceling subscription:', error);
        this.error = 'Failed to cancel subscription';
      },
    });
  }

  reactivateSubscription(subscriptionId: string) {
    if (!subscriptionId) {
      console.error('Subscription ID is required for reactivation');
      this.error = 'Subscription ID is required';
      return;
    }

    this.userSubscriptionsService
      .reactivateSubscription(subscriptionId)
      .subscribe({
        next: () => {
          this.loadUserSubscriptions(); // Reload the list after reactivation
        },
        error: (error) => {
          console.error('Error reactivating subscription:', error);
          this.error = 'Failed to reactivate subscription';
        },
      });
  }

  get totalUserSubscriptions(): number {
    return this.userSubscriptions.length;
  }
}
