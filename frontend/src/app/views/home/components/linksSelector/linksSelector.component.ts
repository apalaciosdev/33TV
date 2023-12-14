import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AppSettings } from 'src/app/app.settings';
import { RequestService } from 'src/app/shared/services/request.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-linksSelector',
  templateUrl: './linksSelector.component.html',
  styleUrls: ['./linksSelector.component.scss']
})
export class LinksSelectorComponent implements OnInit {
  public data: any[] = [];
  public info: any = {};
  public type: string = '';
  public link: string = '';
  safeHtmlArray: SafeHtml[] = [];
  public selectedIframe: number | null = null;
  openSeasons: { [key: string]: boolean } = {};
  seasonStatus: boolean[] = [];

  constructor(
    public requestService: RequestService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(async paramsId => {
      this.link = paramsId['link'];
      await this.getMediaLinks();
    });

    this.seasonStatus = new Array(this.data.length).fill(false);
  }

  toggleSeason(index: number): void {
    this.seasonStatus[index] = !this.seasonStatus[index];
  }

  isSeasonOpen(index: number): boolean {
    return this.seasonStatus[index];
  }

  public async getMediaLinks(serieLink?: string, type?: string) {
    this.link = serieLink ? AppSettings.GENERAL + '/' + serieLink : this.link;
    
    this.requestService.post<any>(AppSettings.API_GET_EPISODES, { query: this.link }).subscribe((res) => {
      this.data = res.data;
      this.info = res.info;
    });
  }

  public goTo(query: string) {
    const modifiedQuery = query.replace('https://playdede.us/', '');
  
    this.router.navigate(['/player'], { queryParams: { query: modifiedQuery } });
  }
}
