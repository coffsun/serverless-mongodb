'use strict';
const connectMongodb = require('../config/mongodb.js');
const ObjectId = require('mongodb').ObjectID;
let db;

module.exports.handler = async (event, context) => {
  const userId = event.pathParameters.userId;
  let foundUser;

  // 1. Validate data
  try {
    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Required to userId in path'
        })
      };
    }
  } catch(e) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid parameters'
      })
    };
  }

  // 2. Connect mongodb
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

  // 3. Find User
  try {
    foundUser = await db.collection('users').findOne({ _id: ObjectId(userId) });
  } catch(e) {
    console.log(`[Failed to find a user]\n ${e} \n`);
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'Not found a user'
      })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Success to find a user',
      user: foundUser
    })
  };
};
