var firebaseConfig = {
  apiKey: "AIzaSyD4fHPPi-1jpURi2p_W-56sNrT2SsYjVx8",
  authDomain: "orwmaprojekt-c9cbb.firebaseapp.com",
  databaseURL: "https://orwmaprojekt-c9cbb-default-rtdb.firebaseio.com",
  projectId: "orwmaprojekt-c9cbb",
  storageBucket: "orwmaprojekt-c9cbb.appspot.com",
  messagingSenderId: "972506753102",
  appId: "1:972506753102:web:cfdc1c43572e615e0a3b1f"
};
firebase.initializeApp(firebaseConfig);
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    var user = firebase.auth().currentUser;
    var userID = firebase.auth().currentUser.uid;
    sessionStorage.setItem('loggedInUser', userID);

    if (user == null) {
      document.getElementById("login_div").style.display = "block";
    }
    if (user != null) {
      window.location.href = 'pages/stats.html';
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