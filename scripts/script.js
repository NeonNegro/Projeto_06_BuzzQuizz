let quizzBeginning = {
    title,
    url,
    qtd_questions,
    qtd_levels
}

const msgsErrors = {
    title : {msg : 'deve ter no mínimo 20 e no máximo 65 caracteres', field : '#title'},
    url :{msg : 'deve ter formato de URL', field : '#url'},
    qtd_questions : {msg : 'no mínimo 3 perguntas', field : '#qtd_questions'},
    qtd_levels : {msg : 'no mínimo 2 níveis', field : '#qtd_levels'}
}


const validate = {
    beginning: function(){
        let quizz = quizzBeginning;
        let errors = [];
        const fields = document.querySelectorAll('.quizz.create.basic .container input');
    
        if(fields[0].value.length >= 20 && fields[0].value.length <= 65 )
            quizz.title = fields[0].value;
        else
            errors.push( msgsErrors.title);
        if(isValidURL(fields[1].value))
            quizz.url = fields[1].value;
        else
            errors.push(msgsErrors.url);
        if(parseInt(fields[2].value) >= 3)
            quizz.qtd_questions = parseInt(fields[2].value);
        else
            errors.push(msgsErrors.qtd_questions);
        if(parseInt(fields[3].value) >= 2)
            quizz.qtd_levels = fields[3].value;
        else
            errors.push(msgsErrors.qtd_levels);
    
        if(errors.length === 0)
            screenTransition.beginningToQuestions()
        else
            showError(errors)
    }
}

function showError(errors){

    errors.forEach(e => {
        let input = document.querySelector(e.field); 
        input.classList.add('alert');
        let span = input.nextElementSibling;
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

<img onclick="addNewQuestion(this) "src="imgs/new-question.png" alt=""></img>




const screenTransition = {
    quizzlistToBeginning: function (){
        document.querySelector('.quizz-list').classList.toggle('hidden-section');
        document.querySelector('.quizz.create.basic').classList.toggle('hidden-section');
    },
    beginningToQuestions: function(){
        document.querySelector('.quizz.create.basic').classList.toggle('hidden-section');
        document.querySelector('.quizz.create.questions').classList.toggle('hidden-section');
    }
}