export const taskApi = {
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
}