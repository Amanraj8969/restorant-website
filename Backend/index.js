const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser'); 
const cors=require('cors')


const app = express();
app.use(cors());
app.use(bodyParser.json())


const port = 3000;


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "restaurant",
  multipleStatements: true,
});


db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
    createDatabaseAndTable();
  }
});


app.use(bodyParser.json());

function createDatabaseAndTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS restaurants (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      imageUrl VARCHAR(255),
      address VARCHAR(255),
      contactNumber VARCHAR(255)
    )
  `;

  
  db.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating restaurants table:', err);
    } else {
      console.log('Table created or already exists');
    }
  });
}


app.get('/restaurants', (req, res) => {
  db.query('SELECT * FROM restaurants', (err, results) => {
    if (err) {
      console.error('Error querying restaurants:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});


app.post('/restaurants', (req, res) => {
  const { name, imageUrl, address, contactNumber } = req.body;
  console.log("this is ",name);

  const insertQuery = `
    INSERT INTO restaurants (name, imageUrl, address, contactNumber)
    VALUES (?, ?, ?, ?)
  `;

  db.query(insertQuery, [name, imageUrl, address, contactNumber], (err, result) => {
    if (err) {
      console.error('Error adding restaurant:', err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Restaurant added successfully');
      res.sendStatus(201);
    }
  });
});

app.put('/restaurants/:id', (req, res) => {
    const restaurantId = req.params.id;
    const { name, imageUrl, address, contactNumber } = req.body;
    console.log("updated name",name)
  
    const updateQuery = `
      UPDATE restaurants
      SET name = ?, imageUrl = ?, address = ?, contactNumber = ?
      WHERE id = ?
    `;
  
    db.query(updateQuery, [name, imageUrl, address, contactNumber, restaurantId], (err) => {
      if (err) {
        console.error('Error updating restaurant:', err);
        res.status(500).send('Internal Server Error');
      } else {
        console.log('Restaurant updated successfully');
        res.sendStatus(200); 
      }
    });
  });

  app.delete('/restaurants/:id', (req, res) => {
    const restaurantId = req.params.id;
  
    const deleteQuery = `
      DELETE FROM restaurants
      WHERE id = ?
    `;
  
    db.query(deleteQuery, [restaurantId], (err, result) => {
      if (err) {
        console.error('Error deleting restaurant:', err);
        res.status(500).send('Internal Server Error');
      } else {
        console.log('Restaurant deleted successfully');
        res.sendStatus(200); 
      }
    });
  });


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
