import { Component } from '@angular/core';
import { ProgramsService } from '../../services/programs.service';
import { program } from '../../interfaces/program.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';



@Component({
  selector: 'app-programs',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule
  ],
  templateUrl: './programs.component.html',
  styleUrl: './programs.component.scss'
})
export class ProgramsComponent {
  displayedColumns: string[] = ['title', 'level', 'language', "category", "totalDuration",];
  programs: program[] = [];
  constructor(private programService: ProgramsService) { }


  ngOnInit() {
    console.log("Getting the data");
    this.loadPrograms();
  }
  loadPrograms() {
    this.programService.getPrograms().subscribe({
      next: (data) => {
        this.programs = data
        console.log(this.programs);
      }
    })
  }
}
