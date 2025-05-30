import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProgramsService } from '../../services/programs.service';
import { CoursesService } from '../../services/course.service';
import { program } from '../../interfaces/program.interface';
import { CommonModule, Location } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatList, MatListItem } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Course } from '../../interfaces/course';

@Component({
  selector: 'app-program-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatInputModule,
    MatList,
    MatListItem,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTooltipModule
  ],
  templateUrl: './program-details.component.html',
  styleUrls: ['./program-details.component.scss']
})
export class ProgramDetailsComponent implements OnInit {
  @ViewChild('updateDetailsDialog') updateDetailsDialog!: TemplateRef<any>;

  program!: program;
  loading = true;
  updateForm!: FormGroup;
  selectedProgram!: program;
  allCourses: Course[] = [];
  unassociatedCourses: Course[] = [];
  selectedCourseId: string | null = null;
  courseDetails: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private programsService: ProgramsService,
    private coursesService: CoursesService,
    private location: Location,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.createForm();
  }

  createForm() {
    this.updateForm = this.fb.group({
      titleEn: ['', Validators.required],
      titleAr: ['', Validators.required],
      slugEn: ['', Validators.required],
      slugAr: ['', Validators.required],
      descriptionEn: ['', Validators.required],
      descriptionAr: ['', Validators.required],
      levelEn: ['', Validators.required],
      levelAr: ['', Validators.required],
      categoryEn: ['', Validators.required],
      categoryAr: ['', Validators.required],
      language: ['', Validators.required],
      totalDuration: [0, [Validators.required, Validators.min(0)]],
      thumbnail: ['', Validators.required],
      learningOutcomes: this.fb.array([])
    });
  }

  ngOnInit() {
    const programId = this.route.snapshot.paramMap.get('id');
    if (programId) {
      this.loadProgram(programId);
    }
  }

  loadProgram(programId: string) {
    this.loading = true;
    this.programsService.getProgramById(programId).subscribe({
      next: (program) => {
        this.program = program;
        this.courseDetails = program.courseDetails || [];
        console.log('Program Course Details:', this.courseDetails);
        this.loading = false;
        this.loadCourses();
      },
      error: (error) => {
        console.error('Error loading program:', error);
        this.loading = false;
      }
    });
  }

  loadCourses() {
    this.coursesService.getCourses().subscribe({
      next: (courses) => {
        this.allCourses = courses;
        this.updateUnassociatedCourses();
      },
      error: (error) => {
        console.error('Error loading courses:', error);
      }
    });
  }

  openUpdateDetailsForm(program: program): void {
    this.selectedProgram = program;
    this.updateForm.patchValue({
      titleEn: program.title?.en || '',
      titleAr: program.title?.ar || '',
      slugEn: program.slug?.en || '',
      slugAr: program.slug?.ar || '',
      descriptionEn: program.description?.en || '',
      descriptionAr: program.description?.ar || '',
      levelEn: program.level?.en || '',
      levelAr: program.level?.ar || '',
      categoryEn: program.category?.en || '',
      categoryAr: program.category?.ar || '',
      language: program.language || '',
      totalDuration: program.totalDuration || 0,
      thumbnail: program.thumbnail || ''
    });

    // Clear existing learning outcomes
    while (this.learningOutcomesArray.length) {
      this.learningOutcomesArray.removeAt(0);
    }

    // Add existing learning outcomes
    if (program.learningOutcomes) {
      program.learningOutcomes.forEach((outcome: any) => {
        const outcomeGroup = this.fb.group({
          en: [outcome.en || '', Validators.required],
          ar: [outcome.ar || '', Validators.required]
        });
        this.learningOutcomesArray.push(outcomeGroup);
      });
    }

    this.dialog.open(this.updateDetailsDialog, {
      width: '1200px',
      maxHeight: '90vh'
    });
  }

  get learningOutcomesArray() {
    return this.updateForm.get('learningOutcomes') as FormArray;
  }

  addLearningOutcome() {
    const outcomeGroup = this.fb.group({
      en: ['', Validators.required],
      ar: ['', Validators.required]
    });
    this.learningOutcomesArray.push(outcomeGroup);
  }

  removeLearningOutcome(index: number) {
    this.learningOutcomesArray.removeAt(index);
  }

  updateProgram(): void {
    if (this.updateForm.valid) {
      const formValue = this.updateForm.value;
      const updatedProgram = {
        _id: this.selectedProgram._id,
        title: {
          en: formValue.titleEn,
          ar: formValue.titleAr
        },
        slug: {
          en: formValue.slugEn,
          ar: formValue.slugAr
        },
        description: {
          en: formValue.descriptionEn,
          ar: formValue.descriptionAr
        },
        level: {
          en: formValue.levelEn,
          ar: formValue.levelAr
        },
        category: {
          en: formValue.categoryEn,
          ar: formValue.categoryAr
        },
        language: formValue.language,
        totalDuration: formValue.totalDuration,
        thumbnail: formValue.thumbnail,
        learningOutcomes: formValue.learningOutcomes.map((outcome: any) => ({
          en: outcome.en,
          ar: outcome.ar
        })),
        courses: this.selectedProgram.courses,
        courseDetails: this.selectedProgram.courseDetails,
        createdAt: this.selectedProgram.createdAt,
        updatedAt: this.selectedProgram.updatedAt,
        __v: this.selectedProgram.__v
      };

      this.programsService.updateProgram(updatedProgram).subscribe({
        next: (response) => {
          this.program = response;
          this.dialog.closeAll();
        },
        error: (error) => {
          console.error('Error updating program:', error);
        }
      });
    }
  }

  updateUnassociatedCourses() {
    if (this.program && this.allCourses) {
      this.unassociatedCourses = this.allCourses.filter(course =>
        !this.program.courses.includes(course._id)
      );
    }
  }

  addCourseToProgram() {
    if (this.selectedCourseId && this.program) {
      this.programsService.addCourseToProgram(this.program._id, this.selectedCourseId).subscribe({
        next: (updatedProgram) => {
          this.program = updatedProgram;
          this.courseDetails = updatedProgram.courseDetails;
          this.updateUnassociatedCourses();
          this.selectedCourseId = null;
        },
        error: (error) => {
          console.error('Error adding course to program:', error);
          alert('Failed to add course to program. Please try again.');
        }
      });
    }
  }

  removeCourseFromProgram(courseId: string) {
    if (this.program) {
      this.programsService.removeCourseFromProgram(this.program._id, courseId).subscribe({
        next: (updatedProgram) => {
          this.program = updatedProgram;
          this.courseDetails = updatedProgram.courseDetails;
          this.updateUnassociatedCourses();
        },
        error: (error) => {
          console.error('Error removing course from program:', error);
          alert('Failed to remove course from program. Please try again.');
        }
      });
    }
  }

  deleteProgram(): void {
    if (this.program) {
      if (confirm('Are you sure you want to delete this program?')) {
        this.programsService.deleteProgram(this.program._id).subscribe({
          next: () => {
            this.goBack();
          }
        });
        alert('Program deleted successfully');
      }
    }
  }

  goBack(): void {
    this.location.back();
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }
}