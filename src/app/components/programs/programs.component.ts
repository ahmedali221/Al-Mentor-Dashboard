import { Component, ViewChild, TemplateRef } from '@angular/core';
import { ProgramsService } from '../../services/programs.service';
import { program } from '../../interfaces/program.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { TitleCasePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';


@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    TitleCasePipe,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule, MatSelectModule, MatChipsModule

  ],
  templateUrl: './programs.component.html',
  styleUrl: './programs.component.scss'
})
export class ProgramsComponent {
  readonly programFields: string[] = ['technology', 'business', 'language'];
  displayedColumns: string[] = ['title', 'level', 'language', 'category', 'totalDuration', 'Courses', 'actions'];
  programs: program[] = [];
  addForm: FormGroup;
  updateForm: FormGroup;
  selectedProgram: any;
  selectedField: string | null = null;

  constructor(
    private programService: ProgramsService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router // Add this
  ) {
    this.addForm = this.fb.group({
      title: ['', Validators.required],
      slug: ['', Validators.required],
      description: ['', Validators.required],
      thumbnail: ['', Validators.required],
      level: ['', Validators.required],
      language: ['', Validators.required],
      category: ['', Validators.required],
      totalDuration: ['', Validators.required]
    });

    this.updateForm = this.fb.group({
      title: ['', Validators.required],
      slug: ['', Validators.required],
      description: ['', Validators.required],
      thumbnail: ['', Validators.required],
      level: ['', Validators.required],
      language: ['', Validators.required],
      category: ['', Validators.required],
      totalDuration: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadPrograms();
  }

  searchQuery: string = '';
  filteredPrograms: program[] = [];

  applySearchFilter() {
    let filtered = [...this.programs];

    if (this.selectedField) {
      filtered = filtered.filter(program =>
        program.category.toLowerCase() === this.selectedField?.toLowerCase()
      );
    }

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(program =>
        program.title.toLowerCase().includes(query) ||
        program.category.toLowerCase().includes(query) ||
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
      this.programService.addProgram(this.addForm.value).subscribe({
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

  deleteProgram(id: string) {
    if (confirm('Are you sure you want to delete this program?')) {
      this.programService.deleteProgram(id).subscribe({
        next: () => {
          this.loadPrograms();
        }
      });
    }
  }

  getTotalICourses(): number {
    if (!this.programs) return 0;
    return this.programs.reduce((total, program) => {
      return total + (program.coursesDetails?.length || 0);
    }, 0);
  }

  @ViewChild('addDialog') addDialog!: TemplateRef<any>;

  openAddForm() {
    this.addForm.reset();
    this.dialog.open(this.addDialog, {
      width: '600px'
    });
  }

  @ViewChild('updateDialog') updateDialog!: TemplateRef<any>;
  openUpdateForm(program: program) {
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
      // If clicking the already selected field, reset the filter
      this.selectedField = null;
      this.filteredPrograms = [...this.programs];
    } else {
      // Filter by the selected category
      this.selectedField = field;
      this.filteredPrograms = this.programs.filter(program =>
        program.category.toLowerCase() === field.toLowerCase()
      );
    }
  }

  // Add this method
  viewProgramDetails(programId: string) {
    this.router.navigate(['/programs', programId]);
  }
}