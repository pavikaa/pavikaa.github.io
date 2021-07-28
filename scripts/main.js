var answerCounter = 0;
var questionCounter = 0;
var questions = [];
var answers = [];
var dateTime, dueDate, surveyLength;


function logout() {
    firebase.auth().signOut();
}

function reload() {
    document.getElementById("deadline").value = "";
    document.getElementById("length").value = "";

    answerCounter = 0;

    createQuestionForm();

    questions = [];
    answers = [];
    surveyLength = null;
    dateTime = null;
    questionCounter = 0;
}

function addAnswer() {
    document.getElementById("answerGroup" + (answerCounter) + "Btn").innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-lg" viewBox="0 0 16 16"><path d="M0 8a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1z"/></svg>'
    document.getElementById("answerGroup" + (answerCounter) + "Btn").classList.remove('btn-success');
    document.getElementById("answerGroup" + (answerCounter) + "Btn").classList.add('btn-danger');
    document.getElementById("answerGroup" + (answerCounter) + "Btn").setAttribute('onclick', "removeAnswer(this.id);");

    answerCounter++;

    createQuestion();
}




function newQuestion() {
    loadQuestion();

    if (questions.length != 0) {
        answerCounter = 0;
        createQuestionForm();
        questionCounter++;
    }
}

function loadQuestion() {
    var question = document.getElementById("question").value;

    for (var i = 0; i <= answerCounter; i++) {
        var answer = document.getElementById("answer" + i);
        if (answer) {
            answer = answer.value;
            if (answer.length != 0)
                answers.push([answer, 0]);
        }
    }
    if (question.length != 0 && answers.length != 0) {
        questions.push([question, answers]);
        answers = [];
    } else
        alert("Neka polja su prazna.");
}





function loadTime() {
    dueDay = new Date(document.getElementById("deadline").value);

    var dDate = dueDay.getDate() + '.' + (dueDay.getMonth() + 1) + '.' + dueDay.getFullYear();
    var dTime = dueDay.getHours() + ":" + dueDay.getMinutes();

    dueDate = dDate + ' ' + dTime;

    var today = new Date();
    var date = today.getDate() + '.' + (today.getMonth() + 1) + '.' + today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes();

    dateTime = date + ' ' + time;
    surveyLength = document.getElementById("length").value;
}

function uploadToFirebase() {
    var database = firebase.database();
    var user = firebase.auth().currentUser;
    var code = makecode(6, "Survey");

    document.getElementById("code").innerHTML = code;

    var newSurveyKey = firebase.database().ref().child('ankete').push().key;

    if (questions.length == 0) {
        alert("Ostavili ste neka polja prazna, molim provjerite.")
        code = "Pokušajte ponovo."
        document.getElementById("code").innerHTML = code;
    } else {
        database.ref('ankete/' + newSurveyKey).set({
            kod: code,
            rokZaPredaju: dueDate,
            vrijemeIzrade: dateTime,
            pitanja: questions,
            tvorac: user.uid,
            trajanje: surveyLength
        });
        reload();
    }
}

function createGroup() {
    var groupName = document.getElementById("groupName").value;

    var groupCode = makecode(6, "Group");
    var database = firebase.database();
    var user = firebase.auth().currentUser;
    var newGroupKey = firebase.database().ref().child('grupe').push().key;
    if (groupName.length != 0) {
        database.ref('grupe/' + user.uid + "/" + newGroupKey).set({
            ime: groupName,
            kod: groupCode
        });
    } else
        alert("Niste unjeli ime grupe")
}

function removeAnswer(clickedId) {
    document.getElementById(clickedId.substring(0, clickedId.length - 3)).remove();
}

