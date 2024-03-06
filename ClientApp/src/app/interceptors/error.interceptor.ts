import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const router = inject(Router);
  const toastrService = inject(ToastrService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error) {
        switch (error.status) {
          case 400:
            const errorArray = error.error?.errors;
            if (errorArray) {
              const modelStateErrors = [];
              for (let key in errorArray) {
                const currentError = errorArray[key];
                if (currentError) {
                  modelStateErrors.push(currentError);
                }
              }
              throw modelStateErrors.flat();
            } else {
              toastrService.error(error.error, error.status.toString());
            }
            break;
          case 401:
            toastrService.error('Unauthorised', error.status.toString());
            break;
          case 404:
            router.navigateByUrl('/not-found');
            break;
          case 500:
            const navigationExtras: NavigationExtras = {
              state: { error: error.error },
            };
            router.navigateByUrl('/server-error', navigationExtras);
            break;
          default:
            toastrService.error('Something unexpected went wrong');
            break;
        }
      }
      throw error;
    })
  );
};
