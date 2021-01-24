firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    var user = firebase.auth().currentUser;
    var userID = firebase.auth().currentUser.uid;
    sessionStorage.setItem('loggedInUser', userID);

    if (user == null) {
      document.getElementById("login_div").style.display = "block";
    }
    if(user!=null)
    {
      window.location.href = '../pages/stats.html';
    }

  }
});

function login() {

  var userEmail = document.getElementById("email").value;
  var userPass = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function (error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    window.alert("Error : " + errorMessage);
  });
}