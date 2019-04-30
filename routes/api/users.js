const express = require('express')
const router = express.Router();
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')


const { check, validationResult } = require('express-validator/check');

const User = require('../../models/User')


// @ Route         Post api/users
// @ Description   Register user
// @ Acesss        Public

router.post('/', [
	// check if name is not empty
	check('name','Name is required')
	     .not()
	     .isEmpty(),
	 check('email','Please include a valid email')
	     .not()
	     .isEmpty(),
	  check('password', 'Please enter a password with 6 or more characters')
	  	  .isLength({min: 6}),

	] ,
	async (req,res) => {
		const errors = validationResult(req);

		// respons to validation result from check
		if(!errors.isEmpty()){
			return res.status(400).json({errors: errors.array()})
		}

	const {name, email, password} = req.body


		try {


			let user = await User.findOne({email});

			if(user){
				return res.status(400).json({errors: [{msg: 'User already exists'}]});


			}

				//console.log(req.body)

	// See if user exits



	// Get users gravatar

	const avatar = gravatar.url(email,{
		s: '200',
		r: 'pg',
		d: 'mm'
	})
	user = new User({
		name,
		email,
		avatar,
		password

	})
	// Encrypt password

	const salt = await bcrypt.genSalt(10)
	user.password = await bcrypt.hash(password, salt);

    await user.save()

	//Return jsonwebtoken

	const payload = {
		user: {
			id: user.id,
		}
	}

	jwt.sign(
		payload, 
		config.get('jwtSecret'),
		{expiresIn: 360000} , 
		(err,token)=>{
			if(err) throw err;
			res.json({token})
		})

		} catch(err){
			console.error(err.message)
			res.status(500).send('Server error')
		}


});



module.exports = router;