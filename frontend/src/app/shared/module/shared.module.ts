import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
// import { TranslateModule } from '@ngx-translate/core';

import { AppRoutingModule } from '../../app-routing.module';
import { HeaderComponent } from '../components/header/header.component';
import { DocsComponent } from '../components/docs/docs.component';
import { QrCodeComponent } from '../components/qr/qr.component';


@NgModule({
  imports: [
    CommonModule,
    // TranslateModule.forChild({}),
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    // FilterPipeModule,
    // NgxPaginationModule,
    RouterModule,
    // NgxObjectDiffModule
    
  ],
  exports: [
    HeaderComponent,
    DocsComponent,
    QrCodeComponent
    
  ],
  declarations: [
    HeaderComponent,
    DocsComponent,
    QrCodeComponent
   
  ],

  providers: [
    DatePipe,
    DecimalPipe,
  ]

})
export class SharedModule { }
