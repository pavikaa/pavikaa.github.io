firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    var user = firebase.auth().currentUser;
    var userID = firebase.auth().currentUser.uid;
    sessionStorage.setItem('loggedInUser', userID);
    if (user == null) {
      document.getElementById("login_div").style.display = "block";
    }
    if (user != null) {
      window.location.href = 'pages/main.html';
    }
  }
});

function login() {
  var userEmail = document.getElementById("email").value;
  var userPass = document.getElementById("password").value;
  if (userEmail != "" && userPass != "") {
    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function (error) {
      var errorMessage = error.message;
      window.alert("Error : " + errorMessage);
    });
  } else
    window.alert("Neka od polja su prazna.");
}
