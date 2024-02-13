const productList = []; 

// Function to check if the user is logged in
async function isLoggedIn() {
  try {
    const response = await fetch('check_login.php');
    const data = await response.json();
    // console.log(data, 'response');
    displayProductList();
    return data.logged_in;
  } catch (error) {
    console.error(error);
    return false;
  }
  
}
//popup
// Function to show the custom popup with a message
function showPopup(message) {
  const popup = document.getElementById('customPopup');
  const overlay = document.getElementById('overlay');
  const popupMessage = document.getElementById('popupMessage');

  // Set the message
  popupMessage.innerText = message;

  // Display the popup and overlay
  popup.style.display = 'block';
  overlay.style.display = 'block';

  // Automatically hide the popup after 3000 milliseconds (adjust the time as needed)
  setTimeout(function () {
    hidePopup();
  }, 800);
}

// Function to hide the custom popup
function hidePopup() {
  const popup = document.getElementById('customPopup');
  const overlay = document.getElementById('overlay');

  // Hide the popup and overlay
  popup.style.display = 'none';
  overlay.style.display = 'none';
}


async function updateUserInformation() {
  const userElement = document.getElementById('user-info');
  const loggedIn = await isLoggedIn();

  if (loggedIn) {
    // Fetch additional user information (if needed) and update the header
    const userDataResponse = await fetch('get_user_data.php');
    const userData = await userDataResponse.json();

    userElement.innerHTML = `Hello, ${userData.user}! | <a href='logout.php'>Logout</a>`;
  } else {
    userElement.innerHTML = `<a href='register.php'>Register</a> | <a href='login.php'>Login</a>`;
  }
}

// Call the function when the page loads or when the user logs in/out
updateUserInformation();


// Function to display the product list
async function displayProductList() {

  try {
    // Check if the user is logged in
    const loggedIn = await isLoggedIn();
    // console.log(loggedIn, 'loggedIn');

    if (!loggedIn) {
      // Optionally, you can show a message or perform other actions
      console.log('User is not logged in. Displaying product list is skipped.');
      return;
    }

    // User is logged in, continue with the rest of the logic

    // Make a fetch request to fetch the product list
    const response = await fetch('select.php');
    const products = await response.json();

    console.log('Products:', products);

    // Check if there are products to display
    if (products.length > 0) {
      // Products exist, update the product list
      updateProductList(products);
    } else {
      // No products to display, you can show a message or perform other actions
      console.log('No products to display.');
    }
  } catch (error) {
    console.error(error);
    // Handle error if needed
  }
}


// Function to add a new product

async function addProduct() {
  try {
    // Get input values
    const productName = document.getElementById('productName').value.trim();
    const productQuantityInput = document.getElementById('productQuantity');
    const productQuantity = parseFloat(productQuantityInput.value.trim());
    const storeName = document.getElementById('storeName').value.trim();
    const shoptype = document.getElementById('shoptype').value;

    // Check if required fields are not empty and quantity is greater than or equal to 0
    if (!productName || isNaN(productQuantity) || productQuantity < 0) {
      showPopup('Please fill in the required fields with valid values.');
      return;
    }

    // Check if the user is logged in
    const loggedIn = await isLoggedIn();

    if (!loggedIn) {
      showPopup('User is not logged in. Product not added.');
      return;
    }

    // Check if the product already exists in the local list
   // Check if the product already exists in the local list
   if (productList.find(item => item.productName === productName && item.storeName === storeName && item.shoptype === shoptype)) {
      alert('Please enter a valid and unique item.');
      return;
    }

    // Make a fetch request to add the product
    const response = await fetch('insert.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productName: productName,
        productQuantity: productQuantity,
        storeName: storeName,
        shoptype: shoptype,
      }),
    });

    const responseData = await response.json();
    console.log(responseData.message,"aaa");

  

    // Refresh the product list after adding
    displayProductList();
    showPopup('Product added!');
      // Clear input fields
    document.getElementById('productName').value = '';
    productQuantityInput.value = '';
    document.getElementById('storeName').value = '';
    document.getElementById('shoptype').value = 'online';
  } catch (error) {
    console.error(error);
    // Handle error if needed
  }
}

