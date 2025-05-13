module.exports.isLoggedIn = function (req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Plesase login yourself before adding Listings");
    return res.redirect("/login");
  }
  next();
};

//saving redirectUrl value to locals

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    console.log("yes hurrey");
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
