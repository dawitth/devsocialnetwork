const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const { check, validationResult } = require('express-validator/check');


// @ Route         Get api/profile/me
// @ Description   Get current users profile
// @ Acesss        Private

router.get('/me', auth , async (req,res) => {
	try{


		const profile = await Profile.findOne({user: req.user.id}).populate('user',['name','avatar'])

		if(!profile){
			return res.status(400).json({msg: "There is no profile for this user"})
		}

		res.json(profile)

		return res.status(200).json({msg: "me is working"})

	}catch(err){
		return res.status(500).json(err)
	}

});


// @ Route         Post api/profile
// @ Description   Create or update a user profile
// @ Acesss        Private


router.post('/', [auth, [
	check('status', 'Status is required').not().isEmpty(),

	check('skills', 'skills is required').not().isEmpty()
	]],  async (req,res) => {

		const errors = validationResult(req);
		

		if(!errors.isEmpty()){
			return res.status(400).json({errors:errors.array()})

		}

		const {
			company,
			website,
			location,
			bio,
			status,
			githubusername,
			skills,
			youtube,
			facebook,
			twitter,
			instagram,
			linkedin
		} = req.body


		// Build profile object

		const profileFields = {}
		profileFields.user = req.user.id;
		if(company) profileFields.company = company
		if(website) profileFields.website = website
		if(location) profileFields.location = location
		if(bio) profileFields.bio = bio
		if(status) profileFields.status = status	
		if(githubusername) profileFields.githubusername = githubusername	
		if(skills)
			profileFields.skills = skills.split(',').map(skill=> skill.trim())
		// Build social object

		profileFields.social = {}


			if(youtube) profileFields.social.youtube = youtube
			if(twitter) profileFields.social.twitter = twitter
			if(facebook) profileFields.social.facebook = facebook
			if(instagram) profileFields.social.instagram = instagram
			if(linkedin) profileFields.social.linkedin = linkedin

				

			try{
				let profile = await Profile.findOne({user: req.user.id})
				if(profile){
					// update
					profile = await Profile.findOneAndUpdate(
				{user:req.user.id}, 
				{$set: profileFields}, 
				{new: true})
			return res.json(profile)

				}

				//create
		profile = new Profile(profileFields)
		await profile.save();
		res.json(profile)

			

			} catch(err){
				return res.status(500).json({msg: "Server error"})
			}
		
/*
	try{
		let profile = await Profile.findOne({user: req.user.id})

		if(profile){
			// update 
			profile = await Profile.findOneAndUpdate(
				{user:req.user.id}, 
				{$set: profileFields}, 
				{new: true})
			return res.json(profile)
		}
		//create
		profile = new Profile(profileFields)
		await profile.save();
		res.json(profile)

	} catch(err){
		return res.status(500).json({msg: "Server error"})
	}


*/
	return res.status(200).json({msg: "made it here"})
})





module.exports = router;