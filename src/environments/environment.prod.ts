export const environment = {
  production: true,
  auth0: {
    domain: 'dev-x4xgby3m.us.auth0.com',
    clientId: 'BAJyPhJIv9IPoE96qI3qWrDQQFq65rtH'
  },
  taskApi: {
    url: 'https://as-task-manager-api.herokuapp.com',
    endpoint: {
          signup: '/signup',
          signupDemo: '/signup/demo',
          emailExists: '/signup/emailExists',
          verifyRecaptcha: '/auth/verifyRecaptcha',
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
    },
  },
  reCaptcha: {
    public_key: '6Lcj4NwZAAAAAPBOABiTalzK3fohYEHhZ1wrDOcu',
  }
};
