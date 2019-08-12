'use strict';
const connectMongodb = require('../config/mongodb.js');
const ObjectId = require('mongodb').ObjectID;
let db;

module.exports.handler = async (event, context) => {
  let foundUsers;

  // 1. Connect mongodb
  try {
    db = await connectMongodb(event, context);
  } catch(e) {
    console.log(`[Error to connect mongodb]\n ${e} \n`);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error'
      })
    };
  }

  // 2. Find Users
  try {
    foundUsers = await db.collection('users').find().toArray();
  } catch(e) {
    console.log(`[Failed to find the users]\n ${e} \n`);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to find the users'
      })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Success to find the users',
      users: foundUsers
    })
  };
};
