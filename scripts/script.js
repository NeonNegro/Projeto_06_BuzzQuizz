let emptyQuizz = {
    title: null,
    image: null,
    questions: [],
    levels: []
}
let quizz = {...emptyQuizz};
let qtd_questions = null;
let qtd_levels = null;
let emptyQuizzQuestion = {
    title: null,
    color: null,
    answers: []
};
let emptyAnswer = {
    text: null,
    image: null,
    isCorrectAnswer: null
};
let emptyQuizzLevel = {
    title: null,
    image: null,
    text: null,
    minValue: null
}
let dataUserQuizz = {
    id: [],
    key: []
}

const utils = {
    clearScreen: function(field){
        let inputs = document.querySelectorAll(`${field} input`);
        let spans = document.querySelectorAll(`${field} .container span, ${field} span.quizz-title `);
        let imgs = document.querySelectorAll(`${field} .img-container img`);
        inputs.forEach(e => {
            e.classList.remove('alert');
            e.value = '';
            e.nextElementSibling.innerText = '';
        });
        spans.forEach(e => {
            e.innerText = '';
        });
        imgs.forEach(e => {
            e.src= 'imgs/img_not_found.png';
        });
    }
}


const msgsErrors = {
    title : {msg : 'deve ter no mínimo 20 e no máximo 65 caracteres', field : '#title'},
    url :{msg : 'deve ter formato URL', field : '#url'},
    qtd_questions : {msg : 'no mínimo 3 perguntas', field : '#qtd_questions'},
    qtd_levels : {msg : 'no mínimo 2 níveis', field : '#qtd_levels'},
    question_title : {msg : 'deve ter no mínimo 20 caracteres', field : '#question-'},
    question_color : {msg : 'cor inválida', field : '#color-'},
    question_answer : {msg : 'diga a resposta', field : '#answer-'},
    question_anwser_img : {msg : 'deve ter formato URL', field : '#img-'},
    question_answer_incorrect : {msg : 'pelo menos uma incorreta', field : '#incorrect-'},
    question_answer_incorrect_url: {msg : 'deve ter formato URL', field : '#incorrectUrl-'},
    level_title : {msg : 'deve ter no mínimo 10 caracteres', field : '#level-title-'},
    level_min_value : {msg : 'valor entre 0 e 100', field : '#level-percent-'},
    level_img : {msg : 'deve ter formato URL', field : '#level-img-'},
    level_text: {msg : 'deve ter no mínimo 30 caracteres', field : '#level-description-'},
    level_min_percent: {msg : 'deve ter pelo menos um nível com 0%', field : '#level-percent-1'},
    level_number_min: {msg : 'deve ter pelo menos 2 níveis', field : '#min-levels'},
}


