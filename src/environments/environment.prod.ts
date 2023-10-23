export const environment = {
  production: true,
  apiUrl: isServer() ? 'http://s_api:7041/api' : 'http://localhost:7041/api',
  signalRUrl: isServer() ? 'http://s_api:7041/' : 'http://localhost:7041/',
  googleLoginCredential:
    '719960856381-4i73af6alrpf3p3pnlbd9ra0vbbbrfhs.apps.googleusercontent.com',
  jwtDomain: isServer() ? 's_api:7041' : 'localhost:7041',
};

function isServer() {
  return typeof window === 'undefined'; // Sunucu tarafında çalışıyorsa true, istemci tarafında çalışıyorsa false döner
}
