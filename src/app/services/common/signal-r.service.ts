import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  constructor() {}

  //SignalR bağlantısını başlatmak için kullanılır.
  start(hubUrl: string) {
    const builder: HubConnectionBuilder = new HubConnectionBuilder(); // hub oluşurmak için kullanacağımız sınıf

    const hubConnection: HubConnection = builder.withUrl(hubUrl).withAutomaticReconnect().build(); // yeni bir connection oluşturduk

    hubConnection
      .start() //bağlantıyı başlattık
      .then(() => console.log('Connected')) //eğer hata gelmezse burayı
      .catch((error) => setTimeout(() => this.start(hubUrl), 2000)); // eğer hata gelirse de 2 saniyede bir yeniden bağlanmaya çalış. recursive'e girdik. hata gelmeyene kadar start yeniden çalışacak

    hubConnection.onreconnected((connectionId) => console.log('Reconnected'));
    hubConnection.onreconnecting((error) => console.log('Reconnecting'));
    hubConnection.onclose((error) => console.log('Close reconnection'));

    return hubConnection;
  }

  //İstemci tarafından sunucuya bir yöntem çağırmak için kullanılır. İstemci, sunucudaki bir yöntemi adıyla ve gerekli parametrelerle çağırabilir. Sunucu, bu yöntemi işler ve sonucu geri dönebilir.
  invoke(hubUrl: string, procedureName: string, message: any, successCallBack?: (value) => void, errorCallBack?: (error) => void) {
    this.start(hubUrl).invoke(procedureName, message).then(successCallBack).catch(errorCallBack);
  }

  //sunucudan gelen bir yöntem çağrısını dinlemek için kullanılır. İstemci, belirli bir yöntemi dinlemek üzere bu fonksiyonu kullanır. Sunucu, ilgili yöntemi çağırdığında istemci tarafında bu fonksiyon tetiklenir ve gerekli işlemler gerçekleştirilir.
  on(hubUrl: string, procedureName: string, callBack: (...message: any) => void) {
    this.start(hubUrl).on(procedureName, callBack);
  }
}
