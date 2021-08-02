var checkIfResultsExist;

function deleteSurvey(id) {
    firebase.database().ref().child("ankete").child(id).remove();
    alert('Anketa uspješno obrisana.');
}

function loadSurveys() {
    document.getElementById("surveyList").innerHTML = "";
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
                listItem.innerHTML = truncateString(title, 30);
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
    checkIfResultsExist = false;
    document.getElementById("charts").innerHTML = "";
    var deleteSurveyBtn = document.createElement('button');
    deleteSurveyBtn.classList.add('btn');
    deleteSurveyBtn.classList.add('btn-danger');
    deleteSurveyBtn.id = clickedItemID;
    deleteSurveyBtn.setAttribute("onclick", "deleteSurvey(this.id); loadSurveys();");
    deleteSurveyBtn.setAttribute("data-dismiss", "modal");
    deleteSurveyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/></svg>';
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
                        if (result != 0)
                            checkIfResultsExist = true;
                        results.push(result);
                    });
                    if (checkIfResultsExist) {
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
                    }
                });
            }
        });

        if (!checkIfResultsExist) {
            var h4 = document.createElement('h4');
            h4.classList.add('text-center');
            h4.innerHTML = "Odabrana anketa nema rezultata.";
            document.getElementById("charts").appendChild(h4);
        }
    });
    document.getElementById("deleteSurveyBtn").innerHTML = "";
    document.getElementById("deleteSurveyBtn").appendChild(deleteSurveyBtn);
}