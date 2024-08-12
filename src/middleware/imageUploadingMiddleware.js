const multer = require("multer");

const multerOptions = () => {
  const imageStoarge = multer.memoryStorage();
  const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb("This is Not Valuid Image", false);
    }
  };

  const upload = multer({ storage: imageStoarge, fileFilter: imageFilter });
  return upload;
};

const uploadSingleImage = (filename) => multerOptions().single(filename);
const uploadMultiImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);

module.exports = {
  uploadSingleImage,
  uploadMultiImages,
};
