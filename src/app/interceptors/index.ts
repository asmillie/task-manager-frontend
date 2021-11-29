import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { AuthHttpInterceptor } from '@auth0/auth0-angular';
import { UserInterceptor } from "./user.interceptor";

export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: UserInterceptor, multi: true },
];