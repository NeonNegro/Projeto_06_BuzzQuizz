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
            screenTransition.questionsToSucess();
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
        prepareScreen.questions();
    },
    questionsToLevels: function() {
        document.querySelector('.quizz.create.questions').classList.toggle('hidden-section');
        document.querySelector('.quizz.create.levels').classList.toggle('hidden-section');
        prepareScreen.levels();
    },
    questionsToSucess: function(){
        document.querySelector('.quizz.create.levels').classList.toggle('hidden-section');
        document.querySelector('.quizz.create.sucess').classList.toggle('hidden-section');
        conexion.sendMadeQuizz();
    }
}

const prepareScreen = {
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
    sucess: function(imgURL){
        let parent = document.querySelector('.quizz.create.sucess');
        
    },
    showNewQuestion: function(t){
        t.parentElement.classList.toggle('empty');
    },
    showNewLevel: function(t){
        t.parentElement.classList.toggle('empty');
    }
}


const conexion = {
    sendMadeQuizz: function (){
        axios.post('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes', quizz)
        .then( response => {
  
            quizz = {...emptyQuizz};
            console.log(response);
            prepareScreen.sucess(response.data.image);

  
        })
        .catch( error => {
            console.log(error);
        });
    }
}

function login(){
    user = document.querySelector(".user-name").value;
    
}

function soPraTestarApagar(){
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