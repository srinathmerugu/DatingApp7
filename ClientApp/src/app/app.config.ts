import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { errorInterceptor } from './interceptors/error.interceptor';
import { BsModalService } from 'ngx-bootstrap/modal';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor])),
    provideAnimations(),
    importProvidersFrom(
      BsDropdownModule.forRoot(),
      ToastrModule.forRoot({
        positionClass: 'toast-bottom-right',
      })
    ),
    BsModalService,
  ],
};
