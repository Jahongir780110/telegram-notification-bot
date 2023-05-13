const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const TelegramBot = require("node-telegram-bot-api");

const User = require("./models/user");
const Message = require("./models/message");
const prettify = require("./utils/prettify");

require("dotenv").config();

const bot = new TelegramBot(process.env.TG_TOKEN, { polling: true });

bot.on("message", async (message) => {
  if (message.text === "/start") {
    const chatID = message.chat.id;
    bot.sendMessage(chatID, "Welcome to pvcp bot!!!");
    try {
      await fetch(`/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId: chatID }),
      });
    } catch (err) {
      console.log("err", err);
    }
  } else if (message.text === "/getAllMessages") {
    const data = await fetch(`/messages`);
    const messages = await data.json();
    messages.forEach((m) => {
      bot.sendMessage(message.chat.id, prettify(m));
    });
  } else if (message.text === "/stop") {
    bot.sendMessage(message.chat.id, "Bye bye");
    try {
      await fetch(`/users/${message.chat.id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.log("err", err);
    }
  }
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.post("/users", async (req, res) => {
  const chatId = req.body.chatId;
  const users = await User.find();
  const doesUserExist = users.find((u) => u.chatId == chatId);
  if (!doesUserExist) {
    const user = new User({
      chatId: chatId,
    });
    const response = await user.save();
    res.json(response);
  }
});

app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;
  User.deleteOne({ chatId: userId });
});

app.get("/messages", async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

app.post("/messages", async (req, res) => {
  const message = new Message({
    email: req.body.email,
    fullName: req.body.fullName,
    subject: req.body.subject,
    message: req.body.message,
  });
  const response = await message.save();
  res.json(response);
  const users = await User.find();
  users.forEach((user) => {
    bot.sendMessage(user.chatId, prettify(message));
  });
});

app.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}`)
);

mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database!!!"));
