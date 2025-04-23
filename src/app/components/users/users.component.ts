import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { UsersService } from '../../services/users.service';
import { User } from '../../interfaces/user.interface';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
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
    MatInputModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['username', 'email', 'firstName', 'lastName', 'actions'];
  users: User[] = [];
  error = '';

  selectedUser: User | null = null;
  updateUserForm: FormGroup;

  @ViewChild('updateUserDialog') updateUserDialog!: TemplateRef<any>;

  constructor(
    private usersService: UsersService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.updateUserForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.usersService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  // ... existing code ...

  get totalStudents(): number {
    return this.users.length;
  }




  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.usersService.deleteUser(userId).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          this.error = 'Failed to delete user';
          console.error('Error deleting user:', error);
        }
      });
    }
  }

  openUpdateUserForm(user: User) {
    this.selectedUser = user;
    this.updateUserForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,

    });
    this.dialog.open(this.updateUserDialog, { width: '500px' });
  }

  updateUser() {
    if (this.updateUserForm.valid && this.selectedUser) {
      const updatedUser = { ...this.selectedUser, ...this.updateUserForm.value };
      this.usersService.updateUser(updatedUser).subscribe({
        next: () => {
          this.loadUsers();
          this.dialog.closeAll();
        },
        error: (error) => {
          this.error = 'Failed to update user';
          console.error('Error updating user:', error);
        }
      });
    }
  }
}