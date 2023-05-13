const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const bot = new TelegramBot(process.env.TG_TOKEN, { polling: true });

bot.on("message", async (message) => {
  if (message.text === "/start") {
    const chatID = message.chat.id;
    bot.sendMessage(chatID, "Welcome to pvcp bot!!!");
    try {
      await fetch(`${process.env.API_URL}:${process.env.PORT}/users`, {
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
    const data = await fetch(
      `${process.env.API_URL}:${process.env.PORT}/messages`
    );
    const messages = await data.json();
    messages.forEach((m) => {
      bot.sendMessage(message.chat.id, prettify(m));
    });
  } else if (message.text === "/stop") {
    bot.sendMessage(message.chat.id, "Bye bye");
    await fetch(
      `${process.env.API_URL}:${process.env.PORT}/users/${message.chat.id}`,
      {
        method: "DELETE",
      }
    );
  }
});

const app = express();
app.use(cors());

mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database!!!"));

app.use(express.json());

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    chatId: {
      type: String,
      required: true,
    },
  })
);

const Message = mongoose.model(
  "Message",
  new mongoose.Schema({
    email: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: false,
    },
    subject: {
      type: String,
      required: false,
    },
    message: {
      type: String,
      required: false,
    },
  })
);

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
  console.log("working", req.params.id);
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

app.listen(process.env.PORT, () => console.log("Server Started!!!"));

function prettify(object) {
  let result = `Email: ${object.email}\n`;
  if (object.fullName) {
    result += `Full Name: ${object.fullName}\n`;
  }
  if (object.subject) {
    result += `Subject: ${object.subject}\n`;
  }
  if (object.message) {
    result += `Message: ${object.message}\n`;
  }
  return result;
}
