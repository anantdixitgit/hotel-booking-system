module.exports.isLoggedIn = function (req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Plesase login yourself before adding Listings");
    return res.redirect("/login");
  }
  next();
};
