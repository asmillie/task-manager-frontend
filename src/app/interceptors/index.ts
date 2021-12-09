import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { AuthHttpInterceptor } from '@auth0/auth0-angular';

export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
];