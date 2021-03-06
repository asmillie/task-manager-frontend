// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  taskApi: {
      url: 'http://localhost:3000',
      endpoint: {
            signup: '/signup',
            signupDemo: '/signup/demo',
            verifyRecaptcha: '/auth/verifyRecaptcha',
            emailExists: '/signup/emailExists',
            login: '/auth/login',
            logout: '/auth/logout',
            user: {
              get: '/users/me',
              patch: '/users/me',
              delete: '/users/me',
              avatar: {
                post: '/users/me/avatar',
                get: '/users/me/avatar.png',
                delete: '/users/me/avatar'
              }
            },
            tasks: {
              get: '/tasks/search',
              add: '/tasks',
              patch: '/tasks',
              delete: '/tasks'
            }
      }
  },
  reCaptcha: {
    public_key: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // Google Test Key - Always returns valid
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
