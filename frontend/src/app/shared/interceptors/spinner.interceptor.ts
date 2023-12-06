import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { finalize } from 'rxjs/operators';
import { SpinnerService } from '../services/spinner.service';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {

  public countSpinner = 0;

  constructor(private utils: SpinnerService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.countSpinner++;
    this.utils.showSpinner();

    return next.handle(request).pipe(finalize(() => {
      this.countSpinner--;
      setTimeout(() => {
        if (this.countSpinner === 0)
          this.utils.hideSpinner();
      });
    }));
  }
}
