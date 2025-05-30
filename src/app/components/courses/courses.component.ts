import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';
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
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class CoursesComponent implements OnInit {
  @ViewChild('addDialog') addDialog!: TemplateRef<any>;
  @ViewChild('updateDialog') updateDialog!: TemplateRef<any>;

  courses: Course[] = [];
  filteredCourses: Course[] = [];
  lessonsCount: number = 0;
  topics: Topic[] = [];
  categories: any[] = [];
  instructors: any[] = [];
  subtopics: any[] = [];

  displayedColumns: string[] = [
    'title',
    'instructorName',
    'slug',
    'language',
    'duration',
    'actions',
  ];

  searchControl = new FormControl('');
  selectedTopic = new FormControl('');
  selectedCourse?: Course;

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
      this.filterCoursesByTopic();
    });
  }

  // Validator for thumbnail URL
  thumbnailValidator(control: FormControl) {
    const value = control.value || '';
    if (
      value.startsWith('http://') ||
      value.startsWith('https://') ||
      value.startsWith('data:image/')
    ) {
      return null;
    }
    return { invalidThumbnail: true };
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
      language: this.fb.group({
        en: ['English', Validators.required],
        ar: ['الإنجليزية', Validators.required],
      }),
      duration: [0, [Validators.required, Validators.min(1)]],
      isFree: [false],
      thumbnail: ['', [Validators.required, this.thumbnailValidator]],
      freeLessons: [[]],
      enrollmentCount: [0],
      rating: this.fb.group({
        average: [0],
        count: [0],
      }),
      lastUpdated: [new Date()],
    });

    this.updateForm = this.fb.group({
      _id: [''],
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
        en: ['', Validators.required],
        ar: ['', Validators.required],
      }),
      language: this.fb.group({
        en: ['', Validators.required],
        ar: ['', Validators.required],
      }),
      duration: [0, [Validators.required, Validators.min(1)]],
      isFree: [false],
      thumbnail: ['', [Validators.required, this.thumbnailValidator]],
      freeLessons: [[]],
      enrollmentCount: [0],
      rating: this.fb.group({
        average: [0],
        count: [0],
      }),
      lastUpdated: [new Date()],
    });
  }

  get totalCourses(): number {
    return this.courses.length;
  }

  get activeCourses(): number {
    // Assuming 'status' is a UI-only field, optional on Course interface
    return this.courses.filter((course) => course.isFree === false).length;
  }

  loadCourses() {
    this.coursesService.getCourses().subscribe({
      next: (data: Course[]) => {
        this.courses = data;
        this.filteredCourses = data;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        alert('Failed to load courses. Please try again later.');
      },
    });
  }

  loadTopics() {
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
      slug: { en: '', ar: '' },
      description: { en: '', ar: '' },
      shortDescription: { en: '', ar: '' },
      topic: '',
      subtopic: '',
      instructor: '',
      category: '',
      level: { en: 'beginner', ar: 'مبتدئ' },
      language: { en: 'English', ar: 'الإنجليزية' },
      duration: 0,
      isFree: false,
      thumbnail: '',
      freeLessons: [],
      enrollmentCount: 0,
      rating: { average: 0, count: 0 },
      lastUpdated: new Date(),
    });

    setTimeout(() => {
      this.dialog.open(this.addDialog, { width: '800px' });
    });
  }

  openUpdateForm(course: Course) {
    this.selectedCourse = course;
    this.updateForm.patchValue({
      _id: course._id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      shortDescription: course.shortDescription || { en: '', ar: '' },
      topic: course.topic,
      subtopic: course.subtopic || '',
      instructor: course.instructor,
      category: course.category,
      level: course.level,
      language: course.language,
      duration: course.duration,
      isFree: course.isFree,
      thumbnail: course.thumbnail,
      freeLessons: course.freeLessons || [],
      enrollmentCount: course.enrollmentCount,
      rating: course.rating,
      lastUpdated: course.lastUpdated || new Date(),
    });

    this.dialog.open(this.updateDialog, { width: '800px', data: { course } });
  }

  buildCoursePayload(formValue: any) {
    return {
      title: formValue.title,
      slug: formValue.slug,
      description: formValue.description,
      shortDescription: formValue.shortDescription,
      topic: formValue.topic,
      subtopic: formValue.subtopic || null,
      instructor: formValue.instructor,
      category: formValue.category,
      level: formValue.level,
      language: formValue.language,
      duration: formValue.duration,
      isFree: formValue.isFree,
      thumbnail: formValue.thumbnail,
      freeLessons: formValue.freeLessons || [],
      enrollmentCount: formValue.enrollmentCount || 0,
      rating: formValue.rating || { average: 0, count: 0 },
      lastUpdated: formValue.lastUpdated || new Date(),
    };
  }

  addNewCourse() {
    if (this.addForm.valid) {
      const payload = this.buildCoursePayload(this.addForm.value);

      this.coursesService.addCourse(payload).subscribe({
        next: () => {
          this.loadCourses();
          this.dialog.closeAll();
        },
        error: (error) => {
          console.error('Error creating course:', error);
          alert(
            'Failed to add course. Please ensure all required fields are correctly filled.'
          );
        },
      });
    } else {
      this.addForm.markAllAsTouched();
      alert('Please complete all required fields before submitting.');
    }
  }

  updateCourse() {
    if (this.updateForm.valid && this.selectedCourse?._id) {
      const payload = this.buildCoursePayload(this.updateForm.value);

      this.coursesService.updateCourse(this.selectedCourse._id, payload).subscribe({
        next: () => {
          this.loadCourses();
          this.dialog.closeAll();
        },
        error: (err) => {
          console.error('Error updating course:', err);
          alert('Failed to update course. Please check the fields.');
        },
      });
    } else {
      this.updateForm.markAllAsTouched();
      alert('Please complete all required fields before submitting.');
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
          alert('Failed to delete course. Please try again.');
        },
      });
    }
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  filterCourses() {
    const search = this.searchControl.value?.toLowerCase() || '';
    this.filteredCourses = this.courses.filter((course) =>
      course.title.en.toLowerCase().includes(search) ||
      course.slug.en.toLowerCase().includes(search) ||
      (course.instructorDetails &&
        (
          course.instructorDetails.profile.firstName?.en?.toLowerCase().includes(search) ||
          course.instructorDetails.profile.lastName?.en?.toLowerCase().includes(search)
        )
      )
    );
  }

  filterCoursesByTopic() {
    const topicId = this.selectedTopic.value;
    this.filteredCourses = this.courses.filter((course) =>
      topicId === '' || course.topic === topicId
    );
  }

  clearFilters() {
    this.searchControl.setValue('');
    this.selectedTopic.setValue('');
  }
}