const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
const db = require('./database');

function dbCollection() {

  return db.getDb().collection('users');
}

async function addUser(userData) { 

  await dbCollection().insertOne(userData);
}

async function getUsers() {

  const users = await dbCollection().find().toArray();
  return users;
}

async function getUser(userId) {
  if (!ObjectId.isValid(userId)) return null;

  const user = await dbCollection().findOne(
    { _id: new ObjectId(userId) }
  );
  return user;
}

async function deleteUser(userId) {
  if (!ObjectId.isValid(userId)) return null;

  await dbCollection().deleteOne(
    { _id: new ObjectId(userId)}
  );
}

async function updateUser(userId, newData) {
  if (!ObjectId.isValid(userId)) return null;

  const user = await dbCollection().updateOne(
    { _id: new ObjectId(userId)},
    { $set: newData }
  );
  // return user;
}

async function searchUser(username) {

  // const foundUser = await dbCollection().findOne(
  //   { username: username });

  // return foundUser;

  return await dbCollection()
  .find({ username: { $regex: username, $options: 'i' } })
  .toArray();
}

module.exports = {
  addUser, getUsers,
  getUser, deleteUser,
  updateUser, searchUser,
  dbCollection
} 