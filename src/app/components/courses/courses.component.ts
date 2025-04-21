import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Course } from '../../interfaces/course';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-courses',
  imports: [MatIcon, MatButtonModule, MatTableModule, MatCardModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent {
  courses: Course[] = []
  displayedColumns: string[] = ['title', 'language', 'instructor', 'level', 'duration', 'rating', 'enrollmentCount'];

  constructor(private courseService: CourseService) { }
  ngOnInit(): void {
    console.log("Courses Fetched")
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getCourses().subscribe(data => {
      this.courses = data;
      console.log(this.courses)
      this.courses.forEach(e => console.log(e))
    });
  }
}
