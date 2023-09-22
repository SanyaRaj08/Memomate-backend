const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");

const router = express.Router();
const JWT_SECRET = "sanyasecrettoken";
// Create user using: POST "/api/auth/createuser" (no login required)
router.post(
  "/createuser",
  [
    body("userName", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
      
    }

    // Check whether the user exists already
    const existingUser = await User.findOne({
      $or: [{ userName: req.body.userName }, { email: req.body.email }],
    });

    if (existingUser) {
      if (
        existingUser.userName === req.body.userName &&
        existingUser.email === req.body.email
      ) {
        return res
          .status(400)
          .json({success, error: "Username and email already exists" });
      }
      if (existingUser.userName === req.body.userName) {
        return res.status(400).json({success, error: "Username already exists" });
      }
      if (existingUser.email === req.body.email) {
        return res.status(400).json({ success, error: "Email already exists" });
      }
    }
    const salt = await bcrypt.genSalt(10);
    secPass = await bcrypt.hash(req.body.password, salt);

    // Create the new user
    const newUser = {
      userName: req.body.userName,
      email: req.body.email,
      password: secPass,
    };

    try {
      const createdUser = await User.create(newUser);
      const data = {
        user: {
          id: User.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success=true;
      res.json({ success,authToken });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
);

//authenticate a user

router.post(
  "/login",
  [
    body("userName", "Enter a valid name").isLength({ min: 3 }),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userName, password } = req.body;
    try {
      let user = await User.findOne({ userName });
      if (!user) {
        
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success=false;
        return res
          .status(400)
          .json({ success,error: "Please try to login with correct credentials" });
      }
      const data = {
        user: {
          id: user.id, // Use user.id instead of User.id
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success=true;
      res.json({ success,authToken });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
);

//get logedin user details
router.post("/getuser",fetchuser, async (req, res) => {
  try {
    userId=req.user.id;
    const user = await User.findById(userId).select("-password");
    res.json(user)
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
