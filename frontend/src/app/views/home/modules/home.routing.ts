import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from 'src/app/shared/authguard.guard';

//Components
import { HomeComponent } from '../components/home.component';
import { LinksSelectorComponent } from '../components/linksSelector/linksSelector.component';
import { VideoPlayerComponent } from '../components/videoPlayer/videoPlayer.component';
import { MediaSelectorComponent } from '../components/mediaSelector/mediaSelector.component';



const routes: Routes = [

  {path: '', component: HomeComponent},
  {path: 'search', component: MediaSelectorComponent},
  {path: 'select-link/:link', component: LinksSelectorComponent},
  {path: 'player', component: VideoPlayerComponent},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class HomeRoutingModule { }