const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup", async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registerdUser = await User.register(newUser, password);
    console.log(registerdUser);
    req.flash("success", `${username} registerd successfully`);
    res.redirect("/listings");
  } catch (err) {
    req.flash("error", `${err.message}`);
    res.redirect("/signup");
  }
});

router.get("/login", (req, res) => {
  res.render("users/userlogin.ejs");
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.flash("success", "you logout successfully");
    res.redirect("/listings");
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "welcome back to wonderlust");
    res.redirect("/listings");
  }
);

module.exports = router;
