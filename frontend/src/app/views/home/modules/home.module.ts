import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AppRoutingModule } from '../../../app-routing.module';
import { SharedModule } from '../../../shared/module/shared.module';
import { HomeComponent } from '../components/home.component';
import { LinksSelectorComponent } from '../components/linksSelector/linksSelector.component';
import { VideoPlayerComponent } from '../components/videoPlayer/videoPlayer.component';
import { MediaSelectorComponent } from '../components/mediaSelector/mediaSelector.component';



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
    LinksSelectorComponent,
    VideoPlayerComponent,
    MediaSelectorComponent
  ],
  declarations: [
    HomeComponent,
    LinksSelectorComponent,
    VideoPlayerComponent,
    MediaSelectorComponent
  ]
})
export class HomeModule { }
