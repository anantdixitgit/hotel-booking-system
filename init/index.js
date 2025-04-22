const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

console.log("hello devanshu");

main()
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("data initialized");
};

initDB();
