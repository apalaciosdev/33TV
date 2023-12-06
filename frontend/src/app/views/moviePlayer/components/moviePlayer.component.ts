import { Component, OnInit } from '@angular/core';
import { AppSettings } from 'src/app/app.settings';
import { RequestService } from 'src/app/shared/services/request.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  public data: any[] = [];
  query: string = '';

  constructor(
    public requestService: RequestService
  ) { }

  ngOnInit() {

  }

  public searchMedia() {
    this.requestService.get<any>(AppSettings.API_SEARCH_MEDIA + this.query).subscribe((res) => {
      this.data = res.searchResponse;
    });
  }
}
