const express = require('express')
const router = express.Router();

// @ Route         Post api/users
// @ Description   Register user
// @ Acesss        Public

router.post('/', (req,res) => {

	console.log(req.body)
	

	res.send("User route")});

module.exports = router;