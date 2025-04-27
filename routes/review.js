const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

//add the review in db
router.post("/", async (req, res) => {
  let listing = await Listing.findById(req.params.id);

  let newReview = new Review(req.body.review);

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "New review added");
  res.redirect(`/listings/${listing._id}`);
});

//delete request for reviews
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    console.log(await Listing.findById(id));
    console.log(await Review.findById(reviewId));
    // res.send("working properly");
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "review Deleted!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
