// const isLocal = false; // localde docker kullanıyorsak
// //

// const serverAdress = '206.81.31.147';
// const port = '7041';
// const dockerApiServiceName = 's_api';
const googleLoginCredential = '719960856381-4i73af6alrpf3p3pnlbd9ra0vbbbrfhs.apps.googleusercontent.com';

export const environment = {
  production: true,
  apiUrl: 'http://138.68.101.228:7041/api',
  signalRUrl: 'http://138.68.101.228:7041/',
  googleLoginCredential: googleLoginCredential,
  jwtDomain: '138.68.101.228:7041',
};

// function isServerSide() {
//   return typeof window === 'undefined'; // Sunucu tarafında çalışıyorsa true, istemci tarafında çalışıyorsa false döner
// }

// function apiUrl(): string {
//   if (isLocal) {
//     if (isServerSide()) return `http://${dockerApiServiceName}:${port}/api`;
//     else return `http://localhost:${port}/api`;
//   } else {
//     if (isServerSide()) return `http://${dockerApiServiceName}:${port}/api`;
//     else return `http://${serverAdress}:${port}/api`;
//   }
// }

// function signalRUrl(): string {
//   if (isLocal) {
//     if (isServerSide()) return `http://${dockerApiServiceName}:${port}/`;
//     else return `http://localhost:${port}/`;
//   } else {
//     if (isServerSide()) return `http://${dockerApiServiceName}:${port}/`;
//     else return `http://${serverAdress}:${port}/`;
//   }
// }

// function jwtDomain(): string {
//   if (isLocal) {
//     if (isServerSide()) return `${dockerApiServiceName}:${port}`;
//     else return `localhost:${port}`;
//   } else {
//     if (isServerSide()) return `${dockerApiServiceName}:${port}`;
//     else return `${serverAdress}:${port}`;
//   }
// }

// en son çalışan kodlar

// export const environment = {
//   production: true,
//   apiUrl: isServer()
//     ? "http://s_api:7041/api"
//     : "http://206.81.31.147:7041/api",
//   signalRUrl: isServer() ? "http://s_api:7041/" : "http://206.81.31.147:7041/",
//   googleLoginCredential:
//     "719960856381-4i73af6alrpf3p3pnlbd9ra0vbbbrfhs.apps.googleusercontent.com",
//   jwtDomain: isServer() ? "s_api:7041" : "206.81.31.147:7041",
// };

// function isServer() {
//   return typeof window === "undefined"; // Sunucu tarafında çalışıyorsa true, istemci tarafında çalışıyorsa false döner
// }
