import { Component, OnInit, ElementRef, Renderer2, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AppSettings } from 'src/app/app.settings';
import { RequestService } from 'src/app/shared/services/request.service';
import { ActivatedRoute } from '@angular/router';

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

  constructor(
    public requestService: RequestService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

   
  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      this.link = params['query'];
      await this.getMediaLinks();
    });
  }

  toggleSeason(season: string): void {
    this.openSeasons[season] = !this.openSeasons[season];
  }

  isSeasonOpen(season: string): boolean {
    return this.openSeasons[season] || false;
  }

  public async getMediaLinks() {
    this.dataType = 'movie';

    this.requestService.post<any>(AppSettings.API_GET_LINKS, { link: this.link, dataType: this.dataType }).subscribe((res) => {
      this.data = res.data;
      this.safeHtmlArray = this.data.map(htmlString => this.sanitizer.bypassSecurityTrustHtml(htmlString));

      this.info.wallpaper =	res.wallpaper;
      this.info.overview = res.overview;
      this.info.date = res.date;
      this.info.title = res.title;

      this.setupIframeCommunication();
    });
  }

  selectIframe(index: number) {
    if (this.selectedIframe === index) {
      // Si el mismo botón se hace clic nuevamente, cierra el iframe
      this.selectedIframe = null;
    } else {
      // Abre el nuevo iframe
      this.selectedIframe = index;
    }
  }

  private setupIframeCommunication() {
    const iframe: HTMLIFrameElement | null = this.el.nativeElement.querySelector('iframe');

    if (iframe) {
      iframe.addEventListener('load', () => {
        // Envía un mensaje al iframe
        iframe.contentWindow?.postMessage('Hola desde el documento principal', '*');
      });

      // Escucha mensajes del iframe
      window.addEventListener('message', (event) => {
        // Verifica que el mensaje provenga del iframe
        if (event.source === iframe.contentWindow) {
          // Realiza acciones en respuesta al mensaje
          console.log('Mensaje recibido en el documento principal:', event.data);
        }
      });
    }
  }
}