// Function to update the product list in the HTML
function updateProductList(products) {
  try {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; // Clear the existing list

    // Check if the user is logged in
    const loggedIn = isLoggedIn();

    // Create a new list with edit and delete buttons
    products.forEach((product) => {
      const listItem = document.createElement('li');
      listItem.classList.add('tobuy');
      listItem.id = `product_${product.productID}`;

      listItem.innerHTML = `
        ${product.productName} (Quantity: ${product.productQuantity}, Store: ${product.storeName}, Shop Type: ${product.shoptype})
        ${loggedIn ? `<button class="edit-btn" onclick="editProduct(${product.productID})"><i class="fa-solid fa-pen"></i></button>` : ''}
        ${loggedIn ? `<button class="delete-btn" onclick="deleteProduct(${product.productID})"><i class="fa-solid fa-trash"></i></button>` : ''}
        ${loggedIn ? `<button class="completed-btn" onclick="markProduct(${product.productID})"><i class="fa-regular fa-circle-check"></i></button>` : ''}
      `;

      productList.appendChild(listItem);
    });
  } catch (error) {
    console.error(error);
    // Handle error if needed
  }
}



//mark completed
async function markProduct(productId) {
  try {
    // Check if the user is logged in
    const loggedIn = await isLoggedIn();

    if (!loggedIn) {
      window.location.href = 'login.php'; // Redirect to login page if not logged in
      return;
    }
    // Implement your logic here to mark the product (e.g., toggle a line-through style)

    // For example, you can add a CSS class to the list item
    const listItem = document.getElementById(`product_${productId}`);
    listItem.classList.toggle('completed');

  } catch (error) {
    console.error(error);
    // Handle error if needed
  }
}
//Delete
async function deleteProduct(productId) {
  try {
    // Check if the user is logged in
    const loggedIn = await isLoggedIn();

    if (!loggedIn) {
      window.location.href = 'login.php'; // Redirect to login page if not logged in
      return;
    }

    // Make a fetch request to delete the product
    const response = await fetch('delete.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId: productId }),
    });

    const responseData = await response.json();
    console.log(responseData.message);
    // Refresh the product list after deletion
    displayProductList();
    showPopup('Product list delete successfully!');
  } catch (error) {
    console.error(error);
    // Handle error if needed
  }
}

// Function to edit a product
async function editProduct(productId) {
  try {
    // Fetch current product details
    const productDetailsResponse = await fetch(`select.php?productId=${productId}`, {
      method: 'GET', // Make sure to explicitly specify the method
    });

    const productDetails = await productDetailsResponse.json();
    console.log('Product Details:', productDetails);

    if (
      productDetails &&
      productDetails.length > 0 &&
      productDetails[0].productName !== undefined &&
      productDetails[0].productQuantity !== undefined &&
      productDetails[0].storeName !== undefined &&
      productDetails[0].shoptype !== undefined
    ) {
      // Populate the form with current product details
      document.getElementById('productName').value = productDetails[0].productName;
      document.getElementById('productQuantity').value = productDetails[0].productQuantity;
      document.getElementById('storeName').value = productDetails[0].storeName;
      document.getElementById('shoptype').value = productDetails[0].shoptype;

      // Change the button to Update
      document.getElementById('submitBtn').innerText = 'Update';
      document.getElementById('submitBtn').onclick = function () {
        updateProduct(productId);
      };
    } else {
      console.error('Incomplete product details received.');
    }
  } catch (error) {
    console.error(error);
    // Handle error if needed
  }
}


// Function to update an existing product
async function updateProduct(productId) {
  try {
    // Get updated data from the form
    const updatedData = {
      productName: document.getElementById('productName').value,
      productQuantity: document.getElementById('productQuantity').value,
      storeName: document.getElementById('storeName').value,
      shoptype: document.getElementById('shoptype').value,
    };

    // Make a fetch request to update the product
    const response = await fetch('update.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: productId,
        updatedData: updatedData,
      }),
    });

    const responseData = await response.json();
    console.log(responseData.message);

    // Refresh the product list after updating
    displayProductList();

    // Clear form fields
    document.getElementById('productName').value = '';
    document.getElementById('productQuantity').value = '';
    document.getElementById('storeName').value = '';
    document.getElementById('shoptype').value = '';

    // Change the button back to Add
    document.getElementById('submitBtn').innerText = 'Add';
    document.getElementById('submitBtn').onclick = addProduct;
    // Show a success alert
    // Show a success popup
    showPopup('Product list updated successfully!');
  } catch (error) {
    console.error(error);
    // Handle error if needed
  }
}
