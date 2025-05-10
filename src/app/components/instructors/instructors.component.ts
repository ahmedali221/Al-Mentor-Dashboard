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
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { UsersService } from '../../services/users.service';
import { User } from '../../interfaces/user.interface';


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
  users: User[] = [];
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
    private usersService: UsersService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    // Add Instructor Form
    this.addInstructorForm = this.fb.group({
      user: ['', Validators.required],
      nameEn: ['', Validators.required],
      nameAr: [''],
      professionalTitleEn: ['', Validators.required],
      professionalTitleAr: [''],
      biographyEn: [''],
      biographyAr: [''],
      expertiseAreasEn: ['', Validators.required],
      expertiseAreasAr: [''],
      yearsOfExperience: [0],
      linkedin: [''],
      twitter: [''],
      youtube: [''],
      website: [''],
      approvalStatus: ['pending', Validators.required]
    });

    // Update Instructor Form
    this.updateInstructorForm = this.fb.group({
      user: ['', Validators.required],
      nameEn: ['', Validators.required],
      nameAr: [''],
      professionalTitleEn: ['', Validators.required],
      professionalTitleAr: [''],
      biographyEn: [''],
      biographyAr: [''],
      expertiseAreasEn: ['', Validators.required],
      expertiseAreasAr: [''],
      yearsOfExperience: [0],
      linkedin: [''],
      twitter: [''],
      youtube: [''],
      website: [''],
      approvalStatus: ['pending', Validators.required]
    });
  }

  ngOnInit() {
    this.loadInstructors();
    this.loadUsers();
  }

  loadUsers() {
    this.usersService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        this.error = 'Failed to load users';
        console.error('Error loading users:', error);
      }
    });
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

    // Extract values from the instructor object to populate the form
    this.updateInstructorForm.patchValue({
      user: instructor.user,
      nameEn: instructor.name?.en || '',
      nameAr: instructor.name?.ar || '',
      professionalTitleEn: instructor.professionalTitle?.en || '',
      professionalTitleAr: instructor.professionalTitle?.ar || '',
      biographyEn: instructor.biography?.en || '',
      biographyAr: instructor.biography?.ar || '',
      expertiseAreasEn: instructor.expertiseAreas?.en?.join(', ') || '',
      expertiseAreasAr: instructor.expertiseAreas?.ar?.join(', ') || '',
      yearsOfExperience: instructor.yearsOfExperience || 0,
      linkedin: instructor.socialMediaLinks?.linkedin || '',
      twitter: instructor.socialMediaLinks?.twitter || '',
      youtube: instructor.socialMediaLinks?.youtube || '',
      website: instructor.socialMediaLinks?.website || '',
      approvalStatus: instructor.approvalStatus
    });

    this.dialog.open(this.updateInstructorDialog, { width: '70%' });
  }

  // addInstructor() {
  //   if (this.addInstructorForm.valid) {
  //     const formValue = this.addInstructorForm.value;

  //     // Create a properly structured instructor object
  //     const newInstructor: Instructor = {
  //       user: formValue.user,
  //       name: {
  //         en: formValue.nameEn,
  //         ar: formValue.nameAr
  //       },
  //       professionalTitle: {
  //         en: formValue.professionalTitleEn,
  //         ar: formValue.professionalTitleAr
  //       },
  //       biography: {
  //         en: formValue.biographyEn,
  //         ar: formValue.biographyAr
  //       },
  //       expertiseAreas: {
  //         en: formValue.expertiseAreasEn.split(',').map((s: string) => s.trim()),
  //         ar: formValue.expertiseAreasAr ? formValue.expertiseAreasAr.split(',').map((s: string) => s.trim()) : []
  //       },
  //       yearsOfExperience: formValue.yearsOfExperience,
  //       socialMediaLinks: {
  //         linkedin: formValue.linkedin,
  //         twitter: formValue.twitter,
  //         youtube: formValue.youtube,
  //         website: formValue.website
  //       },
  //       approvalStatus: formValue.approvalStatus,
  //       profile: {
  //         firstName: { en: '', ar: '' },
  //         lastName: { en: '', ar: '' },
  //         email: '',
  //         profilePicture: ''
  //       }
  //     };

  //     this.instructorsService.addInstructor(newInstructor).subscribe({
  //       next: () => {
  //         this.loadInstructors();
  //         this.dialog.closeAll();
  //       }
  //     });
  //   }
  // }
  onUserSelectionChange(event: MatSelectChange): void {
    const selectedUserId = event.value;
    const selectedUser = this.users.find(user => user._id === selectedUserId);

    if (selectedUser) {
      // Update the name fields with the user's first and last name
      this.updateInstructorForm.patchValue({
        nameEn: `${selectedUser.firstName?.en || ''} ${selectedUser.lastName?.en || ''}`.trim(),
        nameAr: `${selectedUser.firstName?.ar || ''} ${selectedUser.lastName?.ar || ''}`.trim()
      });
    }
  }
  updateInstructor() {
    if (this.updateInstructorForm.valid && this.selectedInstructor) {
      const formValue = this.updateInstructorForm.value;

      // Create updated instructor object with proper structure
      const updatedInstructor: Instructor = {
        ...this.selectedInstructor,
        user: formValue.user,
        name: {
          en: formValue.nameEn,
          ar: formValue.nameAr
        },
        professionalTitle: {
          en: formValue.professionalTitleEn,
          ar: formValue.professionalTitleAr
        },
        biography: {
          en: formValue.biographyEn,
          ar: formValue.biographyAr
        },
        expertiseAreas: {
          en: formValue.expertiseAreasEn.split(',').map((s: string) => s.trim()),
          ar: formValue.expertiseAreasAr ? formValue.expertiseAreasAr.split(',').map((s: string) => s.trim()) : []
        },
        yearsOfExperience: formValue.yearsOfExperience,
        socialMediaLinks: {
          linkedin: formValue.linkedin,
          twitter: formValue.twitter,
          youtube: formValue.youtube,
          website: formValue.website
        },
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
