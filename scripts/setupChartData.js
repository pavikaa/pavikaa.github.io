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
    }
    if (user == null) {
        window.location.href = '../index.html';
    }

});
var loggedInPlayerId = sessionStorage.getItem('loggedInUser');
var loggedInPlayerName;
var rootRef = firebase.database().ref();
var teamsRef = rootRef.child("Teams");
var playersRef = rootRef.child("Players");
var playerNames = [
    [, , , ]
];
var teamNames = [];
playersRef.once("value", function (snapshot) {
    loggedInPlayerName = snapshot.child(loggedInPlayerId).child("fullName").val();
});
teamsRef.on("value", function (snapshot) {
    var i = 0;
    snapshot.forEach(function (childSnapshot) {
        if (childSnapshot.child("Players").child(loggedInPlayerName).exists()) {
            i++;
            var teamName = childSnapshot.child("name").val();
            teamNames.push(teamName);
            childSnapshot.forEach(function (grandChildSnapshot) {
                grandChildSnapshot.forEach(function (playersSnapshot) {
                    var playerName = playersSnapshot.key;
                    var playerWins = playersSnapshot.child("Wins").val();
                    var playerGames = playersSnapshot.child("Played").val();
                    playerNames.push([i, playerName, playerGames, playerWins]);

                });
            });
        }
    });

    for (var j = 1; j <= 10; j++) {
        var chartPlayerNames = [];
        var chartPlayerGames = [];
        var chartPlayerWins = [];
        var chartGameToWinRatio = []
        var counter = 0;
        for (var l = 0; l < playerNames.length; l++) {
            if (playerNames[l][0] == j) {
                counter++;
                console.log(counter);
            }
        }
        for (var k = 0; k < counter; k++) {
            if (playerNames[k][0] == j) {
                chartPlayerNames.push(playerNames[k][1]);
                chartPlayerGames.push(playerNames[k][2]);
                chartPlayerWins.push(playerNames[k][3]);
                chartGameToWinRatio.push(Math.round(100 * playerNames[k][3] / playerNames[k][2]))
                console.log(chartPlayerNames[k]);
            } else
                counter++;
        }
var titleIgre,titlePobjede,titleOmjer;
if(j==1)
{
    titleIgre='Igre';
    titlePobjede='Pobjede';
    titleOmjer='Omjer pobjeda i igara';
}
else
{
    titleIgre='';
    titlePobjede='';
    titleOmjer='';
}
        var myChart = document.getElementById('chart' + j + 1).getContext('2d');
        var massPopChart = new Chart(myChart, {
            type: 'pie',
            data: {
                labels: chartPlayerNames,
                datasets: [{
                    label: 'Vrijednosti',
                    data: chartPlayerWins,
                    backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
                }]
            },
            options: {
                title: {
                    display: true,
                    text: titleIgre,
                    fontSize: 20
                }
            }

        });
        var myChart = document.getElementById('chart' + j + 2).getContext('2d');
        var massPopChart = new Chart(myChart, {
            type: 'pie',
            data: {
                labels: chartPlayerNames,
                datasets: [{
                    label: 'Vrijednosti',
                    data: chartPlayerGames,
                    backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
                }]
            },
            options: {
                title: {
                    display: true,
                    text: titlePobjede,
                    fontSize: 20
                }
            }
        });
        var myChart = document.getElementById('chart' + j + 3).getContext('2d');
        var massPopChart = new Chart(myChart, {
            type: 'pie',
            data: {
                labels: chartPlayerNames,
                datasets: [{
                    label: 'Vrijednosti',
                    data: chartGameToWinRatio,
                    backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
                }]
            },
            options: {
                title: {
                    display: true,
                    text: titleOmjer,
                    fontSize: 20
                }
            }

        });
    }
});