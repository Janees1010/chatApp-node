const express = require("express")
const router = express.Router()
const {addingMessage, allMessages} = require("../controler/messagecontroller")
const authentication = require("../middleware/authentication")


router.post("/",authentication,addingMessage)
router.get("/:id",authentication,allMessages)

module.exports = router; 