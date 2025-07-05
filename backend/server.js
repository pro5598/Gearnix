const express = require("express");

const app = express();

const PORT = 6969;

require("dotenv").config();

const userRoutes = require("./routes/userRoute");
const productRoutes = require("./routes/productRoute");
const authRoute = require("./routes/authRoute.js");

app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api/auth", authRoute);


app.listen(PORT, () => {
  console.log("Connected");
});
