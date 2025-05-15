const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const express = require("express");
// const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.cloud_NAME,
  api_key: process.env.cloud_API_KEY,
  api_secret: process.env.cloud_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wanderlust_DEV",
    allowedformat: ["png", "jpg", "jpeg"], //
  },
});

module.exports = {
  cloudinary,
  storage,
};
