const express = require('express');
const router = express.Router();
const validateToken = require("../middleware/validateTokeHandler")
const {getContact, createContact, getContactByID, putContactByID, deleteContactByID} = require('../controllers/contactController')

router.use(validateToken);
router.route("/").get(getContact);
router.route("/").post(createContact);
router.route("/:id").get(getContactByID);
router.route("/:id").put(putContactByID);
router.route("/:id").delete(deleteContactByID);

module.exports = router;