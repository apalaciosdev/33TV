import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AppSettings } from 'src/app/app.settings';
import { RequestService } from 'src/app/shared/services/request.service';
import { ActivatedRoute } from '@angular/router';

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
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.query = params['query'];
      this.searchMedia();
    });
  }

  public searchMedia() {
    this.requestService.get<any>(AppSettings.API_SEARCH_MEDIA + this.query).subscribe((res) => {
      this.data = res.searchResponse;
    });
    this.lastQuery = this.query;
    // this.data =  [
    //     {
    //       "title": "Los Simpson",
    //       "dataType": "anime",
    //       "img": "http://image.tmdb.org/t/p/w500/gpGPI732PWspwGpPyWrWov8IYmq.jpg",
    //       "date": "Dic. 17, 1989",
    //       "link": "https://playdede.us/anime/los_simpson_456"
    //     },
    //     {
    //       "title": "Los Simpson conocen a los Bocelli en Feliz Navidad",
    //       "dataType": "movie",
    //       "img": "http://image.tmdb.org/t/p/w500/32bx2FsfsEiFFB0aZTU2rOptjTb.jpg",
    //       "date": "Dic. 15, 2022",
    //       "link": "https://playdede.us/pelicula/los_simpson_conocen_a_los_bocelli_en_feliz_navidad_1058732"
    //     },
    //     {
    //       "title": "The Simpsons in Plusaversary",
    //       "dataType": "movie",
    //       "img": "http://image.tmdb.org/t/p/w500/p5jzbffrXuBTjsiwrQ3aOMTrvCj.jpg",
    //       "date": "Nov. 12, 2021",
    //       "link": "https://playdede.us/pelicula/the_simpsons_in_plusaversary"
    //     },
    //     {
    //       "title": "Los Simpson: La buena, el malo y Loki",
    //       "dataType": "movie",
    //       "img": "http://image.tmdb.org/t/p/w500/rtMdtzywcAGOrF6t8fbxJBqpdcq.jpg",
    //       "date": "Jul. 07, 2021",
    //       "link": "https://playdede.us/pelicula/los_simpson_la_buena_el_malo_y_loki"
    //     },
    //     {
    //       "title": "Los Simpson: La película",
    //       "dataType": "movie",
    //       "img": "http://image.tmdb.org/t/p/w500/xLy8FyvbSDCnl66lKS8i2Qc6hE3.jpg",
    //       "date": "Jul. 25, 2007",
    //       "link": "https://playdede.us/pelicula/los_simpson_la_pelcula"
    //     }
    //   ]
    
  }
}
