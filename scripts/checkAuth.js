firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        var user = firebase.auth().currentUser;
    }
    if (user == null) {
        window.location.href = '../index.html';
    }
});