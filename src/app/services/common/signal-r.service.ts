import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private _connection: HubConnection;

  get connection(): HubConnection {
    return this._connection;
  }

  //SignalR bağlantısını başlatmak için kullanılır.
  start(hubUrl: string) {
    if (!this.connection || this._connection?.state == HubConnectionState.Disconnected) {
      //connection yoksa veya connection disconnect ise
      const builder: HubConnectionBuilder = new HubConnectionBuilder(); // hub oluşurmak için kullanacağımız sınıf

      const hubConnection: HubConnection = builder.withUrl(hubUrl).withAutomaticReconnect().build(); // yeni bir connection oluşturduk

      hubConnection
        .start() //bağlantıyı başlattık
        .then(() => console.log('Connected')) //eğer hata gelmezse burayı
        .catch((error) => setTimeout(() => this.start(hubUrl), 2000)); // eğer hata gelirse de 2 saniyede bir yeniden bağlanmaya çalış. recursive'e girdik. hata gelmeyene kadar start yeniden çalışacak

      this._connection = hubConnection; // hata almazsak da hubconnectionı connectiona eşitle
    }

    this._connection.onreconnected((connectionId) => console.log('Reconnected'));
    this._connection.onreconnecting((error) => console.log('Reconnecting'));
    this._connection.onclose((error) => console.log('Close reconnection'));
  }

  //İstemci tarafından sunucuya bir yöntem çağırmak için kullanılır. İstemci, sunucudaki bir yöntemi adıyla ve gerekli parametrelerle çağırabilir. Sunucu, bu yöntemi işler ve sonucu geri dönebilir.
  invoke(procedureName: string, message: any, successCallBack?: (value) => void, errorCallBack?: (error) => void) {
    this.connection.invoke(procedureName, message).then(successCallBack).catch(errorCallBack);
  }

  //sunucudan gelen bir yöntem çağrısını dinlemek için kullanılır. İstemci, belirli bir yöntemi dinlemek üzere bu fonksiyonu kullanır. Sunucu, ilgili yöntemi çağırdığında istemci tarafında bu fonksiyon tetiklenir ve gerekli işlemler gerçekleştirilir.
  on(procedureName: string, callBack: (...message: any) => void) {
    this.connection.on(procedureName, callBack);
  }
}
