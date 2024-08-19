const express = require("express");

const userRoles = require("../config/userRoles");
const allowTo = require("../middleware/allowTomiddleware");
const { protect } = require("../controller/AuthController");

const AddressValidator = require("../utils/validators/AddressValidator");
const AdressesController = require("../controller/AdressesController");

const router = express.Router();

router.use(protect, allowTo(userRoles.USER));
router
  .route("/")
  .post(AddressValidator.addAddressValidator, AdressesController.addAddress)
  .get(AdressesController.getLoggedUserAddresses);

router
  .route("/:addressId")
  .put(
    AddressValidator.updateAddressValidator,
    AdressesController.updateAddress
  )
  .delete(AddressValidator.deleteValidator, AdressesController.removeAddress);
module.exports = router;
