import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { AppSettings } from 'src/app/app.settings';
import { RequestService } from 'src/app/shared/services/request.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss']
})
export class DiscoverComponent implements OnInit {
  public data: any[] = [];
  type: string = '';
  page: number = 0;
  filter: string = '';
  lastQuery: string = '';

  constructor(
    public requestService: RequestService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.type = params['type'];
      this.page = params['page'];
      this.filter = params['filter'];
      this.searchMedia();
    });

    this.router.events
    .pipe(filter((event) => event instanceof NavigationEnd))
    .subscribe(() => {
      window.scrollTo(0, 0);
    });
  }

  public searchMedia() {
    this.requestService.post<any>(AppSettings.API_GET_MULTI_MEDIA_PAGE, {type: this.type, query: this.page, filter: this.filter}).subscribe((res) => {
      this.data = res;
    });
  }

  public async goToPage(type: string) {
    if (type === 'previous'){
      this.page --;
    }
    if (type === 'next'){
      this.page ++;
    }
    this.router.navigate(['/discover/' + this.type + "/" + this.page + "/" + (this.filter.length > 0 ? this.filter : ' ')]);
  }

  public async goToFilter(type: string) {
    this.filter = type;
    this.page = 1;
    this.router.navigate(['/discover/' + this.type + "/" + this.page + "/" + (this.filter.length > 0 ? this.filter : ' ')]);
  }


 
  public goTo(link: string, dataType: string) {
    if (dataType === 'movie') {
      this.router.navigate(['/player'], { queryParams: {query: link} })
    } else {
      this.router.navigate(['/select-link', link], { queryParams: {query: link} })
    }
  }
}
