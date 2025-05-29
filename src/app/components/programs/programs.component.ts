import { Component, ViewChild, TemplateRef } from '@angular/core';
import { ProgramsService } from '../../services/programs.service';
import { CategoryService } from '../../services/category.service';
import { Program } from '../../interfaces/program.interface';
import { MultilingualString } from '../../interfaces/multilingual-string.interface';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { TitleCasePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [
    CommonModule, MatButtonModule, MatIconModule, MatCardModule,
    MatTableModule, TitleCasePipe, MatDialogModule, FormsModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatChipsModule
  ],
  templateUrl: './programs.component.html',
  styleUrl: './programs.component.scss'
})
export class ProgramsComponent {
  categories: any[] = [];
  programFields: string[] = [];
  displayedColumns: string[] = ['title', 'level', 'language', 'category', 'totalDuration', 'Courses', 'actions'];
  programs: Program[] = [];
  filteredPrograms: Program[] = [];
  addForm: FormGroup;
  updateForm: FormGroup;
  selectedProgram: any;
  selectedField: string | null = null;
  searchQuery: string = '';

  @ViewChild('addDialog') addDialog!: TemplateRef<any>;
  @ViewChild('updateDialog') updateDialog!: TemplateRef<any>;

  constructor(
    private programService: ProgramsService,
    private categoriesService: CategoryService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.addForm = this.fb.group({
      title: this.fb.group({
        en: ['', Validators.required],
        ar: ['', Validators.required]
      }),
      slug: this.fb.group({
        en: ['', Validators.required],
        ar: ['', Validators.required]
      }),
      description: this.fb.group({
        en: ['', Validators.required],
        ar: ['', Validators.required]
      }),
      thumbnail: ['', Validators.required],
      level: this.fb.group({
        en: ['', Validators.required],
        ar: ['', Validators.required]
      }),
      language: ['', Validators.required],
      totalDuration: ['', Validators.required],
      category: this.fb.group({
        en: ['', Validators.required],
        ar: ['', Validators.required]
      }),
      courses: [[]], // string[]
      learningOutcomes: this.fb.array([]), // MultilingualString[]
    });

    this.updateForm = this.fb.group({
      title: this.fb.group({
        en: ['', Validators.required],
        ar: ['', Validators.required]
      }),
      slug: this.fb.group({
        en: ['', Validators.required],
        ar: ['', Validators.required]
      }),
      description: this.fb.group({
        en: ['', Validators.required],
        ar: ['', Validators.required]
      }),
      thumbnail: ['', Validators.required],
      level: this.fb.group({
        en: ['', Validators.required],
        ar: ['', Validators.required]
      }),
      language: ['', Validators.required],
      totalDuration: ['', Validators.required],
      category: this.fb.group({
        en: ['', Validators.required],
        ar: ['', Validators.required]
      }),
      courses: [[]],
      learningOutcomes: this.fb.array([]), // MultilingualString[]
    });
  }

  ngOnInit() {
    this.loadPrograms();
    this.loadCategories();
  }

  loadCategories() {
    this.categoriesService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.programFields = categories.map(category => category.name.en);
      },
      error: (error) => {
        console.error('Failed to load categories:', error);
      }
    });
  }

  loadPrograms() {
    this.programService.getPrograms().subscribe({
      next: (data) => {
        this.programs = data;
        this.filteredPrograms = [...data];
      }
    });
  }

  applySearchFilter() {
    let filtered = [...this.programs];
    if (this.selectedField) {
      filtered = filtered.filter(program =>
        program.category.en.toLowerCase() === this.selectedField?.toLowerCase()
      );
    }
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(program =>
        program.title.en.toLowerCase().includes(query) ||
        program.category.en.toLowerCase().includes(query) ||
        program.language.toLowerCase().includes(query)
      );
    }
    this.filteredPrograms = filtered;
  }

  addLearningOutcome(form: FormGroup) {
    (<FormArray>form.get('learningOutcomes')).push(
      this.fb.group({
        en: ['', Validators.required],
        ar: ['', Validators.required]
      })
    );
  }

  removeLearningOutcome(form: FormGroup, index: number) {
    (<FormArray>form.get('learningOutcomes')).removeAt(index);
  }

  addProgram() {
    if (this.addForm.valid) {
      const formValue = this.addForm.value;
      if (!Array.isArray(formValue.courses)) {
        formValue.courses = [];
      }
      this.programService.addProgram(formValue).subscribe({
        next: () => {
          this.loadPrograms();
          this.dialog.closeAll();
        }
      });
    }
  }

  updateProgram() {
    if (this.updateForm.valid) {
      const updatedProgram = { _id: this.selectedProgram._id, ...this.updateForm.value };
      this.programService.updateProgram(updatedProgram).subscribe({
        next: () => {
          this.loadPrograms();
          this.dialog.closeAll();
        }
      });
    }
  }

  deleteProgram(id: string, event?: MouseEvent) {
    if (event) event.stopPropagation();
    if (confirm('Are you sure you want to delete this program?')) {
      this.programService.deleteProgram(id).subscribe({
        next: () => {
          this.loadPrograms();
        }
      });
    }
  }

  openAddForm() {
    this.addForm.reset();
    (<FormArray>this.addForm.get('learningOutcomes')).clear();
    this.dialog.open(this.addDialog, {
      width: '600px'
    });
  }

  openUpdateForm(program: Program, event?: MouseEvent) {
    if (event) event.stopPropagation();
    this.selectedProgram = program;

    this.updateForm.patchValue({
      title: program.title,
      slug: program.slug,
      description: program.description,
      thumbnail: program.thumbnail,
      level: program.level,
      language: program.language,
      totalDuration: program.totalDuration,
      category: program.category,
      courses: program.courses ?? []
    });

    (<FormArray>this.updateForm.get('learningOutcomes')).clear();
    if (program.learningOutcomes && Array.isArray(program.learningOutcomes)) {
      program.learningOutcomes.forEach(lo =>
        (<FormArray>this.updateForm.get('learningOutcomes')).push(
          this.fb.group({ en: [lo.en, Validators.required], ar: [lo.ar, Validators.required] })
        )
      );
    }

    this.dialog.open(this.updateDialog, { width: '600px' });
  }

  onFieldClick(field: string) {
    if (this.selectedField === field) {
      this.selectedField = null;
      this.filteredPrograms = [...this.programs];
    } else {
      this.selectedField = field;
      this.filteredPrograms = this.programs.filter(program =>
        program.category.en.toLowerCase() === field.toLowerCase()
      );
    }
  }

  viewProgramDetails(programId: string) {
    this.router.navigate(['/programs', programId]);
  }

  trackByCategoryId(index: number, category: any): string {
    return category._id;
  }
}