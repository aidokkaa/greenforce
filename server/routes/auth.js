// const router = require ('express').Router();
// const User = require ('../models/User');
// const CryptoJS = require('crypto-js');
// const jwt = require("jsonwebtoken");
// const key = CryptoJS.enc.Utf8.parse('your-secret-key');


// router.post('/register',async function(req,res){
//     const newUser = new User({
//         username:req.body.username,
//         email:req.body.email,
//         password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SECRET).toString() ,
//     })
//     try{
//       const savedUser = await newUser.save()
//       res.status(200).json({message:'User registered succesfully! '})
//     }
//     catch(err){
//       res.status(500).json({message:'Registration failed!'})
//     }
// })

// router.post('/login',async (req,res)=>{
//     try{
//       const user = await User.findOne({username:req.body.username});
//       !user && res.status(501).json('Wrong credentials!')
//       const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SECRET)
//       const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
//       originalPassword !==req.body.password && 
//       res.status(401).json('Wrong credentials!')
//       const accessToken =jwt.sign(
//         {
//             id:user._id,
//             isAdmin:user.isAdmin
//         },
//         process.env.JWT_SECRET,
//         {expiresIn:"3d"}
//       )
//       const {password, ...others} = user._doc
      
//       res.status(200).json({...others,accessToken})
//     } catch(err) {
//         res.status(500).json({ message: 'Internal server error' });
//     }
//     }
// )
// module.exports = router
const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require("jsonwebtoken");

router.post('/register', async function(req, res) {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SECRET).toString(),
    });
    try {
        const savedUser = await newUser.save();
        res.status(200).json({ message: 'User registered successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Registration failed!' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(401).json('Wrong credentials!');
        }

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SECRET);
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        if (originalPassword !== req.body.password) {
            return res.status(401).json('Wrong credentials!');
        }

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        const { password, ...others } = user._doc;

        res.status(200).json({ ...others, accessToken });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
