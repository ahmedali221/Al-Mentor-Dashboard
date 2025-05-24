import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CoursesService } from '../../services/course.service';
import { TopicsService } from '../../services/topics.service';
import { CategoryService } from '../../services/category.service';
import { InstructorsService } from '../../services/instructors.service';
import { SubtopicsService } from '../../services/subtopics.service';
import { Course } from '../../interfaces/course';
import { Topic } from '../../interfaces/topic.interface';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule,
  ],
})
export class CoursesComponent implements OnInit {
  @ViewChild('addDialog') addDialog!: TemplateRef<any>;
  @ViewChild('updateDialog') updateDialog!: TemplateRef<any>;

  courses: Course[] = [];
  filteredCourses: Course[] = [];
  topics: Topic[] = [];
  categories: any[] = [];
  instructors: any[] = [];
  subtopics: any[] = [];
  displayedColumns: string[] = ['title', 'instructorName', 'slug', 'availableLanguages', 'lessonsCount', 'actions'];
  searchControl = new FormControl('');
  selectedTopic = new FormControl('');
  course: any;
  selectedCourse: any;
  addForm!: FormGroup;
  updateForm!: FormGroup;

  constructor(
    private coursesService: CoursesService,
    private topicsService: TopicsService,
    private categoryService: CategoryService,
    private instructorsService: InstructorsService,
    private subtopicsService: SubtopicsService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.initializeForms();
  }

  ngOnInit() {
    this.loadCourses();
    this.loadTopics();
    this.loadCategories();
    this.loadInstructors();
    this.loadSubtopics();

    this.searchControl.valueChanges.subscribe(() => {
      this.filterCourses();
    });

    this.selectedTopic.valueChanges.subscribe(() => {
      this.filterCoursesTopic();
    });
  }

  initializeForms() {
    this.addForm = this.fb.group({
      title: this.fb.group({
        en: ['', Validators.required],
        ar: ['', Validators.required],
      }),
      slug: this.fb.group({
        en: ['', Validators.required],
        ar: ['', Validators.required],
      }),
      description: this.fb.group({
        en: ['', Validators.required],
        ar: ['', Validators.required],
      }),
      shortDescription: this.fb.group({
        en: [''],
        ar: [''],
      }),
      topic: ['', Validators.required],
      subtopic: [''],
      instructor: ['', Validators.required],
      category: ['', Validators.required],
      level: this.fb.group({
        en: ['beginner', Validators.required],
        ar: ['مبتدئ', Validators.required],
      }),
      duration: [0, [Validators.required, Validators.min(1)]],
      isFree: [false],
      thumbnailImgUrl: [''],
      availableLanguages: [[]],
    });

    this.updateForm = this.fb.group({
      _id: [''],
      title: this.fb.group({
        en: ['', Validators.required],
        ar: [''],
      }),
      slug: this.fb.group({
        en: ['', Validators.required],
        ar: ['', Validators.required],
      }),
      description: this.fb.group({
        en: ['', Validators.required],
        ar: [''],
      }),
      topicId: ['', Validators.required],
      instructor: ['', Validators.required],
      thumbnailImgUrl: [''],
      availableLanguages: [[]],
    });
  }

  get totalCourses(): number {
    return this.courses.length;
  }

  get activeCourses(): number {
    return this.courses.filter((course) => course.status === 'Active').length;
  }

  loadCourses() {
    this.coursesService.getCourses().subscribe(
      (data: Course[]) => {
        this.courses = data;
        this.filteredCourses = data;
      },
      (error) => {
        console.error('Error loading courses:', error);
        alert('Failed to load courses. Please try again later.');
      }
    );
  }

