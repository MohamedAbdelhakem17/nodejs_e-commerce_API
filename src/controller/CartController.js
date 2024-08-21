const asyncHandler = require("express-async-handler");

const httpStatus = require("../config/httpStatus");
const AppError = require("../utils/customError");

const ProductModel = require("../models/ProductModel");
const CouponModel = require("../models/CouponModel");
const CartModel = require("../models/CartModel");

const calculateCartTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItem.forEach(({ price, quantity }) => {
    totalPrice += price * quantity;
  });
  cart.totalPrice = totalPrice.toFixed(2);
  cart.totalPriceAfterDiscount = undefined;
};

const calculateCartTotalQuantity = (cart) =>
  cart.cartItem.reduce((acc, result) => acc + result.quantity, 0);

//  @desc    get user cart
//  @route   GET / api/v1/cart
//  @access  protect/user
const getUserCart = asyncHandler(async (req, res) => {
  const user = req.user._id;

  const userCart = await CartModel.findOne({ user }).populate({
    path: "cartItem.product",
    select: "title description slug imageCover",
  });

  if (!userCart) {
    return res.status(200).json({
      status: httpStatus.SUCCESS,
      data: "This user doesn't have a cart.",
    });
  }

  if (userCart.cartItem.length === 0) {
    return res.status(200).json({
      status: httpStatus.SUCCESS,
      data: "You don't have any items in the cart.",
    });
  }

  const data = {
    ...userCart._doc,
    totalItemInCart: calculateCartTotalQuantity(userCart),
  };

  res.status(200).json({ status: httpStatus.SUCCESS, data });
});

//  @desc    Add Product to cart
//  @route   post / api/v1/cart
//  @access  protect/user
const addProductToCart = asyncHandler(async (req, res) => {
  const { product, color, size, quantity } = req.body;
  const user = req.user._id;

  let userCart = await CartModel.findOne({ user });
  const selectProduct = await ProductModel.findById(product);

  if (!userCart) {
    userCart = await CartModel.create({
      cartItem: [
        {
          product,
          color,
          size,
          price: selectProduct.price,
        },
      ],
      user,
    });
  } else {
    const productIndex = userCart.cartItem.findIndex(
      (currentValue) =>
        currentValue.product.toString() === product &&
        currentValue.color === color
    );

    if (productIndex > -1) {
      userCart.cartItem[productIndex].quantity += quantity || 1;
    } else {
      userCart.cartItem.push({
        product,
        color,
        size,
        quantity,
        price: selectProduct.price,
      });
    }
  }

  calculateCartTotalPrice(userCart);
  await userCart.save();
  res.status(201).json({ status: httpStatus.SUCCESS, data: userCart.cartItem });
});

//  @desc    delete  user cart
//  @route   delete / api/v1/cart:cartId
//  @access  protect/user
const deleteUserCart = asyncHandler(async (req, res) => {
  const { cartId } = req.params;
  const user = req.user._id;
  const userCart = await CartModel.findOneAndDelete({ _id: cartId, user });
  if (!userCart)
    throw new AppError(404, httpStatus.FAIL, "this User dont have cart ");
  res.status(200).json({ status: httpStatus.SUCCESS, data: null });
});

//  @desc    delete  user cart
//  @route   delete / api/v1/cart:itemId
//  @access  protect/user
const removeItemFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const user = req.user._id;

  const userCart = await CartModel.findOneAndUpdate(
    { user },
    { $pull: { cartItem: { _id: itemId } } },
    { new: true }
  );

  if (!userCart) {
    throw new AppError(404, httpStatus.FAIL, "This user doesn't have a cart.");
  }

  // No need for userCart.save() here as findOneAndUpdate already performs the update

  calculateCartTotalPrice(userCart);

  const data = {
    ...userCart._doc,
    totalItemInCart: calculateCartTotalQuantity(userCart),
  };

  res.status(200).json({ status: httpStatus.SUCCESS, data });
});

//  @desc    update Cart Item Quantity
//  @route   put / api/v1/cart/item:itemId
//  @access  protect/user
const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  const user = req.user._id;

  const userCart = await CartModel.findOne({ user });

  if (!userCart) {
    throw new AppError(404, httpStatus.FAIL, "This user doesn't have a cart.");
  }

  const productIndex = userCart.cartItem.findIndex(
    (currentValue) => currentValue._id.toString() === itemId
  );

  if (productIndex === -1) {
    throw new AppError(
      404,
      httpStatus.FAIL,
      "This item doesn't exist in the cart."
    );
  }

  userCart.cartItem[productIndex].quantity = quantity;

  calculateCartTotalPrice(userCart);
  await userCart.save();

  res.status(200).json({ status: httpStatus.SUCCESS, data: userCart.cartItem });
});

//  @desc    update Cart Item Quantity
//  @route   PUT /api/v1/cart/applyCoupon
//  @access  protect/user
const applyCouponToUserCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const currentDate = Date.now();

  const coupon = await CouponModel.findOne({
    name: req.body.coupon,
    expired: { $gte: currentDate },
  });

  if (!coupon) {
    throw new AppError(
      400,
      httpStatus.FAIL,
      "Invalid or expired coupon. Please check your coupon details."
    );
  }

  const userCart = await CartModel.findOne({ user: userId });

  if (!userCart) {
    throw new AppError(
      404,
      httpStatus.FAIL,
      "User cart not found. Please make sure the cart exists."
    );
  }

  userCart.totalPriceAfterDiscount = (
    userCart.totalPrice -
    (userCart.totalPrice * coupon.discount) / 100
  ).toFixed(2);

  await userCart.save();

  const data = {
    ...userCart._doc,
    totalItemInCart: calculateCartTotalQuantity(userCart),
  };

  res.status(200).json({
    status: httpStatus.SUCCESS,
    data,
  });
});

module.exports = {
  getUserCart,
  addProductToCart,
  deleteUserCart,
  removeItemFromCart,
  updateCartItemQuantity,
  applyCouponToUserCart,
};
