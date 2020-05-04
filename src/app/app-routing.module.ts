import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailedFilmComponent } from './pages/detailed-film/detailed-film.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { VerifyComponent } from './pages/verify/verify.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'film/:film_id', pathMatch: 'full', component: DetailedFilmComponent},
  // { path: 'profile', pathMatch: 'full', component: ProfileComponent },
  { path: 'login', pathMatch: 'full', component: LoginComponent },
  { path: 'signup', pathMatch: 'full', component: SignupComponent },
  { path: 'verify', pathMatch: 'full', component: VerifyComponent },
  { path: 'home', pathMatch: 'full', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