function loadGroups() {
    var checkIfAnyGroupExists = false;
    var user = firebase.auth().currentUser;
    firebase.database().ref().child("grupe").child(user.uid).once("value", function (snapshot) {
        document.getElementById("table").innerHTML = "";
        var table = document.createElement('table');
        table.classList.add('table');
        var tr = document.createElement('tr');
        var thName = document.createElement('th');
        thName.innerHTML = "Naziv grupe";
        var thCode = document.createElement('th');
        thCode.innerHTML = "Kod grupe";
        tr.appendChild(thName);
        tr.appendChild(thCode);
        table.appendChild(tr);

        snapshot.forEach(function (childSnapshot) {
            var tr = document.createElement('tr');
            var tdName = document.createElement('td');
            tdName.innerHTML = childSnapshot.child("ime").val();
            var tdCode = document.createElement('td');
            tdCode.innerHTML = childSnapshot.child("kod").val();
            tr.appendChild(tdName);
            tr.appendChild(tdCode);
            table.appendChild(tr);
            if (tdName.length != 0 && tdCode.length != 0)
                checkIfAnyGroupExists = true;

        });
        if (checkIfAnyGroupExists)
            document.getElementById("table").appendChild(table);
        else {
            var h4 = document.createElement('h4');
            h4.classList.add('text-center');
            h4.innerHTML = "Nemate niti jednu grupu";
            document.getElementById("table").appendChild(h4);
        }
    });

}

function createQuestionForm() {
    document.getElementById("questions").innerHTML = "";
    var newQuestionInput = document.createElement('input');
    newQuestionInput.classList.add('form-control');
    newQuestionInput.classList.add('mt-2');
    newQuestionInput.placeholder = "Unesite pitanje";
    newQuestionInput.id = "question"
    newQuestionInput.autocomplete = "off";

    document.getElementById("questions").appendChild(newQuestionInput);
    document.getElementById("answers").innerHTML = "";

    createQuestion();
}

function createQuestion() {
    var newAnswerDiv = document.createElement('div');
    newAnswerDiv.classList.add('input-group');
    newAnswerDiv.id = "answerGroup" + answerCounter;

    var newAnswerInput = document.createElement('input');
    newAnswerInput.classList.add('form-control');
    newAnswerInput.classList.add('mt-2');
    newAnswerInput.placeholder = "Unesite odgovor";
    newAnswerInput.type = "text";
    newAnswerInput.autocomplete = "off";
    newAnswerInput.id = "answer" + answerCounter;

    var newButtonSpan = document.createElement('span');
    newButtonSpan.classList.add('input-group-btn');
    newButtonSpan.classList.add('mt-2');
    newButtonSpan.classList.add('ml-1');

    var newButton = document.createElement('button');
    newButton.classList.add('btn');
    newButton.classList.add('btn-success');
    newButton.setAttribute('onclick', "addAnswer();");
    newButton.id = "answerGroup" + answerCounter + "Btn";

    var newSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    newSvg.classList.add('bi');
    newSvg.classList.add('bi-plus-lg');
    newSvg.setAttribute('xmlns', "http://www.w3.org/2000/svg");
    newSvg.setAttribute('width', "16");
    newSvg.setAttribute('height', "16");
    newSvg.setAttribute('fill', "currentColor");
    newSvg.setAttribute('viewBox', "0 0 16 16");
    newSvg.innerHTML = '<path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z"></path>';

    newButton.appendChild(newSvg);
    newButtonSpan.appendChild(newButton);

    newAnswerDiv.appendChild(newAnswerInput);
    newAnswerDiv.appendChild(newButtonSpan);

    document.getElementById("answers").appendChild(newAnswerDiv);
}

function makecode(length, purpose) {
    var result = '';
    var characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    if (purpose == "Survey") {
        firebase.database().ref().child("ankete").once("value", function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                if (childSnapshot.child("kod").val() == result)
                    makecode(length, "Survey");
            });
        });
    } else {
        firebase.database().ref().child("grupe").once("value", function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                childSnapshot.forEach(function (groupCodeSnaphot) {
                    if (groupCodeSnaphot.child("kod").val() == result)
                        makecode(length, "Group");
                });
            });

        });
    }
    return result;
}