const validate = {
    beginning: function(){
        quizz = {...emptyQuizz};
        let errors = [];
        const fields = document.querySelectorAll('.quizz.create.basic .container input');
    
        if(fields[0].value.length >= 20 && fields[0].value.length <= 65 )
            quizz.title = fields[0].value;
        else
            errors.push( msgsErrors.title);
        if(isValidURL(fields[1].value))
            quizz.image = fields[1].value;
        else
            errors.push(msgsErrors.url);
        if(parseInt(fields[2].value) >= 3)
            qtd_questions = parseInt(fields[2].value);
        else
            errors.push(msgsErrors.qtd_questions);
        if(parseInt(fields[3].value) >= 2)
            qtd_levels = fields[3].value;
        else
            errors.push(msgsErrors.qtd_levels);
    
        if(errors.length === 0)
            screenTransition.beginningToQuestions();
        else
            showError(errors)
    },
    questions: function(){
        let errors = [];
        let error;

        let tempQuizz = {...emptyQuizz};
        let question = {...emptyQuizzQuestion};
        let answer = {...emptyAnswer};
        let answers = [];

        const questions_html = document.querySelectorAll('.quizz.create.questions .container .container-in');
        let question_count = 1;

        questions_html.forEach(q_html => {
            answers = [];
            question = {...emptyQuizzQuestion};

            const fields = q_html.querySelectorAll('input');
            if(fields[0].value.length >= 20)
                question.title = fields[0].value;
            else{
                error = {...msgsErrors.question_title};
                error.field += `${question_count}`;
                errors.push(error);
            }
            if(isValidColor(fields[1].value))
                question.color = fields[1].value;
            else{
                error = {...msgsErrors.question_color};
                error.field += `${question_count}`;
                errors.push(error);
            }
            if(fields[2].value.length > 0){
                answer = {...emptyAnswer};
                answer.isCorrectAnswer = true;
                answer.text = fields[2].value;
            } else {
                error = {...msgsErrors.question_answer};
                error.field += `${question_count}`;
                errors.push(error);
            }
            if(isValidURL(fields[3].value)){
                answer.image = fields[3].value;
            } else {
                error = {...msgsErrors.question_anwser_img};
                error.field += `${question_count}`;
                errors.push(error);
            }
            if(fields[2].value.length > 0 && isValidURL(fields[3].value))
                answers.push(answer);
            
            answer = {...emptyAnswer};
            if(fields[4].value.length > 0){
                answer.isCorrectAnswer = false;
                answer.text = fields[4].value;
            } else {
                error = {...msgsErrors.question_answer_incorrect};
                error.field += `${question_count}-1`;
                errors.push(error);
            }
            if(isValidURL(fields[5].value)){
                answer.image = fields[5].value;
            } else {
                error = {...msgsErrors.question_answer_incorrect_url};
                error.field += `${question_count}-1`;
                errors.push(error);
            }
            if(fields[4].value.length > 0 && isValidURL(fields[5].value))
                answers.push(answer);
            
            answer = {...emptyAnswer};
            if(fields[6].value.length > 0 && isValidURL(fields[7].value)){
                answer.isCorrectAnswer = false;
                answer.text = fields[7].value;
                answer.image = fields[8].value;
                answers.push(answer);
            }
            answer = {...emptyAnswer};
            if(fields[8].value.length > 0 && isValidURL(fields[9].value)){
                answer.isCorrectAnswer = false;
                answer.text = fields[9].value;
                answer.image = fields[10].value;
                answers.push(answer);
            }
            question_count++;
            question.answers = answers;
            tempQuizz.questions.push(question);
        });



        if(errors.length === 0){
            quizz.questions = tempQuizz.questions;
            screenTransition.questionsToLevels();
            console.log('sucesso');
        }
        else
            showError(errors);
    },
    levels: function(){
        let errors = [];
        let error;

        let tempQuizz = {...emptyQuizz};
        let level = {...emptyQuizzLevel};
        let levels = [];
        let errors_on_level = [0,0,0];
        let minPercentOk = undefined;

        const levels_html = document.querySelectorAll('.quizz.create.levels .container .container-in');
        let levels_count = 1;

        levels_html.forEach(l_html => {
            level = {...emptyQuizzLevel};
            const fields = l_html.querySelectorAll('input');

            if(fields[0].value.length >= 10)
                level.title = fields[0].value;
            else{
                error = {...msgsErrors.level_title};
                error.field += `${levels_count}`;
                errors.push(error);
                errors_on_level[(levels_count-1)]++;
                
            }
            if(parseInt(fields[1].value) >= 0 && parseInt(fields[1].value) <= 100)
                level.minValue = parseInt(fields[1].value);
            else{
                error = {...msgsErrors.level_min_value};
                error.field += `${levels_count}`;
                errors.push(error);
                errors_on_level[(levels_count-1)]++;
            }
            if(isValidURL(fields[2].value))
                level.image = fields[2].value;
            else{
                error = {...msgsErrors.level_img};
                error.field += `${levels_count}`;
                errors.push(error);
                errors_on_level[(levels_count-1)]++;
            }
            if(fields[3].value.length >= 30)
                level.text = fields[3].value;
            else{
                error = {...msgsErrors.level_text};
                error.field += `${levels_count}`;
                errors.push(error);
                errors_on_level[(levels_count-1)]++;
            }



            if (errors_on_level[(levels_count-1)] === 0)
                levels.push(level);

            levels_count++;
        });


        minPercentOk = levels.find(l => {
            return (l.minValue === 0)
        });

        if (minPercentOk === undefined){
            error = {...msgsErrors.level_min_percent};
            errors.push(error);
        }

        if (levels.length < 2){
            error = {...msgsErrors.level_number_min};
            errors.push(error);
        }

        if(levels.length >= 2 && minPercentOk !== undefined){
            quizz.levels = levels;
            screenTransition.levelsToSucess();
            console.log('sucesso');
        }
        else
            showError(errors);

    }
}

