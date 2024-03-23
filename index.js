require('dotenv').config();
const {client, createTables, seed} = require("./db ");
const express = require('express');

const app = express();

//middleware


//init function
const init = async () => {
    await client.connect();
    console.log('db connected');

    await createTables();
    console.log('tables created');

    await seed();
    console.log('data seeded');

    

};

init();