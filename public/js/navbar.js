  // this function takes in a list of products and adds them to the products drop down menu
  // there are 5 products per row in the drop down menu table and a new row is made if this limit is reached
  // the list has a hashmap which has the keys PID, name, and thumbnail_img_location
  // for each product, a new table cell is made with the product name and thumbnail image
  // the table cell is then appended to the table row
  // the table row is then appended to the table
  // the table is then appended to the products drop down menu
  // the class of each cell will be product_cell, and the ID of each cell will be the PID_cell where PID is the product ID
  // Function to modify the prod-dropdown table
  // Function to modify the prod-dropdown table
  function populateDropdown(products) {
      const table = document.getElementById("proddrop");
    
      let currentRow;
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const { PID, name, thumbnail_img_location } = product;
    
        if (i % 5 === 0) {
          // Create a new table row for every 5 products
          currentRow = document.createElement("tr");
          table.appendChild(currentRow);
        }
    
        // Create a new button for each product
        const button = document.createElement("button");
        button.classList.add("product_button");
        button.id = `${PID}_button`;
    
        // Create the product name element
        const nameElement = document.createElement("span");
        nameElement.textContent = name;
    
        // Create the thumbnail image element
        const imageElement = document.createElement("img");
        imageElement.src = thumbnail_img_location;
        imageElement.alt = name;
    
        // Append the name and thumbnail image elements to the button
        button.appendChild(imageElement);
        button.appendChild(nameElement);
    
        // Create a table cell and append the button to it
        const cell = document.createElement("td");
        cell.appendChild(button);
    
        // Append the cell to the current row
        currentRow.appendChild(cell);
      }
    }