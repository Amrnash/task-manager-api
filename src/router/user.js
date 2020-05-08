const express = require("express");
const User = require("../models/User");
const Task = require("../models/Task");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const router = new express.Router();

const avatar = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    const fileName = file.originalname;
    const isValid =
      fileName.endsWith(".jpg") ||
      fileName.endsWith(".jpeg") ||
      fileName.endsWith(".png");
    if (!isValid) {
      return cb(new Error("please upload an image"));
    }
    cb(undefined, true);
  },
});
// PUBLIC: Create A user
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});
//PUBLIC: login user
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});
//logout of the current session
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});
//logout of all the sessions
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});
// upload user avatar
router.post(
  "/users/me/avatar",
  auth,
  avatar.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send("image recieved");
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
//Delete user's avatar
router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send("image deleted");
});
router.get("/users/me/avatar/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});
// Get All Users
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});
// // Get A User By ID
// router.get("/users/:id", async (req, res) => {
//   const _id = req.params.id;
//   try {
//     const user = await User.findById(_id);
//     if (!user) return res.status(404).send();
//     res.status(200).send(user);
//   } catch (e) {
//     res.status(500).send(e);
//   }
// });
//update user by ID
router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdatesArray = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdatesArray.includes(update);
  });
  if (!isValidOperation) {
    return res.status(400).send({ errors: "invalid updates" });
  }
  try {
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});
//Delete a user By ID
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    await Task.deleteMany({ owner: req.user._id });
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});
router.get("/usersAll", async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

module.exports = router;
