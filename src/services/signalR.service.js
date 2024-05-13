import * as signalR from "@microsoft/signalr";
import tokenService from "./token.service";

const MAX_RETRIES = 10;
const RETRY_DELAY = 5000;

class SignalRService {
  constructor() {
    this.connection = null;
    this.retries = 0;
    this.retryInterval = null;
  }

  async start() {
    try {
      const token = tokenService.getLocalToken()?.accessToken;
      const { HubConnectionBuilder, LogLevel } = signalR;

      if (token) {
        await this.connection.start().then(() => {
          console.log("Kết nối socket thành công");
        });

        this.connection = new HubConnectionBuilder()
          .configureLogging(LogLevel.None)
          .withUrl("http://localhost:9999/hub", {
            accessTokenFactory: () => token,
          })
          .build();
      }
    } catch (err) {
      this.retries++;

      if (this.retries < MAX_RETRIES) {
        this.retryConnection();
      } else {
        console.log("Đã thử kết nối lại nhiều lần nhưng không được");
        clearInterval(this.retryInterval);
      }
    }
  }

  retryConnection() {
    this.retryInterval = setInterval(async () => {
      try {
        await this.start();
        clearInterval(this.retryInterval);
      } catch (err) {
        this.retries++;
        if (this.retries >= MAX_RETRIES) {
          console.log("Đã thử kết nối lại nhiều lần nhưng không được");
          clearInterval(this.retryInterval);
        }
      }
    }, RETRY_DELAY);
  }

  stop() {
    if (this.connection) {
      this.connection.stop();
    }
    clearInterval(this.retryInterval);
  }
}

const signalRService = new SignalRService();
export default signalRService;
