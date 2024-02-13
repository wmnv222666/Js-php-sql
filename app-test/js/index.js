// Declare productList globally
const productList = [];

// Function to check if the user is logged in
function isLoggedIn() {
    return fetch('check_login.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => data.logged_in)
        .catch(error => {
            console.error('Fetch error:', error);
            return false;
        });
}


async function updateProductList(products) {
    // console.log('Updating product list:', products);

    var productListElement = document.getElementById("productList");
    productListElement.innerHTML = ''; // Clear the existing list

    // Create a new list with edit and delete buttons
    products.forEach(function (product) {
        var listItem = document.createElement('li');
        listItem.classList.add('tobuy');

        listItem.innerHTML = `
            ${product.productName} (Quantity: ${product.productQuantity}, Store: ${product.storeName}, Shop Type: ${product.shoptype})
            <button onclick="editProduct(${product.productID})"><i class="fa-solid fa-pen"></i></button>
            <button onclick="deleteProduct(${product.productID})"><i class="fa-solid fa-trash"></i></button>
            <button id="product_${product.productID}" class="completed-btn" onclick="markProduct(${product.productID})"><i class="fa-regular fa-circle-check"></i></button>
        `;

        productListElement.appendChild(listItem);
    });

    // Update the global productList array
    // if (!Array.isArray(productList)) {
    //     // console.error('productList is not an array:', productList);
    //     productList = []; // Reset productList to an empty array
    // }

    productList.length = 0; // Clear existing products
    productList.push(...products); // Add new products
    loadCompletedStateFromLocalStorage();

    // console.log('Updated product list:', productList);
}



async function fetchProductList() {
    const response = await fetch('select.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const products = await response.json();

    return products;
}

async function displayProductList() {
    try {
        // Check if the user is logged in
        var loggedIn = await isLoggedIn();
        console.log(loggedIn, "loggedIn");

        if (!loggedIn) {
            // Optionally, you can show a message or perform other actions
            console.log("User is not logged in. Displaying product list is skipped.");
            return;
        }

        // Fetch the product list
        const products = await fetchProductList();
        console.log('Products:', products);

        // Update the product list in the HTML
        updateProductList(products);
    } catch (error) {
        console.error(error);
        // Handle error if needed
    }
}


// Function to add a new product
async function addProduct() {
    try {
        // Check if the user is logged in
        var loggedIn = await isLoggedIn();

        if (!loggedIn) {
            window.location.href = 'login.php'; // Redirect to login page if not logged in
            return;
        }

        var productName = document.getElementById("productName").value.trim();
        var productQuantityInput = document.getElementById("productQuantity");
        var productQuantity = parseFloat(productQuantityInput.value.trim());
        var storeName = document.getElementById("storeName").value.trim();
        var shoptype = document.getElementById("shoptype").value;

        if (!productName || isNaN(productQuantity) || productQuantity <= 0) {
            alert('Please fill in the required fields with valid values.');
            return;
        }

        // Check if the product already exists in the local list
        if (productList.find(item => item.productName === productName && item.storeName === storeName && item.shoptype === shoptype)) {
            alert('This data already exists in the list.');
            return;
        }

        // Make a fetch request to add the product
        var response = await fetch('insert.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productName: productName,
                productQuantity: productQuantity,
                storeName: storeName,
                shoptype: shoptype
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        var data = await response.json();
        console.log(data.message);

        // Refresh the product list after adding
        const products = await fetchProductList();
        updateProductList(products);
        loadCompletedStateFromLocalStorage();

        // Clear input fields
        document.getElementById("productName").value = '';
        productQuantityInput.value = '';
        document.getElementById("storeName").value = '';
        document.getElementById("shoptype").value = 'online';
    } catch (error) {
        console.error('Error adding product:', error);
    }
}


// Function to delete a product
async function deleteProduct(productId) {
    console.log(productId, "productId");
    const confirmDelete = confirm('Are you sure you want to delete this product?');

    if (!confirmDelete) {
        return; // If the user cancels the deletion, do nothing
    }
    try {
        // Check if the user is logged in
        if (!await isLoggedIn()) {
            window.location.href = 'login.php'; // Redirect to login page if not logged in
            return;
        }

        // Make a fetch request to delete the product
        const response = await fetch('delete.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId: productId }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        console.log(responseData.message, "aaa");
        displayProductList(); // Refresh the product list after deletion
        loadCompletedStateFromLocalStorage();

    } catch (error) {
        console.error(error);
        // Handle error if needed
    }
}


async function editProduct(productId) {
    //  console.log(productId,"productId111")
    try {
        // Fetch current product details
        const productDetailsResponse = await fetch(`select.php?productId=${productId}`, {
            method: 'GET', // Make sure to explicitly specify the method
        });

        const productDetails = await productDetailsResponse.json();
        // console.log('Product Details:', productDetails);

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
            alert('Error: Unable to load product details.');
            console.error('Incomplete or missing product details.');
        }
    } catch (error) {
        console.error(error);
        // Handle error if needed
    }
}



// Function to update an existing product
async function updateProduct(productId) {
    console.log(productId, "productId")
    try {
        // Get updated data from the form
        const updatedData = {
            productName: document.getElementById('productName').value,
            productQuantity: document.getElementById('productQuantity').value,
            storeName: document.getElementById('storeName').value,
            shoptype: document.getElementById('shoptype').value,
        };

        //     // Make a fetch request to update the product
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
        loadCompletedStateFromLocalStorage();


        // Clear form fields
        document.getElementById('productName').value = '';
        document.getElementById('productQuantity').value = '';
        document.getElementById('storeName').value = '';
        document.getElementById('shoptype').value = 'online';

        // Change the button back to Add
        document.getElementById('submitBtn').innerText = 'Add';
        document.getElementById('submitBtn').onclick = addProduct;
        // Show a success alert
        // Show a success popup
        alert('Product list updated successfully!');
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

        const listItem = document.getElementById(`product_${productId}`);

        if (listItem) {
            listItem.classList.toggle('completed');

            // Check if the product is marked as completed
            const isCompleted = listItem.classList.contains('completed');

            // Update the completed state in localStorage
            updateLocalStorage(productId, isCompleted);

            // alert('Product marked as completed!');
        } else {
            console.error(`Element with ID 'product_${productId}' not found.`);
        }
    } catch (error) {
        console.error(error);
        // Handle error if needed
    }
}


// Function to update the completed state in localStorage
function updateLocalStorage(productId, isCompleted) {
    // Get the current localStorage data or initialize an empty object
    const localStorageData = JSON.parse(localStorage.getItem('productCompleted')) || {};

    // Update the completed state for the specified productId
    localStorageData[productId] = isCompleted;

    // Save the updated data back to localStorage
    localStorage.setItem('productCompleted', JSON.stringify(localStorageData));
}

// Function to load completed state from localStorage and apply it to the UI
function loadCompletedStateFromLocalStorage() {
    const localStorageData = JSON.parse(localStorage.getItem('productCompleted')) || {};

    for (const productId in localStorageData) {
        const isCompleted = localStorageData[productId];
        const listItem = document.getElementById(`product_${productId}`);

        if (listItem) {
            // Apply completed class based on localStorage data
            if (isCompleted) {
                listItem.classList.add('completed');
            }
        }
    }
}

// Attach the displayProductList function to an event (e.g., page load)
// document.addEventListener('DOMContentLoaded', () => {
//     displayProductList();
//     loadCompletedStateFromLocalStorage();
// });
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Check if the user is logged in
        const loggedIn = await isLoggedIn();

        if (!loggedIn) {
            window.location.href = 'login.php'; // Redirect to login page if not logged in
            return;
        }

        // Fetch the product list
        const products = await fetchProductList();
        console.log('Products:', products);

        // Update the product list in the HTML
        updateProductList(products);

        // Load completed state from localStorage
        loadCompletedStateFromLocalStorage();
    } catch (error) {
        console.error(error);
        // Handle error if needed
    }
});