export default class TestModel{

  constructor(questions, answers, chaptersRanges, chapters){
    // Set initial state variables
    this.answeredList = []; // viewed already questions 
    this.checkedAnsw; //ticked answers array
    this.correctAnsw; //number of question in database for answer check
    this.correctAnswList = []; // correct answers array
    this.correct; //bool overall answer correctness for controller autoshow next Q
    this.forCheck; //question number to check with ANSWERS db
    this.forDisplay = 0; //question index in SELECTed questions array to display
    this.questionLeft = 0; // total questions in the SELECT
    this.selectedQuestions = []; // SELECTed questions from chosen chapters array
    this.wrongAnswersList = []; // wrong answers array
    this.pictureQuestions = [1871,2131];
    // Select questions for display
    this.selectChapters(questions, chapters, chaptersRanges); // select questions in this SELECT
  }

  check(nodeList, answers) {// comes from control

    const n = this.selectedQuestions[this.forDisplay].num;
    this.checkedAnsw = [];
    this.correctAnsw = [];
    this.correct = false; // General answer result is initialy false
    // Get string of checked items for check with DB answer string
    const checked = Array.from(nodeList).reduce((acc, el) => el.checked ? acc.concat(el.value) : acc, []).join(','); 
    this.checkedAnsw = checked.split(',');// update checked answers for history display
    this.correctAnsw.push(...answers[n].split(','));// correct answers for history and stats

    const answer = {'questionNum': n, 'yourAnsw': checked, 'correctAnsw': this.correctAnsw};//Create answer for history
    
    if ( !this.answeredList.includes(this.forDisplay) ){// Push answer to wrong or correct list if it is not checked yet
      if ( checked == answers[n] ) {
        this.correct = true;
        this.correctAnswList.push(answer);
      } else {
        this.correct = false;
        this.wrongAnswersList.push(answer);
      }
    }

  }

  randomise() {

    for ( let i = 0; i < this.selectedQuestions.length; i++ ) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.selectedQuestions[i], this.selectedQuestions[j]] = [this.selectedQuestions[j],this.selectedQuestions[i]];
    }

  }

  saveStats(sessionsResults = [], sessionstart){

    const maxNumStored = 5;// max stored results
    const dateNow = new Date();

    const sessionStats = {
      chapters: this.chapters,
      answeredList: this.answeredList,
      wrongAnswersList: this.wrongAnswersList,
      correctAnswList: this.correctAnswList,
      start: sessionstart,
      finish: dateNow.toLocaleString(),
    }

    sessionsResults.unshift(sessionStats);//put question in the beginning
    if (sessionsResults.length > maxNumStored) sessionsResults.pop();// pop last stored

    return sessionsResults;

  }

  selectChapters(questions, chapters, chaptersRanges) {

    for ( let j of chapters) { // iterate through chapters selected
      for ( let k = chaptersRanges[j][0]; k <= chaptersRanges[j][1]; k++ ) { // iterate from start qNum to last qNum in range
        const obj = {num: k, text: questions[k].text, a: questions[k].a};
        this.selectedQuestions.push(obj);
      }
    }
    this.questionLeft = this.selectedQuestions.length;
    this.chapters = chapters;//store selected chapters in model for restore

  }

  selectNext() {

    if ( this.questionLeft - 1 > 0 ) {

      this.questionLeft -= 1;
      this.forDisplay += 1;

    }

  }

  selectPrev() {
    if( this.questionLeft % this.selectedQuestions.length ) {

      this.questionLeft += 1;
      this.forDisplay -= 1;

    }
  }

  selectDataForLayers() {

      //Find correct or wrong answers
      const wasWrong = this.wrongAnswersList.find(el => el.questionNum == this.selectedQuestions[this.forDisplay].num);
      const wasCorrect = this.correctAnswList.find(el => el.questionNum == this.selectedQuestions[this.forDisplay].num);
      const forRender = wasWrong || wasCorrect;// Assign found data for view
      
      return forRender;

  }

  updateAnsweredList() {

    if ( !this.answeredList.includes(this.forDisplay) ) {
      this.answeredList.push(this.forDisplay); 
    }

  }

}