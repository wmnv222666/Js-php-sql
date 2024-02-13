<?php
session_start();
if (isset($_SESSION["user"])) {
    header("Location: index.php");
    exit();
}

require_once "./config/dbconnect.php";

if (isset($_POST["login"])) {
    $email = $_POST["email"];
    $password = $_POST["password"];

    $sql = "SELECT * FROM Users WHERE email = '$email'";
    $result = mysqli_query($conn, $sql);
    $user = mysqli_fetch_array($result, MYSQLI_ASSOC);

    if ($user) {
        if (password_verify($password, $user["password"])) {

            $_SESSION["userID"] = $user["userID"];
            $_SESSION["user"] = $user["full_name"];
            header("Location: index.php");
            exit();
        } else {
            echo "<div class='alert alert-danger'>Password does not match</div>";
        }
    } else {
        echo "<div class='alert alert-danger'>Email does not match</div>";
    }
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Form</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css"
        integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
    <link rel="stylesheet" href="css/login.css">
</head>

<body>

    <main>
        <section>
            <div class="container">
                <div class="card">
                    <div class="left">
                        <figure><img src="images/login_img.png" alt="sing up image"></figure>
                    </div>

                    <div class="right">
                        <?php if (isset($_SESSION["userID"])): ?>
                            Hello,
                            <?= $_SESSION["user"] ?>! | <a href='logout.php'>Logout</a>
                        <?php else: ?>
                            <form action="login.php" method="post" class="right">
                                <div class="form-group">
                                    <input type="email" placeholder="Enter Email:" name="email" class="form-control">
                                </div>
                                <div class="form-group">
                                    <input type="password" placeholder="Enter Password:" name="password"
                                        class="form-control">
                                </div>
                                <div class="form-btn">
                                    <input type="submit" value="Login" name="login" class="btn btn-primary">
                                </div>
                                <div>
                                    <p>Not registered yet <a href="register.php">Register Here</a></p>
                                </div>
                            </form>
                        <?php endif; ?>
                    </div>
                </div>
        </section>
    </main>



</body>

</html>