function showError(errors){

    errors.forEach(e => {
        if(true){}
        let field = document.querySelector(e.field); 
        let span;
        field.classList.add('alert');
        if(field.tagName === 'SPAN'){
            span = field;
        } else {
            span = field.nextElementSibling;
        }
        span.innerText = e.msg;
    });
    
}
function isValidURL(string){
    let url;
    try {
        url = new URL(string);
      } catch (_) {
        return false;  
      }
    return true;
}
function isValidColor(string){
    const rule = /^#([0-9]|[A-F]|[a-f]){6}$/;
    return (rule.test(string) && string.length > 0);
}





const screenTransition = {
    quizzlistToBeginning: function (){
        document.querySelector('.quizz-list').classList.toggle('hidden-section');
        document.querySelector('.quizz.create.basic').classList.toggle('hidden-section');
    },
    beginningToQuestions: function(){
        document.querySelector('.quizz.create.basic').classList.toggle('hidden-section');
        document.querySelector('.quizz.create.questions').classList.toggle('hidden-section');
        clearScreen.beginning();
        prepareScreen.questions();
    },
    questionsToLevels: function() {
        document.querySelector('.quizz.create.questions').classList.toggle('hidden-section');
        document.querySelector('.quizz.create.levels').classList.toggle('hidden-section');
        clearScreen.questions();
        prepareScreen.levels();
    },
    levelsToSucess: function(){
        document.querySelector('.quizz.create.levels').classList.toggle('hidden-section');
        document.querySelector('.quizz.create.sucess').classList.toggle('hidden-section');
        clearScreen.levels();
        conexion.sendMadeQuizz();
    },
    sucessToNewQuizz: function(quizz){
        document.querySelector('.quizz.create.sucess').classList.toggle('hidden-section');
        document.querySelector('.quizz-page').classList.toggle('hidden-section');
        clearScreen.sucess();
        prepareScreen.quizz_page(quizz);
    },
    sucessToHome: function (response){
        document.querySelector('.quizz.create.sucess').classList.toggle('hidden-section');
        document.querySelector('.quizz-list').classList.toggle('hidden-section');
        clearScreen.sucess();
        prepareScreen.home(response);
    }
}

const prepareScreen = {
    home: function(response){
        printHomeScreen(response);
    },
    quizz_page: function(quizz){
        printQuizz(quizz, false);
    },
    questions: function(){
        let HTMLtoAdd = ``;
        let parent = document.querySelector('.quizz.create.questions');
        for(let i = 2; i <= qtd_questions; i++){
            HTMLtoAdd += ` 
            <div class="container empty">
                <h3> Pergunta ${i} </h3>
                <img onclick="prepareScreen.showNewQuestion(this)" src="imgs/new.png" alt="">
                <div class="container-in">
                    <input id ='question-${i}' type="text" placeholder="Texto da Pergunta">
                    <span></span>
                    <input id ='color-${i}' type="text" placeholder="Cor de fundo da pergunta">
                    <span></span>
                    <h3> Resposta correta </h3>
                    <input id ='answer-${i}' type="text" placeholder="Resposta correta">
                    <span></span>
                    <input id='img-${i}' type="text" placeholder="URL da imagem">
                    <span></span>
                    <h3> Respostas incorretas </h3>
                    <input id='incorrect-${i}-1' type="text" placeholder="Resposta incorreta 1">
                    <span></span>
                    <input id='incorrectUrl-${i}-1' type="text" placeholder="URL da imagem 1">
                    <span></span>
                    <span class="break"></span>
                    <input id='incorrect-${i}-2' type="text" placeholder="Resposta incorreta 2">
                    <span></span>
                    <input id='incorrectUrl-${i}-2' type="text" placeholder="URL da imagem 2">
                    <span></span>
                    <span class="break"></span>
                    <input id='incorrect-${i}-3' type="text" placeholder="Resposta incorreta 3">
                    <span></span>
                    <input id='incorrectUrl-${i}-3' type="text" placeholder="URL da imagem 3">
                    <span></span>
                </div>
            </div>
            `            
        }
        parent.innerHTML += HTMLtoAdd;
        parent.innerHTML += `<button onclick="validate.questions()">Prosseguir pra criar níveis</button>`;
        soPraTestarApagar();
    },
    levels: function(){
        soPraTestarApagar();
    },
    sucess: function(id, title, imgURL){
        let parent = document.querySelector('.quizz.create.sucess');
        let container_html = parent.querySelector('.img-container');
        let img_html = parent.querySelector('img'); 
        let title_html = parent.querySelector('.quizz-title'); 
        let button_html = parent.querySelector('button'); 

        container_html.setAttribute("onclick",`conexion.getQuizz(${id})`);
        button_html.setAttribute("onclick",`conexion.getQuizz(${id})`);
        img_html.src = imgURL;
        title_html.innerText = title;
    },
    showNewQuestion: function(t){
        t.parentElement.classList.toggle('empty');
    },
    showNewLevel: function(t){
        t.parentElement.classList.toggle('empty');
    }
}

