import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeRoutingModule } from './views/home/modules/home.routing';

const routes: Routes = [
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    HomeRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
