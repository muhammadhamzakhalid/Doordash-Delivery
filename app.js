import express from "express";
const app = express();
const port = 3000;
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";
import { DoorDashClient } from "@doordash/sdk";

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, (err) => {
  if (err) {
    return console.log("ERROR", err);
  }
  console.log(`App listening on port ${port}`);
});

app.use(express.static(__dirname + "/public"));

app.set("view engine", "pug");

app.post('/doordash-webhook', (req, res) => {
  console.log('Received a webhook event from DoorDash:');
  console.log(req.body); // This will contain the payload sent by DoorDash
  res.status(200).send('Webhook received successfully');
});

app.get("/order", (req, res) => {
  res.render("order");
});

app.get("/get-delivery/:id", async (req, res) => {
  if (!req.params.id) return;

  const client = new DoorDashClient({
    developer_id: process.env.DEVELOPER_ID,
    key_id: process.env.KEY_ID,
    signing_secret: process.env.SIGNING_SECRET,
  });

  const response = client
    .getDelivery(req.params.id)
    .then((response) => {
      console.log(response.data);
      res.send(response);
    })
    .catch((err) => {
      console.log(err);
      res.error({});
    });
});

app.post("/create-delivery", async (req, res) => {
  const {
    order_value,
    street,
    city,
    zipcode,
    dropoff_contact_given_name,
    dropoff_contact_family_name,
    dropoff_phone_number,
    items,
  } = req.body;

  const client = new DoorDashClient({
    developer_id: process.env.DEVELOPER_ID,
    key_id: process.env.KEY_ID,
    signing_secret: process.env.SIGNING_SECRET,
  });

  const deliveryData = await client.createDelivery({
    external_delivery_id: uuidv4(),
    pickup_address: process.env.PICKUP_ADDRESS,
    pickup_phone_number: process.env.PICKUP_PHONE,

    dropoff_address: "800 Occidental Ave S, Seattle, WA 98134",
    dropoff_phone_number: "+12065551212",
    dropoff_business_name: "Lumen Field",
    dropoff_instructions: "Enter gate code 1234 on the callbox.",
    dropoff_contact_given_name: dropoff_contact_given_name,
    dropoff_contact_family_name: dropoff_contact_family_name,
    items,
    order_value,
    tip: 0,
  });

  const response = {
    data: {
      order_value: order_value || 0,
      fee: process.env.DOORDASH_PLATFORM_FEE,
    },
  };

  const clothingTotal = (response.data.order_value / 100).toFixed(2);
  const feeTotal = (response.data.fee / 100).toFixed(2);
  const orderTotal = Number(clothingTotal) + Number(feeTotal);

  const data = {
    clothingTotal: clothingTotal,
    feeTotal: feeTotal,
    orderTotal: orderTotal,
  };

  res.render("order", {
    clothingTotal: data.clothingTotal,
    feeTotal: data.feeTotal,
    orderTotal: data.orderTotal,
    external_delivery_id: deliveryData.data.external_delivery_id,
    tracking_url: deliveryData.data.tracking_url,
  });
  console.log(deliveryData);
  console.log("ACCEPT", response);
});
