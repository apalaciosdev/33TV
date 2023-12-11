import { Component, OnInit, ElementRef, Renderer2, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AppSettings } from 'src/app/app.settings';
import { RequestService } from 'src/app/shared/services/request.service';
import { ActivatedRoute } from '@angular/router';
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
  safeHtmlArray: SafeHtml[] = [];
  public selectedIframe: number | null = null;
  openSeasons: { [key: string]: boolean } = {};
  public pressedButtonIndex: number | null = null;
  
  
  constructor(
    public requestService: RequestService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private el: ElementRef,
    private location: Location
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

    this.requestService.post<any>(AppSettings.API_GET_REPRODUCERS, { query: this.link }).subscribe((res) => {
      this.data = res;
      this.safeHtmlArray = this.data.map((htmlString, index) => {
        const sanitizedHtmlString = htmlString.replace(/\\/g, '');
        this.setupIframeCommunication(index);
        return this.sanitizer.bypassSecurityTrustHtml(sanitizedHtmlString);
      });

      this.info.wallpaper = res.wallpaper;
      this.info.overview = res.overview;
      this.info.date = res.date;
      this.info.title = res.title;
    });
  }

  selectIframe(index: number) {
    this.pressedButtonIndex = index;

    if (this.selectedIframe === index) {
      this.closeIframe(this.selectedIframe);
      this.selectedIframe = null;
    } else {
      if (this.selectedIframe !== null) {
        this.closeIframe(this.selectedIframe);
      }
      this.selectedIframe = index;
      this.openIframe(this.selectedIframe);
    }
  }

  private openIframe(index: number) {
    // Puedes agregar lógica adicional si es necesario antes de abrir el iframe
  }

  private closeIframe(index: number) {
    // Puedes agregar lógica adicional si es necesario antes de cerrar el iframe
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
}
