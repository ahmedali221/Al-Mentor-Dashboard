import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProgramsService } from '../../services/programs.service';
import { CoursesService } from '../../services/course.service';
import { program } from '../../interfaces/program.interface';
import { CommonModule, Location } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatList, MatListItem } from '@angular/material/list';
import { Course } from '../../interfaces/course';

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

  program!: program;
  loading = true;
  updateForm!: FormGroup;
  selectedProgram!: program;
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
  ) {
    this.createForm();
  }

  createForm() {
    this.updateForm = this.fb.group({
      title: ['', Validators.required],
      slug: ['', Validators.required],
      description: ['', Validators.required],
      thumbnail: ['', Validators.required],
      level: ['', Validators.required],
      language: ['', Validators.required],
      category: ['', Validators.required],      totalDuration: ['', Validators.required]
    });
  }

  ngOnInit() {
    const programId = this.route.snapshot.paramMap.get('id');
    if (programId) {
      this.programsService.getProgramById(programId).subscribe({
        next: (program) => {
          this.program = {
            ...program,
            courses: program.courses?.map(c => ({
              ...c,
              title: {
                en: c.title?.en || 'Untitled Course',
                ar: c.title?.ar || ''
              },
            })) || []
          };
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
        this.updateUnassociatedCourses();
      }
    });
  }

  openUpdateDetailsForm(program: program): void {
    this.selectedProgram = program;
    this.updateForm.patchValue({
      title: program.title,
      slug: program.slug,
      description: program.description,
      thumbnail: program.thumbnail,
      level: program.level,
      language: program.language,
      category: program.category,
      totalDuration: program.totalDuration
    });

    this.dialog.open(this.updateDetailsDialog, {
      width: '800px'
    });
  }

  updateProgram(): void {
    if (this.updateForm.valid) {
      const updatedProgram = { ...this.selectedProgram, ...this.updateForm.value };
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
      this.unassociatedCourses = this.allCourses.filter(course =>
        !this.program.courses.some(programCourse => programCourse._id === course._id)
      );
    }
  }

  addCourseToProgram() {
    if (this.selectedCourseId && this.program) {
      const courseToAdd = this.allCourses.find(c => c._id === this.selectedCourseId);
      if (courseToAdd) {
        this.program.courses.push(courseToAdd);
        this.programsService.updateProgram(this.program).subscribe({
          next: () => {
            this.updateUnassociatedCourses();
            this.selectedCourseId = null;
          }
        });
      }
    }
  }

  removeCourseFromProgram(courseId: string) {
    if (this.program) {
      this.program.courses = this.program.courses.filter(c => c._id !== courseId);
      this.programsService.updateProgram(this.program).subscribe({
        next: () => {
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
        alert('Program deleted successfully');
      }
    }
  }

  goBack(): void {
    this.location.back();
  }
}