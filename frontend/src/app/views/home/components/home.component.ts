import { Component, OnInit } from '@angular/core';
import { AppSettings } from 'src/app/app.settings';
import { RequestService } from 'src/app/shared/services/request.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public data: any[] = [];
  query: string = '';

  constructor(
    public requestService: RequestService,
    private router: Router
  ) { }

  ngOnInit() {
 
  }

  public searchMedia() {
    this.router.navigate(['/search'], { queryParams: {query: this.query} })
  }
}
