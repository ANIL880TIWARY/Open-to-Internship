const express = require('express');
const router = express.Router();
const collegeControl = require("../controller/collageController.js")
const internControl = require("../controller/internController")

router.post("/colleges", collegeControl.createCollege)

router.post("/interns", internControl.createIntern)

router.get("/collegeDetails", collegeControl.getDetails)


module.exports = router;