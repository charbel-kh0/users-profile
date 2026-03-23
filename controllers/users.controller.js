// const data = require("../data/user-data");

async function getUsers(req, res) {
  try {
    const users = await data.getUsers();

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
}

async function deleteUser(req, res) {
  const userId = req.params.id;

  await data.deleteUser(userId);

  res.redirect('/');
}

async function getAUser(req, res) {
  const userId = req.params.id;

  const user = await data.getUser(userId);

  res.render('update-user', { user });
}

async function updateAUser(req, res) {
  const userId = req.params.id;

  const existingUser = await data.getUser(userId);

  const newData =  {
    name: req.body.name,
    username: req.body.username,
    bio: req.body.bio,
    image: req.file ? req.file.path : existingUser.image
  }

  await data.updateUser(userId, newData);

  res.redirect('/');
}

async function getUserInfo(req, res) {
  const userId = req.params.id;

  const user = await data.getUser(userId);

  res.render("user-info", { user });
}

async function getAddUser(req, res) {
  res.render("add-user");
}

async function addUser(req, res) {
  try {
    const user = {
      name: req.body.name,
      username: req.body.username,
      bio: req.body.bio,
      image: req.file ? req.file.path : null
    };

    await data.addUser(user);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding user");
  }
}

async function searchUser(req, res) {
  try {
    const username = req.query.search;

      let users = [];

      if (username) {
        users = await data.searchUser(username);
      } else {
        users = await data.getUsers();
      }

      res.render("users-page", { users, username });
  } catch (error) {
    console.error(error);
    res.status(500).send("Search failed");
  }
}

module.exports = {
  getUsers, deleteUser, getAUser, updateAUser, 
  getUserInfo, getAddUser, addUser, searchUser
}