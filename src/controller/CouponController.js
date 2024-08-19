const Factory = require("./handlersFactory");

const CouponModel = require("../models/CouponModel");

// @desc    Get All  Coupons
// @route   get api/v1/coupons
// @access  praivet/admin
const getCoupons = Factory.getAll(CouponModel);

// @desc    Get one Coupon
// @route   get api/v1/coupon/:couponId
// @access  praivet/admin
const getCoupon = Factory.getOne(CouponModel);

// @desc    Create New Coupon
// @route   Post api/v1/coupon
// @access  praivet/admin
const createCoupon = Factory.createOne(CouponModel);

// @desc    update  Coupon
// @route   put api/v1/coupon/:couponId
// @access  praivet/admin
const updateCoupon = Factory.updateOne(CouponModel);

// @desc    delete  Coupon
// @route   delete api/v1/coupon/:couponId
// @access  praivet/admin
const deleteCoupon = Factory.deleteOne(CouponModel);

module.exports = {
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};
