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

	return res.status(200).json({msg: "made it here"})
})



// @ Route         Get api/profile
// @ Description   Get all profile
// @ Acesss        Public

router.get('/', async(req,res) => {
	try{
		const profiles = await Profile.find().populate('user',['name','avatar']);
		res.json(profiles);


	} catch (err){
		console.log(err.message);
		return res.status(500).json({msg: "Server error"})
	}
}) 

// @ Route         Get api/profile/:user_id
// @ Description   Get profile by user ID
// @ Acesss        Public

router.get('/user/:user_id', async(req,res) => {
	try{
		const profile = await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
		
		if(!profile){
			return res.status(400).json({msg: 'Profile not found'})

		}

		res.json(profile);
		
		
	} catch (err){
		console.log(err.message);
        
		if(err.kind == 'ObjectID')
			return res.status(400).json({msg: 'Profile not found'})

		return res.status(500).json({msg: "Server error"})
	}
}) 



// @ Route         Delete api/profile
// @ Description   Delte profile, user and posts
// @ Acesss        Private

router.delete('/', auth, async(req,res) => {
	try{

		//remove users post
		
		// remove profile
		await Profile.findOneAndRemove({user: req.user.id})
		
		// remove profile
		await User.findOneAndRemove({_id: req.user.id})
		

		res.json({msg: "User removed"});
		
		
	} catch (err){
		console.log(err.message);
        
		if(err.kind == 'ObjectID')
			return res.status(400).json({msg: 'Profile not found'})

		return res.status(500).json({msg: "Server error"})
	}
}) 



// @ Route         PUT api/profile/experience
// @ Description   Add profile experience
// @ Acesss        private

router.put('/experience', [auth,
[
	check('title', 'Title is required').not().isEmpty(),
	check('company', 'Company is required').not().isEmpty(),

	check('from', 'From date is required').not().isEmpty(),
]
 ], async (req,res ) => {
 	const error = validationResult(req);

 	if(!error.isEmpty()){
 		return res.status(400).json({error: error.array()})
 	}

 	const {
 		title,
 		company,
 		location,
 		from,
 		to,
 		current,
 		description
 	} = req.body


 	const newExp = {
 		title,
 		company,
 		location,
 		from,
 		to,
 		current,
 		description
 	}

 	try{

 		const profile = await Profile.findOne({user:req.user.id});

 		profile.experience.unshift(newExp)

 		await profile.save()

 		res.json(profile)

 	} catch (err){
 		console.error(err.message)
 		res.status(500).send('server error')
 	}
 
})


// @ Route         Delete api/profile/experience/exp_id
// @ Description   Delte experience from profile 
// @ Acesss        Private

router.delete('/experience/:exp_id', auth, async(req,res) => {
	try{
		const profile = await Profile.findOne({user:req.user.id})

		const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)

		profile.experience.splice(removeIndex, 1)

		await profile.save();

		res.json(profile)
	} catch (err){
		console.error(err.message)
		res.status(500).json({msg: "server error"})
	}
})





module.exports = router;