import app from "./App";

class Server {
  private port: number;

  constructor() {
    this.port = parseInt(process.env.PORT || "5000", 10);
  }

  public start() {
    app.listen(this.port, () => {
      console.log(`Server running at http://localhost:${this.port}`);
    });
  }
}

new Server().start();
