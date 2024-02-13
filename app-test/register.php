<?php
session_start();
if (isset($_SESSION["user"])) {
    header("Location: index.php");
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Form</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css"
        integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
    <link rel="stylesheet" href="css/login.css">
</head>

<body>
    <section>
        <div class="container">
            <div class="card">
                <?php
                if (isset($_POST["submit"])) {
                    $fullName = $_POST["fullname"];
                    $email = $_POST["email"];
                    $password = $_POST["password"];
                    $passwordRepeat = $_POST["repeat_password"];

                    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

                    $errors = array();

                    if (empty($fullName) or empty($email) or empty($password) or empty($passwordRepeat)) {
                        array_push($errors, "All fields are required");
                    }
                    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                        array_push($errors, "Email is not valid");
                    }
                    if (strlen($password) < 8) {
                        array_push($errors, "Password must be at least 8 charactes long");
                    }
                    if ($password !== $passwordRepeat) {
                        array_push($errors, "Password does not match");
                    }
                    require_once "./config/dbconnect.php";
                    $sql = "SELECT * FROM Users WHERE email = '$email'";
                    $result = mysqli_query($conn, $sql);
                    $rowCount = mysqli_num_rows($result);
                    if ($rowCount > 0) {
                        array_push($errors, "Email already exists!");
                    }
                    if (count($errors) > 0) {
                        foreach ($errors as $error) {
                            echo "<div class='alert alert-danger'>$error</div>";
                        }
                    } else {

                        $sql = "INSERT INTO Users (full_name, email, password) VALUES ( ?, ?, ? )";
                        $stmt = mysqli_stmt_init($conn);
                        $prepareStmt = mysqli_stmt_prepare($stmt, $sql);
                        if ($prepareStmt) {
                            mysqli_stmt_bind_param($stmt, "sss", $fullName, $email, $passwordHash);
                            mysqli_stmt_execute($stmt);
                            echo "<div class='alert alert-success'>You are registered successfully.</div>";
                        } else {
                            die("Something went wrong");
                        }
                    }


                }
                ?>
                <form action="register.php" method="post" class="left">
                    <div class="form-group">
                        <input type="text" class="form-control" name="fullname" placeholder="User Name:">
                    </div>
                    <div class="form-group">
                        <input type="email" class="form-control" name="email" placeholder="Email:">
                    </div>
                    <div class="form-group">
                        <input type="password" class="form-control" name="password" placeholder="Password:">
                    </div>
                    <div class="form-group">
                        <input type="password" class="form-control" name="repeat_password"
                            placeholder="Repeat Password:">
                    </div>
                    <div class="form-btn">
                        <input type="submit" class="btn btn-primary" value="Register" name="submit">
                    </div>
                    <div>
                        <div>
                            <p>Already Registered <a href="login.php">Login Here</a></p>
                        </div>
                    </div>
                </form>
                <div class="right">
                    <figure><img src="images/register_img.png" alt="sing up image"></figure>
                </div>

            </div>
        </div>
    </section>

</body>

</html>