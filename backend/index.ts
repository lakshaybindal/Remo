import express from "express";
import cors from "cors";
import router from "./routes/user";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/user", router);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
