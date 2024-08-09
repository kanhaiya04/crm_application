import express, { Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./utils/db";
import session from "express-session";
import ingestionRouter from "./routes/ingestDataRoutes";
import AuthRouter from "./routes/authRoutes";
import AudienceRouter from "./routes/audienceRoutes";
import CampaignRouter from "./routes/campaign";
import { connectRabbitMQ, consumeFromQueue } from "./utils/rabbitmq";
import Customer from "./models/customerModel";
import Order from "./models/orderModel";
import "./utils/passport";
import passport from "passport";
import Audience from "./models/audienceModel";
import Campaign from "./models/campaignModel";
var cors = require("cors");

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN, // Adjust to your React frontend origin
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

// connecting to mongodb database
connectDB();

const BATCH_SIZE = 100;
const BATCH_INTERVAL = 5000; // 5 seconds

let batch: any[] = [];

async function processBatch() {
  if (batch.length === 0) return;

  const currentBatch = [...batch];
  batch = [];

  try {
    // Process batch of messages
    const m = new Map();
    currentBatch.map((value) => {
      if (m.has(value.id)) {
        m.set(value.id, [...m.get(value.id), value]);
      } else m.set(value.id, [value]);
    });

    const promises: any[] = [];

    m.forEach((value, key) => {
      const promise = (async () => {
        let response = await Campaign.findById(key);
        //@ts-ignore
        response = await response?.toJSON();
        if (response) {
          //console.log({ response });
          const data: any[] = [];
          value.forEach((v: any) => {
            data.push({
              userId: v.userId,
              status: v.response,
            });
          });
          //console.log({ data });
          //@ts-ignore
          response.deliveryStatus = [...response.deliveryStatus, ...data];
          console.log({ ds: response.deliveryStatus });
          //@ts-ignore
          await Campaign.updateOne(
            { _id: response._id },
            {
              $set: {
                deliveryStatus: response.deliveryStatus,
              },
            }
          );
        }
      })();

      promises.push(promise);
    });

    await Promise.all(promises);

    console.log(`Processed batch of ${currentBatch.length} messages`);
  } catch (error) {
    console.error("Error processing batch:", error);
    // Optionally, re-add failed batch back to the queue or handle retries
    batch = [...currentBatch, ...batch];
  }
}

// Process batch at regular intervals
setInterval(processBatch, BATCH_INTERVAL);

// connecting to rabbitMQ
const run = async () => {
  await connectRabbitMQ();

  // Consume messages from the queue
  await consumeFromQueue("customer", async (msg) => {
    if (msg) {
      try {
        const message = JSON.parse(msg.content.toString());
        await Customer.create(message);
      } catch (error) {
        console.error("Error processing order message:", error);
        throw error;
      }
    }
  });

  await consumeFromQueue("order", async (msg) => {
    if (msg) {
      try {
        const message = JSON.parse(msg.content.toString());
        const customerData = await Customer.findById(message.customerId);
        if (!customerData) {
          throw new Error("Customer not found");
        }
        customerData.totalSpend += message.totalAmount;
        await Customer.updateOne(
          { _id: message.customerId },
          {
            $set: {
              totalSpend: customerData.totalSpend,
            },
          }
        );
        await Order.create(message);
      } catch (error) {
        console.error("Error processing order message:", error);
        throw error;
      }
    }
  });
  await consumeFromQueue("audience", async (msg) => {
    if (msg) {
      try {
        const message = JSON.parse(msg.content.toString());
        const customersId: any[] = [];
        message.result.map((item: any) => {
          customersId.push(item._id);
        });
        await Audience.create({
          userId: message.userId,
          title: message.title,
          size: message.result.length,
          audience: customersId,
        });
      } catch (error) {
        console.error("Error processing order message:", error);
        throw error;
      }
    }
  });
  await consumeFromQueue("campaign", async (msg) => {
    if (msg) {
      try {
        const message = JSON.parse(msg.content.toString());
        const response = await fetch(
          `${process.env.BACKEND_URL}/campaign/deliveryReceipt`,
          {
            method: "POST",
          }
        );
        const result = await response.json();
        batch.push({
          id: message.campaignId,
          response: result.success,
          userId: message.userId,
        });
        if (batch.length >= BATCH_SIZE) {
          await processBatch();
        }
        console.log({ message, response: result.success });
      } catch (error) {
        console.error("Error processing order message:", error);
        throw error;
      }
    }
  });
};

run().catch((error) => {
  console.error("Error in running RabbitMQ example", error);
});

app.use(passport.initialize());
app.use(passport.session());

// Route to test the server
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

// routes to ingest data
app.use("/ingest", ingestionRouter);
app.use("/auth", AuthRouter);
app.use("/audience", AudienceRouter);
app.use("/campaign", CampaignRouter);

// server is listening on port 3000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
