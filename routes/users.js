const express = require("express");
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// const data = require("../data/data");
const { addUser, getUsers, getUser, deleteUser, updateUser, searchUser, dbCollection } = require("../data/user-data");


const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await getUsers();

    const sortOption = req.query.sort;

    if (sortOption) {
      switch (sortOption) {
        case 'name-asc':
          users.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          users.sort((a, b) => b.name.localeCompare(a.name));
          break;
      }
    }

    res.render("users-page", { users });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

router.delete("/delete/:id", async (req, res) => {
  const userId = req.params.id;

  await deleteUser(userId);

  res.redirect('/');
});

router.get("/update/:id", async (req, res) => {
  const userId = req.params.id;

  const user = await getUser(userId);

  res.render('update-user', { user });
});

router.put("/update/:id", upload.single('image'), async (req, res) => {
  const userId = req.params.id;

  const existingUser = await getUser(userId);

  const newData =  {
    name: req.body.name,
    username: req.body.username,
    bio: req.body.bio,
    image: req.file ? req.file.path : existingUser.image
  }

  await updateUser(userId, newData);

  res.redirect('/');
});

router.get("/info/:id", async (req, res) => {
  const userId = req.params.id;

  const user = await getUser(userId);

  res.render("user-info", { user });
});

router.get("/add-user", (req, res) => {
  res.render("add-user");
});


router.post("/add-user", upload.single('image'), async (req, res) => {
  try {
    const user = {
      name: req.body.name,
      username: req.body.username,
      bio: req.body.bio,
      image: req.file ? req.file.path : null
    };

    await addUser(user);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding user");
  }
});


// router.post("/add-user", async (req, res) => {
//   console.log(req.body);

//   const user = {
//     name: req.body.name,
//     username: req.body.username,
//     bio: req.body.bio,
//     // image: req.file ? req.file.filename : null
//     image: req.body.image,
//   };

//   await addUser(user);

//   const users = await getUsers();

//   // console.log("All users:", users);
//   // res.render("users-page", { users: users });
//   res.redirect("/");
// });

router.get("/search", async (req, res) => {
  try {
    const username = req.query.search;

      let users = [];

      if (username) {
        users = await searchUser(username);
      } else {
        users = await getUsers();
      }

      res.render("users-page", { users, username });
  } catch (error) {
    console.error(error);
    res.status(500).send("Search failed");
  }
});


module.exports = router;