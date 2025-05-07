import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { InstructorsService } from '../../services/instructors.service';
import { Instructor } from '../../interfaces/instructor.interface';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';


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
    MatInputModule, MatDividerModule, ReactiveFormsModule, MatDialogModule, MatSelectModule
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
  filteredInstructors: Instructor[] = [];

  addInstructorForm: FormGroup;
  updateInstructorForm: FormGroup;
  selectedInstructor: Instructor | null = null;

  @ViewChild('addInstructorDialog') addInstructorDialog!: TemplateRef<any>;
  @ViewChild('updateInstructorDialog') updateInstructorDialog!: TemplateRef<any>;

  constructor(
    private instructorsService: InstructorsService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    // Add Instructor Form
    this.addInstructorForm = this.fb.group({
      user: ['', Validators.required],
      professionalTitle: ['', Validators.required],
      expertiseAreas: ['', Validators.required], // comma separated string
      biography: [''],
      approvalStatus: ['pending', Validators.required]
    });

    // Update Instructor Form
    this.updateInstructorForm = this.fb.group({
      user: ['', Validators.required],
      professionalTitle: ['', Validators.required],
      expertiseAreas: ['', Validators.required], // comma separated string
      biography: [''],
      approvalStatus: ['pending', Validators.required]
    });
  }

  ngOnInit() {
    this.loadInstructors();

  }

  loadInstructors() {
    this.loading = true;
    this.error = '';

    this.instructorsService.getInstructors().subscribe({
      next: (data) => {
        this.instructors = data;
        this.filteredInstructors = [...data]; // Initialize filtered array
        this.loading = false;
        console.log(this.instructors)

      },
      error: (error) => {
        this.error = 'Failed to load instructors';
        this.loading = false;
        console.error('Error loading instructors:', error);
      }
    });
  }

  applySearchFilter() {
    if (!this.searchTerm) {
      this.filteredInstructors = [...this.instructors];
      return;
    }

    const query = this.searchTerm.toLowerCase();
    this.filteredInstructors = this.instructors.filter(instructor =>
      (instructor.profile.firstName?.en?.toLowerCase().includes(query) || '') ||
      (instructor.profile.lastName?.en?.toLowerCase().includes(query) || '') ||
      (instructor.profile.email?.toLowerCase().includes(query) || '') ||
      (instructor.professionalTitle?.en?.toLowerCase().includes(query) || '') ||
      (Array.isArray(instructor.expertiseAreas?.en) && instructor.expertiseAreas.en.join(' ').toLowerCase().includes(query)) ||
      (instructor.approvalStatus?.toLowerCase().includes(query) || '')
    );
  }

  get totalInstructors(): number {
    return this.instructors.length;
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

  openAddInstructorForm() {
    this.addInstructorForm.reset({ approvalStatus: 'pending' });
    this.dialog.open(this.addInstructorDialog, { width: '70%' });
  }

  openUpdateInstructorForm(instructor: Instructor) {
    this.selectedInstructor = instructor;
    this.updateInstructorForm.patchValue({
      user: instructor.user,
      professionalTitle: instructor.professionalTitle,
      expertiseAreas: instructor.expertiseAreas,
      biography: instructor.biography,
      approvalStatus: instructor.approvalStatus
    });
    this.dialog.open(this.updateInstructorDialog, { width: '70%' });
  }

  addInstructor() {
    if (this.addInstructorForm.valid) {
      const formValue = this.addInstructorForm.value;
      const newInstructor: Instructor = {
        ...formValue,
        expertiseAreas: formValue.expertiseAreas.split(',').map((s: string) => s.trim()),
        approvalStatus: formValue.approvalStatus
      };
      this.instructorsService.addInstructor(newInstructor).subscribe({
        next: () => {
          this.loadInstructors();
          this.dialog.closeAll();
        }
      });
    }
  }

  updateInstructor() {
    if (this.updateInstructorForm.valid && this.selectedInstructor) {
      const formValue = this.updateInstructorForm.value;
      const updatedInstructor: Instructor = {
        ...this.selectedInstructor,
        ...formValue,
        expertiseAreas: formValue.expertiseAreas.split(',').map((s: string) => s.trim()),
        approvalStatus: formValue.approvalStatus
      };
      this.instructorsService.updateInstructor(updatedInstructor).subscribe({
        next: () => {
          this.loadInstructors();
          this.dialog.closeAll();
        }
      });
    }
  }
}
