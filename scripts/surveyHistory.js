function loadSurveys() {
    firebase.database().ref().child("ankete").once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var user = firebase.auth().currentUser;
            if (user.uid == childSnapshot.child("tvorac").val()) {
                var listItem = document.createElement('button');
                var title = '';
                listItem.classList.add('list-group-item');
                listItem.classList.add('list-group-item-action');
                listItem.dataset.toggle = "modal";
                listItem.dataset.target = "#statsModal";
                listItem.style = "cursor:pointer;"
                listItem.id = childSnapshot.key;
                listItem.addEventListener('click', loadStats);
                childSnapshot.child("pitanja").forEach(function (questionSnapshot) {
                    title += questionSnapshot.child("0").val();
                    title += ", ";
                });
                listItem.innerHTML = truncateString(title, 20);
                document.getElementById("surveyList").appendChild(listItem);
            }
        });
    });

}

function truncateString(str, num) {
    if (str.length <= num) {
        return str.slice(0, str.length - 2);
    }
    return str.slice(0, num) + '...'
}

function loadStats() {
    var clickedItemID = this.id;
    var questionNumber = 0;
    document.getElementById("charts").innerHTML = "";
    firebase.database().ref().child("ankete").once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            if (childSnapshot.key == clickedItemID) {
                childSnapshot.child("pitanja").forEach(function (questionSnapshot) {
                    var question;
                    var answers = [];
                    var results = [];
                    question = questionSnapshot.child("0").val();
                    questionSnapshot.child("1").forEach(function (answersSnapshot) {
                        var answer = answersSnapshot.child("0").val();
                        var result = answersSnapshot.child("1").val();
                        answers.push(answer);
                        results.push(result);
                    });
                    var canvas = document.createElement('canvas');
                    canvas.id = "canvas" + questionNumber;
                    document.getElementById("charts").appendChild(canvas);
                    var ctx = document.getElementById("canvas" + questionNumber).getContext('2d');
                    var myChart = new Chart(ctx, {
                        type: 'pie',
                        data: {
                            labels: answers,
                            datasets: [{
                                data: results,
                                backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"]
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: question
                                }
                            }

                        }
                    });
                    questionNumber++;
                });
            }
        });
    });

}