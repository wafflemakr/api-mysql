# API + MySQL

Express, MySQL and Blockchain implementation with API GET request.

## Getting Started

Basic implementation of Node.js API using Express. When user makes a GET request to '/events', the API will create an instance of the smart contract specified inside the script under 'contractAddress' and fetch all events in the contract since the provided Block Number. The API responds with a rendered html using bootstrap, showing a table with the events. Finally, it creates a record in a MySQL database with the request ip and query parameter. Currently implemented for the Rinkeby Testnet.

### Prerequisites

This implementation requires the following prerequisites:

```
Node.js® v10.15.0, Node Package Management (npm) v6.8.0
```

[Node.js®](https://nodejs.org/en/) is a JavaScript runtime built on Chrome's V8 JavaScript engine. The installation includes npm. For other OS, refer to their website. This is installation for Ubuntu:

```
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -

sudo apt-get install -y nodejs
```

### Configuring

The following packages are installed with npm: mysql, dotenv, express, web3 and truffle-hdwallet-provider. After cloning the repo, navigate to the project folder and run:

```
npm install
```

You will also need:

- [Infura Key](https://infura.io/register) - Infura is an easy to use API and developer tools that provide secure, reliable, and scalable access to Ethereum and IPFS. In other words, a way to connect to the Ethereum Blockchain, so you don-t have to run a full node on your server. Register in Infura, create a new project, give it a name and then copy where it says "PROJECT ID".

Get gas for your transactions. You may need Rinkeby testnet ether or real ether:

- [Rinkeby](https://faucet.rinkeby.io/) - Enter this link to the Rinkeby's faucet. Here you will need to use one of your social networks to claim some testnet ether (up to 18.5) per social link. Follow instructions in the website.

- [Coinbase](https://www.coinbase.com/join/58787454ff90ca00dab65cb9) - Register at Coinbase. Buy some ether with your preferred method. Then send ether to your account's address generated with the mnemonic

Create a .env file on the project directory and copy:

```
INFURA_KEY='Project Id from Infura'
DBHOST=
DBPSWD=
DBPORT=
DBUSER=
DBNAME=
```

Currently, the API works for the [voting app](https://github.com/wafflemakr/voting) available in this repository. To make it work with another contract, navigate to src/abi.js and copy the abi or JSON interface from your contract and replace the contents of the variable 'abi'.

### Running

Make sure your MySQL database is on, and run:

```
node api.js
```

The console will show which port it will listen to (default=3000). Now open your browser and enter

```
http://localhost:3000/events?block=4032922
//or
http://localhost:3000/candidates
```

And you will get a page with a table and all events since 'block', from the contract address 'sc'
