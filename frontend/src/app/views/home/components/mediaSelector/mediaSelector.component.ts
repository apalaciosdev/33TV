import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AppSettings } from 'src/app/app.settings';
import { RequestService } from 'src/app/shared/services/request.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-mediaSelector',
  templateUrl: './mediaSelector.component.html',
  styleUrls: ['./mediaSelector.component.scss']
})
export class MediaSelectorComponent implements OnInit {
  public data: any[] = [];
  query: string = '';
  lastQuery: string = '';

  constructor(
    public requestService: RequestService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.query = params['query'];
      this.searchMedia();
    });
  }

  public searchMedia() {
    this.requestService.get<any>(AppSettings.API_SEARCH_MEDIA + this.query).subscribe((res) => {
      this.data = res;
    });
    this.lastQuery = this.query;
  }
 
  public goTo(link: string, dataType: string) {
    if (dataType === 'movie') {
      this.router.navigate(['/player'], { queryParams: {query: link} })
    } else {
      this.router.navigate(['/select-link', link], { queryParams: {query: link} })
    }
  }
}
