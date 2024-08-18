const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const { uploadMultiImages } = require("../middleware/imageUploadingMiddleware");
const Factory = require("./handlersFactory");
const ProductModel = require("../models/ProductModel");

// Upload Product Image
const productImagesUpload = uploadMultiImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

const imageManipulation = async (req, res, next) => {
  // image Cover
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);
    req.body.imageCover = imageCoverFileName;
  }

  // Product images
  if (req.files.images) {
    const listOfImages = [];
    await Promise.all(
      req.files.images.map(async (image, index) => {
        const imageFileName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(image.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageFileName}`);
        listOfImages.push(imageFileName);
      })
    );
    req.body.images = listOfImages;
  }

  next();
};

// @desc    get All Product
// @route   grt api/v1/product
// @access  public
const getProducts = Factory.getAll(ProductModel);

// @desc    get one Product
// @route   grt api/v1/product/:id
// @access  public
const getProduct = Factory.getOne(ProductModel, {
  path: "reviews",
  select: "user createdAt -product rating titel",
});

// @desc    Create New Product
// @route   Post api/v1/product
// @access  private
const createNewProduct = Factory.createOne(ProductModel);

// @desc    update  Product
// @route   update api/v1/product
// @access  private
const updateProduct = Factory.updateOne(ProductModel);

// @desc    delete  Product
// @route   delete api/v1/product/:id
// @access  private
const deleteProduct = Factory.deleteOne(ProductModel);

module.exports = {
  getProducts,
  getProduct,
  createNewProduct,
  updateProduct,
  deleteProduct,
  productImagesUpload,
  imageManipulation,
};
