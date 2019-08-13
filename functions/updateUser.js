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
    body = JSON.parse(body);

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
	  message: 'Required to userId in path'
        })
      };
    }

    if (!(body.name || body.phone)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
	  message: 'Required to name or phone in body'
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
  	let params = { updatedAt: new Date() };

  	if (body.name) params.name = body.name;

    updatedUser = await db.collection('users').findOneAndUpdate(
    	{ _id: ObjectId(userId) },
    	{ $set: params },
    	{ returnOriginal: false }
    );
    
    if (!updatedUser.value) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'Not found a user'
        })
      };
    }
  } catch(e) {
    console.log(`[Failed to update a user]\n ${e} \n`);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to update a user'
      })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Success to update a user',
      user: updatedUser.value
    })
  };
};
