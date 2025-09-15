import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const ServiceSchema = new mongoose.Schema({
  name: String,
  description: String,
  pricePerKg: Number,
});
const Service = mongoose.model("Service", ServiceSchema);

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  await Service.deleteMany({});
  await Service.insertMany([
    { name: "Basic Wash", description: "Wash & dry", pricePerKg: 79 },
    { name: "Express", description: "Wash, dry & fold", pricePerKg: 109 },
    { name: "Premium Care", description: "Delicate fabrics", pricePerKg: 149 }
  ]);
  console.log("✅ Seeded services");
  await mongoose.disconnect();
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
