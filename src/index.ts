import { Elysia } from "elysia";
import mongoose from "mongoose";

import { TravelController } from "controllers/travel";

if (!Bun.env.DATABASE_URL) throw new Error("Database connection URL missing");
await mongoose.connect(Bun.env.DATABASE_URL);

const app = new Elysia();

app.use(TravelController).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
