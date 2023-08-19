export class TelegramBot {
  private _request: any;

  public constructor(request: any) {
    this._request = request;
    // 
  }

  public async start() {
    console.log(this._request);
  }
}
