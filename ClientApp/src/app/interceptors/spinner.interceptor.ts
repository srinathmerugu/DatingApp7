import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SpinnerService } from '../services/spinner.service';
import { delay, finalize } from 'rxjs';

export const spinnerInterceptor: HttpInterceptorFn = (req, next) => {
  const spinnerService = inject(SpinnerService);
  spinnerService.showSpinner();
  return next(req).pipe(
    delay(1000),
    // finalize() - do something after observer has completed
    finalize(() => {
      spinnerService.idle();
    })
  );
};
