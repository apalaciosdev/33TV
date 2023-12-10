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
  safeHtmlArray: SafeHtml[] = [];
  public selectedIframe: number | null = null;
  openSeasons: { [key: string]: boolean } = {};
  seasonStatus: boolean[] = [];

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
      await this.getMediaLinks();
    });

    // Inicializa el array seasonStatus con valores predeterminados (por ejemplo, todas las temporadas cerradas)
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
      this.data = res;
      // No inicialices el array aquí
    });
  }

  public goTo(query: string) {
    // Quita la parte específica del dominio de la URL
    const modifiedQuery = query.replace('https://playdede.us/', '');
  
    // Muestra en la consola la URL modificada
    console.log(modifiedQuery);
  
    // Navega a la ruta '/player' con el parámetro 'query' modificado
    this.router.navigate(['/player'], { queryParams: { query: modifiedQuery } });
  }
}
