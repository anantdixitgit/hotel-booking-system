const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

router.get("/", async (req, res) => {
  const allListings = await Listing.find({});
  //console.log("yes");
  res.render("listings/index.ejs", { allListings });
});

//create New listing
router.get("/new", isLoggedIn, (req, res) => {
  console.log("yes");
  res.render("listings/newlisting.ejs");
});

//showing all data of particular property
router.get("/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  if (!listing) {
    req.flash("error", "Listing doesnot exist");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
});

//now after taking input from form we add that new listing in database and redirect
router.post(
  "/",
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

    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  })
);

//edit the data ,first we give get request to render form and then put request to do actual change in db
router.get("/:id/edit", isLoggedIn, async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing doesnot exist");
    res.redirect("/listings");
  }
  res.render("listings/edit_listing.ejs", { listing });
});

//update in db finally
router.put("/:id", isLoggedIn, async (req, res) => {
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
  req.flash("success", "listing Updated!");
  res.redirect(`/listings/${id}`);
});

//delete the listing
router.delete("/:id", isLoggedIn, async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
});

module.exports = router;
