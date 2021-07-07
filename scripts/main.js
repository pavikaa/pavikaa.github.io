var answerCounter = 1;
var questionCounter = 0;
var questions = [];
var answers = [];
var dateTime, dueDate, surveyLength;

function loadQuestion() {
    var question = document.getElementById("question").value;
    for (var i = 0; i < answerCounter; i++) {
        var answer = document.getElementById("answer" + i).value;
        if (answer.length != 0)
            answers.push([answer, 0]);
        else {
            answers = [];
        }
    }
    if (question.length != 0 && answers.length != 0) {
        questions.push([question, answers]);
        answers = [];
    } else
        alert("Neka polja su prazna.");
}

function newQuestion() {
    loadQuestion();
    if (questions.length != 0) {
        document.getElementById("questions").innerHTML = "";
        var newQuestionInput = document.createElement('input');
        newQuestionInput.classList.add('form-control');
        newQuestionInput.classList.add('mt-2');
        newQuestionInput.placeholder = "Unesite pitanje";
        newQuestionInput.id = "question"
        document.getElementById("questions").appendChild(newQuestionInput);
        document.getElementById("answers").innerHTML = "";
        var newAnswerInput = document.createElement('input');
        newAnswerInput.classList.add('form-control');
        newAnswerInput.classList.add('mt-2');
        newAnswerInput.placeholder = "Unesite odgovor";
        newAnswerInput.id = "answer0"
        document.getElementById("answers").appendChild(newAnswerInput);
        answerCounter = 1;
        questionCounter++;
    } else {
        alert("Neka polja su prazna.");
    }
}


function addAnswer() {
    var newAnswerInput = document.createElement('input');
    newAnswerInput.classList.add('form-control');
    newAnswerInput.classList.add('input-group');
    newAnswerInput.classList.add('mt-2');
    newAnswerInput.placeholder = "Unesite odgovor";
    newAnswerInput.id = "answer" + answerCounter;
    
    answerCounter++;

    var newButtonSpan = document.createElement('span');
    newButtonSpan.classList.add('input-group-btn');
    newButtonSpan.classList.add('mt-2');
    newButtonSpan.classList.add('ml-1');
    var newButton = document.createElement('button');
    newButton.classList.add('btn');
    newButton.classList.add('btn-danger');
    var newSvg = document.createElement('svg');
    newSvg.setAttribute('xmlns',"http://www.w3.org/2000/svg");
    newSvg.setAttribute('width',"16");
    newSvg.setAttribute('height',"16");
    newSvg.setAttribute('fill',"currentColor");
    newSvg.setAttribute('viewBox',"0 0 16 16");
    newSvg.classList.add('bi'); newSvg.classList.add('bi-dash-lg'); 
    var newPath = document.createElement('path');
    newPath.setAttribute('d', "M0 8a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1z");
    newSvg.appendChild(newPath);
    newButton.appendChild(newSvg);
    newButtonSpan.appendChild(newButton);
    newAnswerInput.appendChild(newButtonSpan);

    document.getElementById("answers").appendChild(newAnswerInput);


}

function reload() {
    document.getElementById("questions").innerHTML = "";
    var newQuestionInput = document.createElement('input');
    newQuestionInput.classList.add('form-control');
    newQuestionInput.classList.add('mt-2');
    newQuestionInput.placeholder = "Unesite pitanje";
    newQuestionInput.id = "question"
    document.getElementById("questions").appendChild(newQuestionInput);
    document.getElementById("answers").innerHTML = "";
    var newQuestionInput = document.createElement('input');
    newQuestionInput.classList.add('form-control');
    newQuestionInput.classList.add('mt-2');
    newQuestionInput.placeholder = "Unesite odgovor";
    newQuestionInput.id = "answer0"
    document.getElementById("answers").appendChild(newQuestionInput);
    questions = [];
    answers = [];
    surveyLength = null;
    dateTime = null;
    questionCounter = 0;
    answerCounter = 1;
}

function loadTime() {
    dueDay = new Date(document.getElementById("time").value);
    var dDate = dueDay.getDate() + '.' + (dueDay.getMonth() + 1) + '.' + dueDay.getFullYear();
    var dTime = dueDay.getHours() + ":" + dueDay.getMinutes();
    dueDate = dDate + ' ' + dTime;
    var today = new Date();
    var date = today.getDate() + '.' + (today.getMonth() + 1) + '.' + today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes();
    dateTime = date + ' ' + time;
}

function uploadToFirebase() {
    var database = firebase.database();
    var user = firebase.auth().currentUser;
    var code = makecode(6);
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
            tvorac: user.uid
        });
    }
}

function makecode(length) {
    var result = '';
    var characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    firebase.database().ref().child("ankete").once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            if (childSnapshot.child("kod").val() == result)
                makecode(length);
        });
    });
    return result;
}

function logout() {
    firebase.auth().signOut();
}