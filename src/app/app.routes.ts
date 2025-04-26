import { Routes } from '@angular/router';
import { DashboardComponent } from './components/layout/dashboard/dashboard.component';
import { UsersComponent } from './components/users/users.component';
import { InstructorsComponent } from './components/instructors/instructors.component';
import { CoursesComponent } from './components/courses/courses.component';
import { ProgramsComponent } from './components/programs/programs.component';
import { TopicsComponent } from './components/topics/topics.component';
import { SubTopicsComponent } from './components/sub-topics/sub-topics.component';

export const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [
            { path: 'users', component: UsersComponent },
            { path: 'instructors', component: InstructorsComponent },
            { path: 'courses', component: CoursesComponent },
            { path: 'programs', component: ProgramsComponent },
            { path: 'topics', component: TopicsComponent },
            { path: 'SubTopics', component: SubTopicsComponent },
            { path: '', redirectTo: 'users', pathMatch: 'full' }
        ]
    }
];
