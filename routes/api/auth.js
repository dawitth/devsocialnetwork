const express = require('express')
const router = express.Router();

// @ Route         Get api/Auth
// @ Description   Test routes
// @ Acesss        Public

router.get('/', (req,res) => res.send("Auth route"));

module.exports = router;