import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'actions'];
  users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', active: true },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', active: true },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', active: false },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', active: true },
  ];
}
