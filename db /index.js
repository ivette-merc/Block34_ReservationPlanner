//init tables and info for database

const pg = require("pg");
const uuid = require("uuid");
const client = new pg.Client(`postgres://localhost/${process.env.DB_NAME}`);

const createTables = async () => {
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
        customer_id UUID REFERENCES customer(id) NOT NULL,
        customer_name VARCHAR(75) REFERENCES customer (name) NOT NULL,
        restaurant_id UUID REFERENCES restaurant(id) NOT NULL,
        restaurant_name VARCHAR(75) REFERENCES restaurant (name) NOT NULL
    );
    
    `;
  await client.query(SQL);
};

const createCustomer = async (name) => {
  const SQL = /*SQL*/ `
    INSERT INTO customer(id, name) VALUES ($1, $2) RETURNING *`;
  const response = await client.query(SQL, [uuid.v4(), name]);
  console.log("response-customer:", response);
  return response.rows[0];
};

const createRestaurant = async (name) => {
  const SQL = /*SQL*/ `
    INSERT INTO restaurant(id, name) VALUES ($1, $2) RETURNING *`;
  const response = await client.query(SQL, [uuid.v4(), name]);
  console.log("response-restaurant:", response);
  return response.rows[0];
};

const createReservation = async ({
  customer_id,
  customer_name,
  restaurant_id,
  restaurant_name,
}) => {
  const SQL = /*SQL*/ `
   INSERT INTO reservation(id, customer_id,customer_name, restaurant_id, restaurant_name) VALUES($1, $2, $3, $4, $5) RETURNING *
 
 `;
  const response = await client.query(SQL, [
    uuid.v4(),
    customer_id,
    customer_name,
    restaurant_id,
    restaurant_name,
  ]);
  return response.rows[0];
};

const fetchReservation = async () => {
  const SQL = /*SQL*/ `SELECT * from reservation`;
  const { rows } = await client.query(SQL);
  return rows;
};

const fetchCustomer = async () => {
  const SQL = /*SQL*/ `
    SELECT * from customer;
    `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchRestaurant = async () => {
  const SQL = /*SQL*/ `
    SELECT * from restaurant;
    `;
  const response = await client.query(SQL);
  return response.rows;
};

const deleteReservation = async () => {
  const SQL = /*SQL*/ `DELETE FROM reservation WHERE id=$1 and customer_id=$2 RETURNING *`;
  await client.query(SQL, [id, customer_id])
}

const seed = async () => {
  await Promise.all([
    createCustomer("Ashley"),
    createCustomer("Jo"),
    createCustomer("Kelly"),
    createRestaurant("Dunkin Donuts"),
    createRestaurant("Tim Hortons"),
    createRestaurant("Coffee Lodge"),
  ]);
  const customer = await fetchCustomer();
  console.log("customers are:", await fetchCustomer());
  const restaurant = await fetchRestaurant();
  console.log("restaurants are:", await fetchRestaurant());

  await Promise.all([
    createReservation({
      customer_id: customer[0].id,
      customer_name: customer[0].name,
      restaurant_id: restaurant[0].id,
      restaurant_name: restaurant[0].name,
      reservation_date: "3/23/24",
    }),
    createReservation({
      customer_id: customer[1].id,
      customer_name: customer[1].name,
      restaurant_id: restaurant[1].id,
      restaurant_name: restaurant[1].name,
      reservation_date: "3/24/24",
    }),
    createReservation({
      customer_id: customer[2].id,
      customer_name: customer[2].name,
      restaurant_id: restaurant[2].id,
      restaurant_name: restaurant[2].name,
      reservation_date: "3/25/24",
    }),
  ]);
  console.log("reservations created:", await fetchReservation());
};



module.exports = {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomer,
  fetchRestaurant,
  fetchReservation,
  deleteReservation,
  seed,
};
