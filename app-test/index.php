<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Page Title</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="css/style.css">
</head>

<body>
    <!-- <div class='cursor'></div> -->
    <header>
        <div class="container">
            <div class="header-flex">
                <!-- <img src="" alt="Logo" style="height: 50px;"> -->
                <div class="left-logo">
                    <img src="images/logo.svg" alt="">
                </div>

                <div id="user-info">
                    <?php
                    session_start();
                    if (isset($_SESSION["user"])) {
                        echo "Hello, " . $_SESSION["user"] . "!   <a href='logout.php'>Logout</a>";
                    } else {
                        echo "<a href='register.php'>Register</a>  <a href='login.php'>Login</a>";
                    }
                    ?>
                </div>
            </div>
        </div>

    </header>
    <main>
        <section class="add">
            <div class="container">
                <div id="customPopup" class="popup">
                    <p id="popupMessage"></p>
                </div>

                <div id="overlay" class="overlay"></div>

                <h1>Quick Reminder</h1>
                <h2>your shopping list for next time</h2>
            <div>
                <form id="productForm">
                    
                    <!-- <label for="productName">Product Name:</label> -->
                    <input type="text" id="productName" name="productName" placeholder="What to buy?" required>

                    <!-- <label for="productQuantity">Product Quantity:</label> -->
                    <input type="number" id="productQuantity" name="productQuantity" placeholder="Numbers to buy?">

                    <!-- <label for="storeName">Store Name:</label> -->
                    <input type="text" id="storeName" name="storeName" placeholder="Where to buy?">

                    <!-- <label for="shoptype">Shop Type:</label> -->
                    <select id="shoptype" name="shoptype">
                        <option value="online">Online Shopping</option>
                        <option value="offline">Offline Shopping</option>
                    </select>

                    <button type="button" id="submitBtn" onclick="addProduct()">Add</button>
                </form>

        </section>


        <section>
            <div class="container">
                <ul id="productList">

                </ul>
            </div>
        </section>

    </main>

    <script src="./js/index.js"></script>


    <!-- <script src="./js/gsap.min.js"></script> -->

</body>

</html>