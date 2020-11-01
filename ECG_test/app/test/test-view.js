export default class TestView{

    constructor(submitAnsw, checkBox, nextQ, prevQ, gotoMain, saveSession){

      //Elements select
      this.answerInput = document.querySelector('.answer-input');
      this.controlsContainer= document.querySelector('.test-controls');
      this.progressView = document.querySelector('.prog-data');
      this.questionText = document.querySelector('.question-text');
      this.submitForm = document.querySelector('#answer-form');
      this.testContainer = document.querySelector('.test-container');
      //Elements create
      this.submitButton = document.createElement('button');
      this.submitButton.type = 'submit';
      this.submitButton.innerHTML = 'Перевірити';
      this.submitButton.classList.add('check-button');
      this.image = document.createElement('img');
      this.image.classList.add('question-picture');
      //Buttons select
      this.homeButton = document.querySelector('.nav-home');
      this.nextButton = document.querySelector('.next-button');
      this.prevButton = document.querySelector('.prev-button');
      // Listeners
      this.homeButton.addEventListener('click', gotoMain);
      this.nextButton.addEventListener('click', nextQ);
      this.prevButton.addEventListener('click', prevQ);
      this.submitForm.addEventListener('submit', submitAnsw);
      this.submitForm.addEventListener('click', checkBox);
      
      // window.addEventListener('scroll', this.stickControls.bind(this)); // Stick controls(switched off)
    }

    clear() {
      this.questionText.innerHTML = '';
      this.submitForm.innerHTML = '';
    }

    renderProgress(answeredList, questionLeft, wrongAnswers){

      this.progressView.innerHTML = `Всього питань: ${questionLeft}, Переглянуто питань: ${answeredList}, Помилок: ${wrongAnswers}`;
      
    }

    renderQuestion(n = forDisplay, selectedQuestions, pictureQuestions) {

      this.clear();
      if((+selectedQuestions[n].num >= +pictureQuestions[0]) && (+selectedQuestions[n].num <= +pictureQuestions[1])) {
        this.image.src = `./resources/img/${selectedQuestions[n].num}.png`;
        this.image.onload = () => {
          this.questionText.append(this.image);
        }
      }
      this.questionText.innerHTML = '<p>' + selectedQuestions[n].text + '</p>';

      for ( let key in selectedQuestions[n].a ) {
        this.submitForm.innerHTML += ` <div class="answer-container">
                                          <span class="answer-container_clickable">
                                          <input type="checkbox" value="${key}" id="${key}" name="answer" class="options" />
                                          ${selectedQuestions[n].a[key]}
                                          </span>
                                      </div>`;
      }

      this.submitForm.append(this.submitButton);// Insert Submit button
        
    }

    renderResult(options, checked, correct){

      options.forEach(el => {// add check property 
        if ( checked.includes(el.id) ) el.checked = true;
      })

      options.forEach(el => {// render color-coding, uncheck wrong, check hints

        if ( checked.includes(el.id) && !correct.includes(el.id) ) {
          el.parentElement.classList.add('wrong-color');
          el.checked = false;
        }
        if ( !checked.includes(el.id) && correct.includes(el.id) && correct.length > 1 ) {
          el.parentElement.classList.add('wrong-color');
          el.checked = true;
        }
        if ( correct.includes(el.id) && !checked.includes(el.id) ) {
          el.parentElement.classList.add('hint-color');
          el.checked = true;
        }
        if ( correct.includes(el.id) && checked.includes(el.id) ) {
          el.parentElement.classList.add('correct-color');
        }

      })
      
    }

    selectAnswers(){
      return document.querySelectorAll('.options');
    }

    stickControls(){// switched off 
      if(this.nextButton.getBoundingClientRect().top < 0) {
        this.controlsContainer.classList.add('stick');
      } 
      if( this.testContainer.getBoundingClientRect().top >= this.controlsContainer.offsetHeight ) {
        this.controlsContainer.classList.remove('stick');      
      }
    }
}