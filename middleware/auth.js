const jwt = require('jsonwebtoken')
const config = require('config')


module.exports = function(req,res, next){
	// Get token from header

	const token = req.header('x-auth-token');

	// Check if not token

	if(!token){
		return res.status(401).json({msg: 'No token, autrization denied'})

	}
	// Verify token
	console.log(token)
	console.log(config.get('jwtSecret'))

	try{
		const decoded = jwt.verify(token, config.get('jwtSecret'));
		req.user = decoded.user;
		next();
	} catch{
		res.status(401).json({msg: 'Token is not found'})
	}
}