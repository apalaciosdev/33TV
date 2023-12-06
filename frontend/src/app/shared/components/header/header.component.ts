import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Teams } from 'src/app/views/home/models/home.models';
import { RequestService } from '../../services/request.service';
import { AppSettings } from 'src/app/app.settings';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  query: string = '';

  constructor(
    public requestService: RequestService,
    private router: Router
  ) { }

  ngOnInit() {
 
  }

  public searchMedia() {
    this.router.navigate(['/search'], { queryParams: {query: this.query} })
    this.query = '';
  }
  
}
