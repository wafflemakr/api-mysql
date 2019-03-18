const express = require("express");
const mysql = require("mysql");
const Web3 = require("web3");
const abi = require("./abi.js");

require("dotenv").config();
const app = express();

// --- DATABASE CONFIGURATION ----
dbConfig = {
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPSWD,
  database: process.env.DBNAME,
  port: process.env.DBPORT
};

class Database {
  constructor(config) {
    this.connection = mysql.createConnection(config);
  }
  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
  close() {
    return new Promise((resolve, reject) => {
      this.connection.end(err => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}

const contractAddress = "0x588b535bc6574895c7e8BBA7a59Bb58a8aec5444";
let db = new Database(dbConfig);
let web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://rinkeby.infura.io/v3/${process.env.INFURA_KEY}`
  )
);

let myContract = new web3.eth.Contract(abi, contractAddress);

// ---------------

// You could create more GET suscriptions so you can do other things like
//  reading contracts public methods.
app.get("/candidates", (req, res) => {
  myContract.methods
    .totalCandidates()
    .call()
    .then(result => {
      res.send(`Total Candidates: ${result}`);
    });
});

// Show SC events to Client and updates database with request info
app.get("/events", (req, res) => {
  let response = `<table class="table table-striped table-dark text-center">
  <thead><tr>
  <th scope="col">#</th>
  <th scope="col">Name</th>
  <th scope="col">Block Number</th>
  </tr></thead><tbody>`;

  myContract
    .getPastEvents("allEvents", {
      fromBlock: req.query.block,
      toBlock: "latest"
    })
    .then(events => {
      events.forEach((event, index) => {
        response += `<tr>
        <th scope="row">${index}</th>
        <td>${event.event}</td>
        <td>${event.blockNumber}</td>
        </tr>`;
      });

      res.send(
        `<!DOCTYPE html/>
        <html>
        <head>
        <title>SC Events</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" 
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        </head>
        <body>
        <div class="container" style="width: 650px;">
        </br>
        <h4>Events for SC ${contractAddress}</h4> 
        ${response}
        </tbody></table><div></body></html>`
      );

      // Store in Database
      db.query("INSERT INTO Customers(IP, Addr) VALUES(?,?)", [
        req.ip,
        req.query.block
      ]);
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on Port ${port}`));