  loadTopics(): void {
    this.topicsService.getTopics().subscribe({
      next: (topics) => {
        this.topics = topics;
      },
      error: (error) => {
        console.error('Error loading topics:', error);
        alert('Failed to load topics. Please try again later.');
      },
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        alert('Failed to load categories. Please try again later.');
      },
    });
  }

  loadInstructors() {
    this.instructorsService.getInstructors().subscribe({
      next: (instructors) => {
        this.instructors = instructors;
      },
      error: (err) => {
        console.error('Error loading instructors:', err);
        alert('Failed to load instructors. Please try again later.');
      },
    });
  }

  loadSubtopics() {
    this.subtopicsService.getAllSubTopics().subscribe({
      next: (subtopics) => {
        this.subtopics = subtopics;
      },
      error: (err) => {
        console.error('Error loading subtopics:', err);
        alert('Failed to load subtopics. Please try again later.');
      },
    });
  }

  openAddForm() {
    this.addForm.reset({
      title: { en: '', ar: '' },
      description: { en: '', ar: '' },
      availableLanguages: ['en'],
    });

    setTimeout(() => {
      this.dialog.open(this.addDialog, {
        width: '800px',
      });
    });
  }

  openUpdateForm(course: Course) {
    this.selectedCourse = course;
    this.updateForm.patchValue({
      _id: course._id,
      title: {
        en: course.title?.en || '',
        ar: course.title?.ar || '',
      },
      slug: {
        en: course.slug?.en || '',
        ar: course.slug?.ar || '',
      },
      description: {
        en: course.description?.en || '',
        ar: course.description?.ar || '',
      },
      topicId: course.topic || '',
      instructor: course.instructor || '',
      thumbnailImgUrl: course.thumbnailImgUrl || '',
      availableLanguages: course.availableLanguages || ['en', 'ar'],
    });

    this.dialog.open(this.updateDialog, {
      width: '800px',
      data: { course: course },
    });
  }

  addNewCourse() {
    if (this.addForm.valid) {
      const formValue = this.addForm.value;

      const newCourse: Partial<Course> = {
        title: {
          en: formValue.title.en.trim(),
          ar: formValue.title.ar.trim(),
        },
        slug: {
          en: formValue.slug.en.trim(),
          ar: formValue.slug.ar.trim(),
        },
        description: {
          en: formValue.description.en.trim(),
          ar: formValue.description.ar.trim(),
        },
        shortDescription: {
          en: formValue.shortDescription.en.trim(),
          ar: formValue.shortDescription.ar.trim(),
        },
        topic: formValue.topic,
        subtopic: formValue.subtopic,
        instructor: formValue.instructor,
        category: formValue.category,
        level: {
          en: formValue.level.en,
          ar: formValue.level.ar,
        },
        duration: formValue.duration,
        isFree: formValue.isFree,
        thumbnailImgUrl: formValue.thumbnailImgUrl.trim(),
        availableLanguages: formValue.availableLanguages,
        createdAt: new Date(),
        updatedAt: new Date(),
        enrollmentCount: 0,
        rating: { average: 0, count: 0 },
      };

      this.coursesService.addCourse(newCourse).subscribe({
        next: () => {
          this.loadCourses();
          this.dialog.closeAll();
        },
        error: (error) => {
          console.error('Error creating course:', error);
          alert('Failed to add course. Please ensure all required fields are correctly filled.');
        },
      });
    } else {
      this.addForm.markAllAsTouched();
      alert('Please complete all required fields before submitting.');
    }
  }

  updateCourse() {
    if (this.updateForm.valid && this.selectedCourse?._id) {
      this.coursesService.updateCourse(this.selectedCourse._id, this.updateForm.value).subscribe({
        next: () => {
          this.loadCourses();
          this.dialog.closeAll();
        },
        error: (err) => {
          console.error('Update topic error:', err);
        },
      });
    }
  }

  deleteCourse(id: string) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.coursesService.deleteCourse(id).subscribe({
        next: () => {
          this.loadCourses();
        },
        error: (error) => {
          console.error('Error deleting course:', error);
        },
      });
    }
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  filterCourses() {
    const search = this.searchControl.value?.toLowerCase() || '';
    this.filteredCourses = this.courses.filter((course) => {
      const matchesSearch =
        course.title?.en?.toLowerCase().includes(search) ||
        course.slug?.en?.toLowerCase().includes(search) ||
        course.instructor?.toLowerCase().includes(search);
      return matchesSearch;
    });
  }

  filterCoursesTopic() {
    const topicId = this.selectedTopic.value;
    this.filteredCourses = this.courses.filter((course) => {
      return topicId === '' || course.topic === topicId;
    });
  }

  clearFilters() {
    this.searchControl.setValue('');
    this.selectedTopic.setValue('');
  }
}