import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GiphyService } from './shared/services/giphy.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'LALIGA';

  constructor(
    public translate: TranslateService,
    public giphy: GiphyService
  ){
    translate.use('es');
  }

  public async randomGif() {
    console.log(await this.giphy.getRandomGif());

  }

}
