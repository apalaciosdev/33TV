import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  query: string = '';

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
 
  }

  public searchMedia() {
    this.router.navigate(['/search'], { queryParams: {query: this.query} })
    this.query = '';
  }
}
