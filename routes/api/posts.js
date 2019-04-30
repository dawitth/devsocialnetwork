const express = require('express')
const router = express.Router();

// @ Route         Get api/post
// @ Description   Test routes
// @ Acesss        Public

router.get('/', (req,res) => res.send("Post route"));

module.exports = router;