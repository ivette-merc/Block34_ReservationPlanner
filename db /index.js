//init tables and info for database 

const pg = require('pg');
const uuid = require("uuid");
const client = new pg.Client(`postgres://localhost/${process.env.DB_NAME}`);

const initTables = async () => {
    const SQL = /*SQL*/ `
    DROP TABLE IF EXISTS reservation;
    DROP TABLE IF EXISTS customer;
    DROP TABLE IF EXISTS restaurant;

    CREATE TABLE customer(
        id UUID PRIMARY KEY, 
        name VARCHAR(75) NOT NULL UNIQUE
    );

    CREATE TABLE restaurant(
         id UUID PRIMARY KEY, 
         name VARCHAR(75) NOT NULL UNIQUE
    );

    CREATE TABLE reservation(
        id UUID PRIMARY KEY, 
        reservation_date TIMESTAMP NOT NULL DEFAULT now(),
        customer_id UUID REFERENCES customer(id) NOT NULL.
        restaurant_id UUID REFERENCES restaurant(id) NOT NULL,
    )
    
    `;
}