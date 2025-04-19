const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main()
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  //console.log("yes");
  res.render("listings/index.ejs", { allListings });
});

//showing all data of particular property
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

//create New listing
app.get("/listing/new", (req, res) => {
  res.render("listings/newlisting.ejs");
});

//now after taking input from form we add that new listing in database and redirect
app.post("/listings", async (req, res) => {
  let { title, description, image, price, location, country } = req.body;

  const listing = new Listing({
    title,
    description,
    image,
    price,
    location,
    country,
  });
  await listing.save();
  res.redirect("/listings");
});

//edit the data ,first we give get request to render form and then put request to do actual change in db
app.get("/listing/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit_listing.ejs", { listing });
});

//update in db finally
app.put("/listings/:id", async (req, res) => {
  // console.log("put request recieve");
  // res.send("working");
  let { id } = req.params;
  let { title, description, image, price, location, country } = req.body;

  await Listing.findByIdAndUpdate(id, {
    title,
    description,
    image,
    price,
    location,
    country,
  });
  res.redirect(`/listings/${id}`);
});

//delete the listing
app.delete("/listing/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

app.get("/", (req, res) => {
  res.send("hi i am home page");
});
app.listen(8080, () => {
  console.log("server listening at port 8080");
});
