import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProgramsService } from '../../services/programs.service';
import { CoursesService } from '../../services/course.service';
import { Program } from '../../interfaces/program.interface';
import { Location, CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatList, MatListItem } from '@angular/material/list';
import { Course } from '../../interfaces/course';
import { MultilingualString } from '../../interfaces/multilingual-string.interface';

@Component({
  selector: 'app-program-details',
  standalone: true,
  imports: [
    CommonModule,
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
    MatFormFieldModule
  ],
  templateUrl: './program-details.component.html',
  styleUrls: ['./program-details.component.scss']
})
export class ProgramDetailsComponent implements OnInit {
  @ViewChild('updateDetailsDialog') updateDetailsDialog!: TemplateRef<any>;

  program!: Program;
  loading = true;
  updateForm!: FormGroup;
  selectedProgram!: Program;
  allCourses: Course[] = [];
  unassociatedCourses: Course[] = [];
  selectedCourseId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private programsService: ProgramsService,
    private coursesService: CoursesService,
    private location: Location,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  createForm(program?: Program) {
    this.updateForm = this.fb.group({
      title: this.fb.group({
        en: [program?.title?.en || '', Validators.required],
        ar: [program?.title?.ar || '', Validators.required]
      }),
      slug: this.fb.group({
        en: [program?.slug?.en || '', Validators.required],
        ar: [program?.slug?.ar || '', Validators.required]
      }),
      description: this.fb.group({
        en: [program?.description?.en || '', Validators.required],
        ar: [program?.description?.ar || '', Validators.required]
      }),
      thumbnail: [program?.thumbnail || '', Validators.required],
      level: this.fb.group({
        en: [program?.level?.en || '', Validators.required],
        ar: [program?.level?.ar || '', Validators.required]
      }),
      language: [program?.language || '', Validators.required],
      category: this.fb.group({
        en: [program?.category?.en || '', Validators.required],
        ar: [program?.category?.ar || '', Validators.required]
      }),
      totalDuration: [program?.totalDuration || '', Validators.required],
      courses: [program?.courses || []], // Array of string ids
      learningOutcomes: this.fb.array(
        (program?.learningOutcomes || []).map(outcome =>
          this.fb.group({
            en: [outcome.en, Validators.required],
            ar: [outcome.ar, Validators.required]
          })
        )
      )
    });
  }

  ngOnInit() {
    const programId = this.route.snapshot.paramMap.get('id');
    if (programId) {
      this.programsService.getProgramById(programId).subscribe({
        next: (program) => {
          this.program = program;
          this.createForm(this.program);
          this.loading = false;
          this.loadCourses();
          
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  loadCourses() {
    this.coursesService.getCourses().subscribe({
      next: (courses) => {
        this.allCourses = courses;
       this.addCourseToProgram();
        this.updateUnassociatedCourses();
      }
    });
  }

  openUpdateDetailsForm(program: Program): void {
    this.selectedProgram = program;
    this.createForm(program);

    this.dialog.open(this.updateDetailsDialog, {
      width: '800px'
    });
  }

  updateProgram(): void {
    if (this.updateForm.valid && this.selectedProgram) {
      const updatedProgram: Program = {
        ...this.selectedProgram,
        ...this.updateForm.value,
        courses: this.updateForm.value.courses
      };
      this.programsService.updateProgram(updatedProgram).subscribe({
        next: () => {
          this.program = updatedProgram;
          this.dialog.closeAll();
        }
      });
    }
  }

  updateUnassociatedCourses() {
    if (this.program && this.allCourses) {
      const courseIds = this.program.courses || [];
      this.unassociatedCourses = this.allCourses.filter(course =>
        !courseIds.includes(course._id)
      );
    }
  }

  addCourseToProgram() {
    if (this.selectedCourseId && this.program) {
      if (!this.program.courses.includes(this.selectedCourseId)) {
        const updatedCourses = [...this.program.courses, this.selectedCourseId];
        this.programsService
          .updateProgram({ ...this.program, courses: updatedCourses })
          .subscribe({
            next: (updated) => {
              this.program.courses = updated.courses;
              this.updateUnassociatedCourses();
              this.selectedCourseId = null;
            }
          });
      }
    }
  }

  removeCourseFromProgram(courseId: string) {
    if (this.program) {
      const updatedCourses = this.program.courses.filter(id => id !== courseId);
      this.programsService
        .updateProgram({ ...this.program, courses: updatedCourses })
        .subscribe({
          next: (updated) => {
            this.program.courses = updated.courses;
            this.updateUnassociatedCourses();
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
      }
    }
  }

  goBack(): void {
    this.location.back();
  }
}