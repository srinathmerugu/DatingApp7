import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { errorInterceptor } from './interceptors/error.interceptor';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import { GALLERY_CONFIG, GalleryConfig } from 'ng-gallery';
import { NgxSpinnerModule } from 'ngx-spinner';
import { spinnerInterceptor } from './interceptors/spinner.interceptor';
import { TimeagoModule } from 'ngx-timeago';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([errorInterceptor, jwtInterceptor, spinnerInterceptor])
    ),
    provideAnimations(),
    importProvidersFrom(
      ToastrModule.forRoot({
        positionClass: 'toast-bottom-right',
      }),
      NgxSpinnerModule.forRoot({ type: 'line-scale-party' },),
      TimeagoModule.forRoot()
    ),
    BsModalService,
    {
      provide: GALLERY_CONFIG,
      useValue: {
        autoHeight: true,
        imageSize: 'cover',
      } as GalleryConfig,
    },
  ],
};
