import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import dotenv from "dotenv";
import userRoutes from "./routes/UserRoutes";
import rateLimiter from "./middlewares/RateLimiter";

dotenv.config();

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares() {
  // 1️⃣ Body parsing first
  this.app.use(express.json({ limit: "10mb" }));
  this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // 2️⃣ Security middlewares
  this.app.use(cors());
  this.app.use(helmet());
  this.app.use(compression());
  this.app.use(morgan("dev"));

  // 3️⃣ Rate limiting
  this.app.use(rateLimiter);

//   // 4️⃣ Mongo sanitize AFTER body parsing
//   this.app.use((req, res, next) => {
//   if (req.query) {
//     const sanitizedQuery: any = {};
//     for (const key in req.query) {
//       sanitizedQuery[key.replace(/\$/g, "_")] = req.query[key];
//     }
//     req.query = sanitizedQuery; // ❌ will crash on Node 22+, only safe with older Node
//   }
//   next();
// });

}


  private initializeRoutes() {
    this.app.use("/api/users", userRoutes);
  }
}

export default new App().app;