const clearScreen = {
    beginning: function (){ utils.clearScreen('.quizz.create.basic')},
    questions: function (){ utils.clearScreen('.quizz.create.questions')},
    levels: function (){ utils.clearScreen('.quizz.create.levels')},
    sucess: function() {utils.clearScreen('.quizz.create.sucess')}
}


const conexion = {
    getQuizzes: function (){
        axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes`)
        .then( response => {
            screenTransition.sucessToHome(response);
        });
    },
    sendMadeQuizz: function (){
        axios.post('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes', quizz)
        .then( response => {
            let d = response.data;
            quizz = {...emptyQuizz};
            console.log(response);
            prepareScreen.sucess(d.id, d.title, d.image);
            //modificação para obter ID e Key
            dataUserQuizz.id.push(response.data.id); 
            dataUserQuizz.key.push(response.data.key);
            uploadUserQuizzId();
  
        })
        .catch( error => {
            console.log(error);
        });
    },
    getQuizz: function(quizzID) {
        axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${quizzID}`)
        .then( response => {
            screenTransition.sucessToNewQuizz(response);
        });
    }




}

function login(){
    user = document.querySelector(".user-name").value;
    
}

function soPraTestarApagar(){
    if(true)return;
    let tela;
    let inputs= [];
    let input;
    if(!document.querySelector('.quizz.create.questions').classList.contains('hidden-section')){
        tela = document.querySelector('.quizz.create.questions');
        inputs = tela.querySelectorAll('[id*="question"]');
        inputs.forEach(e => {
            e.value = 'abluablualbualbualbualbualbualbualbualbualub'
        });
        inputs = tela.querySelectorAll('[id*="color"]');
        inputs.forEach(e => {
            e.value = '#111111'
        });
        inputs = tela.querySelectorAll('[id*="answer-"]');
        inputs.forEach(e => {
            e.value = 'abrobinha'
        });
        inputs = tela.querySelectorAll('[id*="img-"]');
        inputs.forEach(e => {
            e.value = 'http://i1.ytimg.com/vi/jHWKtQHXVJg/maxresdefault.jpg?feature=og'
        });
        inputs = tela.querySelectorAll('[id*="incorrect-"][id$="1"]');
        inputs.forEach(e => {
            e.value = 'batatinha'
        });
        inputs = tela.querySelectorAll('[id*="incorrectUrl-"][id$="1"]');
        inputs.forEach(e => {
            e.value = 'http://i1.ytimg.com/vi/jHWKtQHXVJg/maxresdefault.jpg?feature=og'
        });
    }
    if(!document.querySelector('.quizz.create.levels').classList.contains('hidden-section')){
        tela = document.querySelector('.quizz.create.levels');
        input = tela.querySelector('#level-title-1');
        input.value = 'asiodaiosdhaiusdhaiusdhiausdhiausdhaiusdhiausdhaisud'
        input = tela.querySelector('#level-title-2');
        input.value = 'asiodaiosdhaiusdhaiusdhiausdhiausdhaiusdhiausdhaisud'
        input = tela.querySelector('#level-percent-1');
        input.value = '0';
        input = tela.querySelector('#level-percent-2');
        input.value = '50';
        input = tela.querySelector('#level-img-1');
        input.value = 'http://i1.ytimg.com/vi/jHWKtQHXVJg/maxresdefault.jpg?feature=og';
        input = tela.querySelector('#level-img-2');
        input.value = 'http://i1.ytimg.com/vi/jHWKtQHXVJg/maxresdefault.jpg?feature=og';
        input = tela.querySelector('#level-description-1');
        input.value = 'asiodaiosdhaiusdhaiusdhiausdhiausdhaiusdhiausdhaisud';
        input = tela.querySelector('#level-description-2');
        input.value = 'asiodaiosdhaiusdhaiusdhiausdhiausdhaiusdhiausdhaisud';
        // <input id='level-description-1' type="text" placeholder="Descrição do nível">
    }
}










