firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        var user = firebase.auth().currentUser;
        var userID = firebase.auth().currentUser.uid;
        sessionStorage.setItem('loggedInUser', userID);
        if (user == null) {
            document.getElementById("login_div").style.display = "block";
        }
        if (user != null) {
            window.location.href = '/pages/main.html';
        }
    }
});

function register() {
    var userEmail = document.getElementById("email").value;
    var userPass = document.getElementById("password").value;
    var userPass2 = document.getElementById("password2").value;
    if (userEmail != "" && userPass != "") {
        if (userPass == userPass2) {
            firebase.auth().createUserWithEmailAndPassword(userEmail, userPass)
                .then(() => {
                    window.location.href = '/pages/main.html'
                    window.alert("Uspješno ste se registrirali.");
                })
                .catch((error) => {
                    var errorMessage = error.message;
                    var errorMessage = error.message;
                    window.alert("Error : " + errorMessage);
                });
        } else
            window.alert("Unesene lozinke se ne podudaraju.");
    } else
        window.alert("Neka od polja su prazna.");
}