import { Component, ViewChild, TemplateRef } from '@angular/core';
import { ProgramsService } from '../../services/programs.service';
import { program } from '../../interfaces/program.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { TitleCasePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [
    CommonModule, // Add this line
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    TitleCasePipe,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule, MatSelectModule, MatChipsModule,

  ],
  templateUrl: './programs.component.html',
  styleUrl: './programs.component.scss'
})
export class ProgramsComponent {

  categories: any[] = []; // Store full category objects
  programFields: string[] = []; // You can keep this for display if needed
  displayedColumns: string[] = ['title', 'level', 'language', 'category', 'totalDuration', 'Courses', 'actions'];
  programs: program[] = [];
  addForm: FormGroup;
  updateForm: FormGroup;
  selectedProgram: any;
  selectedField: string | null = null;
  searchQuery: string = '';
  filteredPrograms: program[] = [];

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
      courses: [[]],
      learningOutcomes: this.fb.array([]),
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
      learningOutcomes: this.fb.array([]),
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
        this.programFields = categories.map(category => category.name.en); // For backward compatibility
      },
      error: (error) => {
        console.error('Failed to load categories:', error);
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

  loadPrograms() {
    this.programService.getPrograms().subscribe({
      next: (data) => {
        this.programs = data;
        this.filteredPrograms = [...data];
      }
    });
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
      const updatedProgram = { ...this.selectedProgram, ...this.updateForm.value };
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

  @ViewChild('addDialog') addDialog!: TemplateRef<any>;
  @ViewChild('updateDialog') updateDialog!: TemplateRef<any>;

  openAddForm() {
    this.addForm.reset();
    this.dialog.open(this.addDialog, {
      width: '600px'
    });
  }

  openUpdateForm(program: program, event?: MouseEvent) {
    if (event) event.stopPropagation();
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
    this.dialog.open(this.updateDialog, {
      width: '600px'
    });
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
    return category._id; // or any unique identifier from your category object
  }
}

