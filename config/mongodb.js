"use strict";
const MongoClient = require('mongodb').MongoClient;
const MONGODB_URI = process.env.MONGO_DB_URI;
const MONGODB_NAME = process.env.MONGO_DB_NAME;

let cachedDb = null;

const initialize = async (event, context) => {
	context.callbackWaitsForEmptyEventLoop = false;

  if (cachedDb) {
    console.log('=> using cached database instance');
    return Promise.resolve(cachedDb);
  }

  try {
    cachedDb = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true });
    cachedDb = cachedDb.db(MONGODB_NAME);

    if (!cachedDb) {
      throw new Error('=> failed to connect database');
    } 
  } catch(e) {
    console.log(`[Error Info]\n ${e} \n`);
    throw new Error('=> error to connect database');
  }

  return cachedDb;
};

module.exports = initialize;
