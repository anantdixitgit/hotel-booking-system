const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapasync.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
//finaly all updates done

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

//create New listing
app.get("/listings/new", (req, res) => {
  console.log("yes");
  res.render("listings/newlisting.ejs");
});

//showing all data of particular property
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("listings/show.ejs", { listing });
});

//now after taking input from form we add that new listing in database and redirect
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
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
  })
);

//edit the data ,first we give get request to render form and then put request to do actual change in db
app.get("/listings/:id/edit", async (req, res) => {
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
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

//add the review in db
app.post("/listings/:id/reviews", async (req, res) => {
  let listing = await Listing.findById(req.params.id);

  let newReview = new Review(req.body.review);

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
});

//delete request for reviews
app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    console.log(await Listing.findById(id));
    console.log(await Review.findById(reviewId));
    // res.send("working properly");
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  })
);

app.get("/", (req, res) => {
  res.send("hi i am home page");
});

// Use this instead:
// Replace your app.all("*") with:
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "some error occured" } = err;
  res.status(status).send(message);
});
app.listen(8080, () => {
  console.log("server listening at port 8080");
});
