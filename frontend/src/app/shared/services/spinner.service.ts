import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private _MISSATGE_SPINNER: string | undefined;

  constructor(
    private translate: TranslateService,
    private spinner: NgxSpinnerService
  ) { }


  get missatgeSpinner() {
    return this._MISSATGE_SPINNER;
  }

  set missatgeSpinner(pMissatgeSpinner) {
    this._MISSATGE_SPINNER = pMissatgeSpinner;
  }

  /**
   * Funció que mostra un spinner de carrega amb o sense missatge.
   * @param key missatge opcional a mostrar.
   */

  public showSpinner(key?: string) {
    this.missatgeSpinner = '';
    if (key)
      this.translate.get(key).subscribe(value => this.missatgeSpinner = value)
    this.spinner.show('my-spinner');
  }

  /**
   * Funció que oculta el spinner de carrega actiu.
   */
  public hideSpinner() {
    this.missatgeSpinner = '';
    this.spinner.hide('my-spinner');
  }

}
