import { Component, OnInit, ElementRef, Renderer2, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AppSettings } from 'src/app/app.settings';
import { RequestService } from 'src/app/shared/services/request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-videoPlayer',
  templateUrl: './videoPlayer.component.html',
  styleUrls: ['./videoPlayer.component.scss']
})
export class VideoPlayerComponent implements OnInit {
  @Input() data: any[] = [];
  public link: string = '';
  public dataType: string = '';
  public info: any = {};
  public navigationLinks: any = {};
  public language :string = 'esp';
  safeHtmlArray: SafeHtml[] = [];
  public selectedIframe: number | null = null;
  openSeasons: { [key: string]: boolean } = {};
  public pressedButtonIndex: number | null = null;
  
  
  constructor(
    public requestService: RequestService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private el: ElementRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      this.link = params['query'];
      await this.getMediaLinks();
    });
    // this.location.subscribe((state) => {

    //   console.log('URL anterior:', state.url);
    // });

        // Registra un observador para cambios en la URL
  }

  toggleSeason(season: string): void {
    this.openSeasons[season] = !this.openSeasons[season];
  }

  isSeasonOpen(season: string): boolean {
    return this.openSeasons[season] || false;
  }

  public async getMediaLinks() {
    this.dataType = 'movie';

    this.requestService.post<any>(AppSettings.API_GET_REPRODUCERS, { query: this.link, language: this.language }).subscribe((res) => {
      this.data = res.resultados;
      this.info = res.info;
      this.navigationLinks = res.navigationLinks;
      this.safeHtmlArray = this.data.map((htmlString, index) => {
        const sanitizedHtmlString = htmlString.replace(/\\/g, '');
        this.setupIframeCommunication(index);
        return this.sanitizer.bypassSecurityTrustHtml(sanitizedHtmlString);
      });
    });
  }
  deselectIframe() {
    if (this.pressedButtonIndex !== null) {
      this.selectedIframe = null;
      this.pressedButtonIndex = null;
    }
  }

  selectIframe(index: number) {
    this.deselectIframe();
    this.pressedButtonIndex = index;

    if (this.selectedIframe === index) {
      this.selectedIframe = null;
    } else {
      this.selectedIframe = index;
    }
  }

  public async goToEpisode(option: string) {
    this.deselectIframe();
    if (option === 'next'){
      this.link = this.navigationLinks.siguiente;
    }
    if (option === 'seasons'){
      this.router.navigate(['/select-link', this.navigationLinks.seasons], { queryParams: {query: this.navigationLinks.seasons} })
    }
    if (option === 'previous'){
      this.link = this.navigationLinks.anterior;
    }

    await this.getMediaLinks();
  }

  private setupIframeCommunication(index: number) {
    const iframeContainer: HTMLDivElement | null = this.el.nativeElement.querySelector(`#iframeContainer${index}`);
    
    if (iframeContainer) {
      const iframe: HTMLIFrameElement | null = iframeContainer.querySelector('iframe');
  
      if (iframe) {
        iframe.addEventListener('load', () => {
          iframe.contentWindow?.postMessage('Hola desde el documento principal', '*');
        });
  
        window.addEventListener('message', (event) => {
          if (event.source === iframe.contentWindow) {
            console.log('Mensaje recibido en el documento principal:', event.data);
          }
        });
      }
    }
  }

  public async setLanguage(lang:string) {
    this.language = lang;
    this.pressedButtonIndex = null;
    await this.getMediaLinks();
  }
}
