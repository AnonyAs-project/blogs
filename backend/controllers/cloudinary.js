const cloudinary = require("../config/cloudinary");

const generateSignature = (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: "blog-images" },
    cloudinary.config().api_secret
  );
  res.json({
    timestamp,
    signature,
    api_key: cloudinary.config().api_key,
  });
};

module.exports = { generateSignature };
