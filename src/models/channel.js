const mongoose = require("mongoose");

const ChannelOn = mongoose.Schema(
  {
    GuildId: String,
    UserId: String,
    ChannelId: String,
  },
  { minimize: false, collection: "ChannelOn" }
);

module.exports = mongoose.model("ChannelOn", ChannelOn);