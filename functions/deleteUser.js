'use strict';
const connectMongodb = require('../config/mongodb.js');
const ObjectId = require('mongodb').ObjectID;
let db;

module.exports.handler = async (event, context) => {
  const userId = event.pathParameters.userId;
  let body = event.body;
  let updatedUser;

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
    let result = await db.collection('users').findOneAndDelete({ _id: ObjectId(userId) });

    if (!result.value) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'Not found a user'
        })
      };
    }
  } catch(e) {
    console.log(`[Failed to delete a user]\n ${e} \n`);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to delete a user'
      })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Success to delete a user'
    })
  };
};
