import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { InstructorsService } from '../../services/instructors.service';
import { Instructor } from '../../interfaces/instructor.interface';

@Component({
  selector: 'app-instructors',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule
  ],
  templateUrl: './instructors.component.html',
  styleUrl: './instructors.component.scss'
})
export class InstructorsComponent implements OnInit {
  displayedColumns: string[] = ['profile', 'email', 'professionalTitle', 'expertiseAreas', 'approvalStatus', 'actions'];
  instructors: Instructor[] = [];
  searchTerm: string = '';
  loading = false;
  error = '';

  constructor(private instructorsService: InstructorsService,) { }

  ngOnInit() {
    console.log("Getting the data");
    this.loadInstructors();
  }

  loadInstructors() {
    this.loading = true;
    this.error = '';

    this.instructorsService.getInstructors().subscribe({
      next: (data) => {

        this.instructors = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load instructors';
        this.loading = false;
        console.error('Error loading instructors:', error);
      }
    });
  }

  get filteredInstructors() {
    return this.instructors.filter(instructor =>
      instructor.professionalTitle.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      instructor.expertiseAreas.join(' ').toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      instructor.approvalStatus.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  deleteInstructor(userId: string) {
    if (confirm('Are you sure you want to delete this instructor?')) {
      this.instructorsService.deleteInstructor(userId).subscribe({
        next: () => {
          this.loadInstructors();
        },
        error: (error) => {
          this.error = 'Failed to delete instructor';
          console.error('Error deleting instructor:', error);
        }
      });
    }
  }
}
