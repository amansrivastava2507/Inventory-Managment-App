const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connection = require('./connection');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    connection.query(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password],
      (err, results) => {
        if (err) {
          console.error('Error executing query: ', err);
          res.status(500).send('Server error');
          return;
        }
  
        if (results.length === 0) {
          res.status(401).send('Invalid email or password');
        } else {
          const user = results[0];
          res.json(user);
        }
      }
    );
  });

app.get('/api/product/search', async (req, res) => {
  const productName = req.query.name;


  try {
    const [rows] = await connection.promise().query(
      `SELECT * FROM inventory_table WHERE product_name LIKE '%${productName}%'`
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error('Error while querying the inventory_table: ', err);
    res.status(500).send('Internal server error');
  }
});
app.get('/api/product', async (req, res) => {
    try {
      const [rows] = await connection.promise().query('SELECT * FROM inventory_table');
      res.status(200).json(rows);
    } catch (err) {
      console.error('Error while querying the inventory_table: ', err);
      res.status(500).send('Internal server error');
    }
  });

app.put('/api/product/:batchNumber', async (req, res) => {
  const { batchNumber } = req.params;
  const updatedProduct = req.body;

  try {
    await connection.promise().query(
      `UPDATE inventory_table SET ? WHERE batch_number = ?`,
      [updatedProduct, batchNumber]
    );

    res.sendStatus(200);
  } catch (err) {
    console.error('Error while updating the inventory_table: ', err);
    res.status(500).send('Internal server error');
  }
});

app.delete('/api/product/:batchNumber', async (req, res) => {
  const { batchNumber } = req.params;

  try {
    await connection.promise().query(
      `DELETE FROM inventory_table WHERE batch_number = ?`,
      [batchNumber]
    );

    app.get('/api/product', (req, res) => {
    connection.query('SELECT * FROM inventory_management', (error, results) => {
      if (error) {
        console.log('Failed to fetch names from MySQL database:', error);
        res.status(500).json({ error: 'Failed to fetch names from MySQL database' });
      } else {
        res.json(results);
      }
    });
  });
  
  app.delete('/api/inventory/:product_name', (req, res) => {
    const { product_name } = req.params;
    connection.query('DELETE FROM inventory_management WHERE product_name = ?', [product_name], (error, results) => {
      if (error) {
        console.log('Failed to delete name from MySQL database:', error);
        res.status(500).json({ error: 'Failed to delete name from MySQL database' });
      } else {
        res.json({ message: `Deleted name with product_name ${product_name}` });
      }
    });
  });
  

// Function to add a new inventory item to the table
exports.addInventoryItem = (formValues, callback) => {
  // Construct a SQL query to insert the new item
  const sql = `INSERT INTO inventory_table (
    product_name, 
    batch_number, 
    lot_number, 
    manufacturing_date, 
    manufacturing_area, 
    manufacturer, 
    expiry, 
    category, 
    quantity, 
    comments, 
    product_location, 
    threshold
  ) VALUES (
    '${formValues.productName}', 
    '${formValues.batch}', 
    '${formValues.lot}', 
    '${formValues.manufacturingDate}', 
    '${formValues.manufacturingArea}', 
    '${formValues.manufacturer}', 
    '${formValues.expiry}', 
    '${formValues.category}', 
    '${formValues.quantity}', 
    '${formValues.comments}', 
    '${formValues.productLocation}', 
    '${formValues.thershold}'
  )`;

  // Execute the SQL query and pass the result to the callback function
  connection.query(sql, callback);
};

// Function to update an existing inventory item in the table
app.get('/api/product', (req, res) => {
  connection.query('SELECT * FROM inventory_management', (error, results) => {
    if (error) {
      console.log('Failed to fetch names from MySQL database:', error);
      res.status(500).json({ error: 'Failed to fetch names from MySQL database' });
    } else {
      res.json(results);
    }
  });
});

app.delete('/api/inventory/:product_name', (req, res) => {
  const { product_name } = req.params;
  connection.query('DELETE FROM inventory_management WHERE product_name = ?', [product_name], (error, results) => {
    if (error) {
      console.log('Failed to delete name from MySQL database:', error);
      res.status(500).json({ error: 'Failed to delete name from MySQL database' });
    } else {
      res.json({ message: `Deleted name with product_name ${product_name}` });
    }
  });
});


// Function to add a new inventory item to the table
exports.addInventoryItem = (formValues, callback) => {
// Construct a SQL query to insert the new item
const sql = `INSERT INTO inventory_table (
  product_name, 
  batch_number, 
  lot_number, 
  manufacturing_date, 
  manufacturing_area, 
  manufacturer, 
  expiry, 
  category, 
  quantity, 
  comments, 
  product_location, 
  threshold
) VALUES (
  '${formValues.productName}', 
  '${formValues.batch}', 
  '${formValues.lot}', 
  '${formValues.manufacturingDate}', 
  '${formValues.manufacturingArea}', 
  '${formValues.manufacturer}', 
  '${formValues.expiry}', 
  '${formValues.category}', 
  '${formValues.quantity}', 
  '${formValues.comments}', 
  '${formValues.productLocation}', 
  '${formValues.thershold}'
)`;

// Execute the SQL query and pass the result to the callback function
connection.query(sql, callback);
};

    res.sendStatus(200);
  } catch (err) {
    console.error('Error while deleting from the inventory_table: ', err);
    res.status(500).send('Internal server error');
  }
});

app.listen(3001, () => {
  console.log('Server started on port 3001');
});
