const express = require('express')
const router = express.Router();

// @ Route         Get api/profile
// @ Description   Test routes
// @ Acesss        Public

router.get('/', (req,res) => res.send("Profile route"));

module.exports = router;