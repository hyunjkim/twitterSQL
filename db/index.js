const pg = require('pg');
const client = new pg.Client({
  user : "Hyun" || process.env.user,
  host: 'localhost',
  database : "twitterdb",
  password: null,
  port: 5432
});
// const client = new pg.Client("postgres://Hyun:null@localhost:5432/twitterdb'")

client.connect()
  .then(() => console.log('connected'))
  .catch(e => console.error('connection error', err.stack));

module.exports = client;


// setting up the node-postgres driver
/*var pg = require('pg');
var postgresUrl = 'postgres://localhost/___YOUR_DB_NAME_HERE___';
var client = new pg.Client(postgresUrl);

// connecting to the `postgres` server
client.connect();

// make the client available as a Node module
module.exports = client;*/
