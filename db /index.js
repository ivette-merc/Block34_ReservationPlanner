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
        reservation_date DATE NOT NULL,
        customer_id UUID REFERENCES customer(id) NOT NULL,
        party_count INTEGER NOT NULL,
        restaurant_id UUID REFERENCES restaurant(id) NOT NULL
        
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
  reservation_date,
  customer_id,
  party_count,
  restaurant_id,
}) => {
  const SQL = /*SQL*/ `
   INSERT INTO reservation(id, reservation_date, customer_id, party_count, restaurant_id) VALUES($1, $2, $3, $4, $5) RETURNING *`;

  const response = await client.query(SQL, [
    uuid.v4(),
    reservation_date,
    customer_id,
    party_count,
    restaurant_id,
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

const deleteReservation = async (customer_id, id) => {
  const SQL = /*SQL*/ `DELETE FROM reservation WHERE id=$1 and customer_id=$2`;
  try {
    const response = await client.query(SQL, [id, customer_id]);
    return response;
  } catch (error) {
    console.error("Error deleting reservation:", error);
    throw error;
  }
};

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
      reservation_date: "3/23/24",
      customer_id: customer[0].id,
      party_count: 4,
      restaurant_id: restaurant[0].id,
    }),
    createReservation({
      reservation_date: "3/24/24",
      customer_id: customer[1].id,
      party_count: 2,
      restaurant_id: restaurant[1].id,
    }),
    createReservation({
      reservation_date: "3/25/24",
      customer_id: customer[2].id,
      party_count: 20,
      restaurant_id: restaurant[2].id,
    }),
  ]);
  console.log("reservations created:", await fetchReservation());
};

module.exports = {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  createReservation,
  fetchCustomer,
  fetchRestaurant,
  fetchReservation,
  deleteReservation,
  seed,
};
