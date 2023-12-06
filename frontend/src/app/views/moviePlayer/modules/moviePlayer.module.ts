import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AppRoutingModule } from '../../../app-routing.module';
import { SharedModule } from '../../../shared/module/shared.module';
import { HomeComponent } from '../components/home.component';
import { TeamsContainerComponent } from '../components/teamsContainer/teams-container.component';


@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    TranslateModule.forChild({}),
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    HomeComponent,
    TeamsContainerComponent
  ],
  declarations: [
    HomeComponent,
    TeamsContainerComponent
  ]
})
export class HomeModule { }