//tela 1
const url_quizzes = `https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes`;
const homeScreen = document.querySelector(".quizz-list");
let activeUserQuizzes =[];

function getServerQuizzes() {
    const promise = axios.get(url_quizzes);
    promise.then(printHomeScreen);    
}

function printHomeScreen(answer) { 
   
    printHomeScreenThumbs(answer.data,"all-quizzes");
    checkUserQuizzes(answer.data);
}

function printHomeScreenThumbs(quizzes,locationClass,userKeys) {
    let text = "";
    let buttonsString = "";    
    for(i = 0; i < quizzes.length; i++) {
        if (locationClass === "yourquizzes-list"){
            buttonsString = `
            <button class="your-quizzes-options edit-option" onclick="editUserQuizz(${quizzes[i].id},'${userKeys[i]}')">
                
            </button>
            <button class="your-quizzes-options delete-option" onclick="deleteUserQuizz(${quizzes[i].id},'${userKeys[i]}')">
               
            </button>
            `;
        }      
        text += thumbStructure(quizzes[i],buttonsString);
    }
    homeScreen.querySelector(`.${locationClass} ul`).innerHTML = text;
}

function checkUserQuizzes(serverQuizzes) {
    console.log(serverQuizzes);
    const userIds = getUserQuizzes().ids;
    console.log(userIds);
    const userKeys = getUserQuizzes().keys;

    
    for(let i=0; i<userIds.length;i++){
        for(let j=0; j<serverQuizzes.length;j++){
            if(serverQuizzes[j].id == serverQuizzes[i]){
                activeUserQuizzes.push(serverQuizzes[j].id);
            }
        }
    }
    
    //activeUserQuizzes = serverQuizzes.filter(({id}) => userIds.includes(id));

    console.log(activeUserQuizzes);
    if (activeUserQuizzes.length == 0) {
        homeScreen.querySelector(".emptyquizz-list").classList.remove("hidden");
        homeScreen.querySelector(".yourquizzes-list").classList.add("hidden");
    } else {
        homeScreen.querySelector(".emptyquizz-list").classList.add("hidden");
        homeScreen.querySelector(".yourquizzes-list").classList.remove("hidden");
        printHomeScreenThumbs(activeUserQuizzes,"yourquizzes-list",userKeys);
    }
}



function thumbStructure(element,buttonsString) {
        return `<li class="quizz-thumb" onclick="playQuizz(${element.id})" data-identifier="quizz-card">
        <div class="thumb grad"></div>
        <img src="${element.image}" alt="thumbnail">
        <h2 class="quizz-thumb-title">${element.title}</h2>
        ${buttonsString}
        </li>`;
}

//tela 2

const playQuizzScreen = document.querySelector(".quizz-page");
const newQuizzScreen = document.querySelector(".quizz.create");
const currentQuizzInfo = {
    questionsAnswered: 0,
    levels: [],
    rightAnswers: 0
};

function playQuizz(quizzID) {
    const promise = axios.get(`${url_quizzes}/${quizzID}`);
    promise.then(printQuizz);
  
}

function printQuizz(quizz, switchPageFlag = true){
    const title = playQuizzScreen.querySelector(".quizz-title");
    title.innerText = quizz.data.title;
    const banner = playQuizzScreen.querySelector(".banner-image");
    banner.src = quizz.data.image;
    const questions = playQuizzScreen.querySelector(".quizz-questions");

    questions.innerHTML = "";
    currentQuizzInfo.levels = quizz.data.levels;
    for (let i = 0; i < quizz.data.questions.length; i++) {
        let randomAnswers = quizz.data.questions[i].answers.sort(randomize);
        let answers = "";
        for (let j = 0; j < randomAnswers.length; j++) {
            answers += 
            `<li class="option" onclick="selectAnswer(this)">
                <img src="${randomAnswers[j].image}" alt="Option Imagem">
                <span>${randomAnswers[j].text}</span>
                <span class="value hidden">${randomAnswers[j].isCorrectAnswer}</span>
            </li>`;
        }
        if (quizz.data.questions[i].color.toLowerCase() === "#ffffff") {
            questions.innerHTML += 
            `<div class="question">
                <div class="question-title black" style="background-color:${quizz.data.questions[i].color}">
                <span>${quizz.data.questions[i].title}</span>
                </div>
                <ul class="answers">
                    ${answers}
                </ul>
            </div>`;
        } else {
            questions.innerHTML += 
            `<div class="question">
                <div class="question-title" style="background-color:${quizz.data.questions[i].color}">${quizz.data.questions[i].title}</div>
                <ul class="answers">
                    ${answers}
                </ul>
            </div>`;
        }
    } 
    clearQuizz();
    if(switchPageFlag)
        switchPage("quizz-page");

}

