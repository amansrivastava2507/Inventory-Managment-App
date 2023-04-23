const express = require('express');
const connection = require('./connection');

const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

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

// Function to delete an inventory item from the table
exports.deleteInventoryItem = (product_name, callback) => {
  // Construct a SQL query to delete the item with the specified product ID
  const sql = `DELETE FROM inventory_table WHERE product_name = ${product_name}`;

  // Execute the SQL query and pass the result to the callback function
  connection.query(sql, callback);
};
