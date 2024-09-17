import express from "express";
import path from "node:path";
import routes from "./routes";

const app = express();
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", __dirname + "/template");
app.use("/video", express.static(path.join(__dirname, "/template/videos")));

app.get("/embed", routes.embed);
app.get("/profile/:handle/post/:rkey", routes.profile);
app.get("*", routes.notFound);

app.listen(3000, () => console.log("online"));
