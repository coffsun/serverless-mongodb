'use strict';
const connectMongodb = require('../config/mongodb.js');
let db;

module.exports.handler = async (event, context) => {
  let body = event.body;
  let createdUser;

  // 1. Validate data
  try {
    body = JSON.parse(body);

	  if (!(body.name && body.phone)) {
	  	return {
	      statusCode: 400,
	      body: JSON.stringify({
	        message: 'Required to name and phone in body'
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
    createdUser = await db.collection('users').insertOne({
      name: body.name,
      phone: body.phone,
      updatedAt: new Date()
    });

    createdUser = createdUser.ops[0];
  } catch(e) {
    console.log(`[Failed to create a user]\n ${e} \n`);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to create a user'
      })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Success to create a user',
      user: createdUser
    })
  };
};
