import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AppSettings } from 'src/app/app.settings';
import { RequestService } from 'src/app/shared/services/request.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-linksSelector',
  templateUrl: './linksSelector.component.html'
})
export class LinksSelectorComponent implements OnInit {
  public data: any[] = [];
  public type: string = '';
  public link: string = '';
  public dataType: string = '';
  safeHtmlArray: SafeHtml[] = [];
  public selectedIframe: number | null = null;
  openSeasons: { [key: string]: boolean } = {};

  constructor(
    public requestService: RequestService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router
  ) {}


  
  ngOnInit() {
    this.route.params.subscribe(async paramsId => {
      this.link = paramsId['link'];
      this.dataType = paramsId['dataType'];
      await this.getMediaLinks();
    });
  }

  toggleSeason(season: string): void {
    this.openSeasons[season] = !this.openSeasons[season];
  }

  isSeasonOpen(season: string): boolean {
    return this.openSeasons[season] || false;
  }

  public async getMediaLinks(serieLink?: string, type?: string) {
    this.link = serieLink ? AppSettings.GENERAL + '/' + serieLink : this.link;
    this.dataType = type ? type : this.dataType;
    
    if (this.dataType === 'movie') {
      this.router.navigate(['/player'], { queryParams: {query: this.link} })
    }

    else {
      this.requestService.post<any>(AppSettings.API_GET_LINKS, { link: this.link, dataType: this.dataType }).subscribe((res) => {
        this.data = res.data;
        this.type = res.type;
  
        this.safeHtmlArray = this.data.map(htmlString => this.sanitizer.bypassSecurityTrustHtml(htmlString));
        this.setupIframeCommunication();
      });
    }
  }

  public goTo(query: string) {
    
    this.router.navigate(['/player'], { queryParams: {query: query} })
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