function randomize() { 
	return Math.random() - 0.5; 
}

function clearClass(className) {
    const group = document.querySelectorAll(`.${className}`);
    for (let i = 0; i < group.length; i++) {
        group[i].classList.remove(`${className}`);
    }
}

function clearQuizz() {
    currentQuizzInfo.questionsAnswered = 0;
    currentQuizzInfo.rightAnswers = 0;
    clearClass("not-selected");
    clearClass("correct");
    clearClass("wrong");
    const result = playQuizzScreen.querySelector(".result");
    result.classList.add("hidden");
    window.scrollTo(0, 0);
}

function switchPage(pageTo) {
    homeScreen.classList.add("hidden-section");
    playQuizzScreen.classList.add("hidden-section");
    if (pageTo === "quizz-list") {
        getServerQuizzes();
    }
    document.querySelector(`.${pageTo}`).classList.remove("hidden-section");
}

// comportamento de respostas

function selectAnswer(answer) {
    const question = answer.parentNode;
    const isAnswered = question.querySelector(".not-selected");
    if (isAnswered === null) {
        const answers = question.children;
        for (let i = 0; i < answers.length; i++) {
            answers[i].classList.add("not-selected");
            let value = answers[i].querySelector(".value").innerText;
            if (value === "true") {
                answers[i].classList.add("correct")
            } else {
                answers[i].classList.add("wrong") 
            }
        }
        if (answer.querySelector(".value").innerText === "true") {
            currentQuizzInfo.rightAnswers++;
        }
        answer.classList.remove("not-selected");
        setTimeout(scrollToNextQuestion, 2000, question.parentNode);
        currentQuizzInfo.questionsAnswered++;
        const questionsNumber = playQuizzScreen.querySelectorAll(".question").length;
        if (currentQuizzInfo.questionsAnswered === questionsNumber) {
            setTimeout(showResults, 2000, questionsNumber);
        }    
    }
}

function scrollToNextQuestion(question) {
    questions = playQuizzScreen.querySelectorAll(".question");
    for (let i = 0; i < questions.length; i++) {
        if ((question === questions[i]) && (i + 1 < questions.length)) {
            questions[i + 1].scrollIntoView();
        }
    }
}

// resultados 

function showResults(questionsNumber){    

    const score = Math.round((currentQuizzInfo.rightAnswers / questionsNumber) * 100);
    let level = 0;
    for (let i = 0; i < currentQuizzInfo.levels.length; i++) {
        if (score >= currentQuizzInfo.levels[i].minValue) {
            level = i;
        }
    }
    const result = playQuizzScreen.querySelector(".result");
    result.innerHTML = `
            <div class="score">${score}% de acerto: ${currentQuizzInfo.levels[level].title}</div>
            <div class="description">
                <img src="${currentQuizzInfo.levels[level].image}" alt="resultado">
                <p>${currentQuizzInfo.levels[level].text}</p>
            </div>`;
    result.classList.remove("hidden");
    result.scrollIntoView();
}
//armazenando ID e Key
function getUserQuizzes() {
    let userInfo;
    if (localStorage.getItem("idBuzzQuizzArray")){
        userInfo = JSON.parse(localStorage.getItem("idBuzzQuizzArray"))
    } else {
        userInfo = {ids:[],keys:[]}
        localStorage.setItem("idBuzzQuizzArray",JSON.stringify(userInfo));
    }
    return userInfo
}

function uploadUserQuizzId() {
    const userInfo = getUserQuizzes();
    userInfo.ids.push(dataUserQuizz.id);
    userInfo.keys.push(dataUserQuizz.key);
    console.log(userInfo);
    localStorage.setItem("idBuzzQuizzArray",JSON.stringify(userInfo));    
}

getServerQuizzes();
