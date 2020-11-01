import TestModel from "./test-model.js";
import TestView from "./test-view.js";

export default class TestControl {

    constructor(){

        this.view = new TestView(this.submitAnswer.bind(this), 
                                this.checkBox.bind(this), 
                                this.onNextClick.bind(this),
                                this.onPrevClick.bind(this),
                                this.gotoMain.bind(this),
                                this.saveSession.bind(this));
        //Load from local storage
        this.answers = JSON.parse(localStorage.getItem('answers'));
        this.chapters = JSON.parse(localStorage.getItem('chapters'));
        this.chaptersRanges = JSON.parse(localStorage.getItem('chaptersRanges'));
        this.questions = JSON.parse(localStorage.getItem('questions'));
        //Load clean TestModel                   
        this.model = new TestModel(this.questions, this.answers, this.chaptersRanges, this.chapters);
        // Stored TestModel init
        if ( localStorage.getItem('location') == 'test' ) {

            const sessionData = JSON.parse(localStorage.getItem('session_data'));

            for (let key in this.model) {
                this.model[key] = sessionData[key];
            }
        
        }
        // New TestModel init
        if ( localStorage.getItem('location') == 'main' ) {

            this.modes = JSON.parse(localStorage.getItem('modes'));

            if ( this.modes.randomize == 1) this.model.randomise();
            localStorage.setItem('location', 'test');
        } 
        // First render
        this.view.renderProgress(this.model.answeredList.length, this.model.selectedQuestions.length, this.model.wrongAnswersList.length);
        this.view.renderQuestion(this.model.forDisplay, this.model.selectedQuestions, this.model.pictureQuestions);
        this.applyHistory();
        this.saveSession();

    }

    applyHistory(){// Apply answers view history for rendering

        if ( this.model.answeredList.includes(this.model.forDisplay) ) {

            const forRender = this.model.selectDataForLayers();
            const options = this.view.selectAnswers();
            this.view.renderResult(options, forRender.yourAnsw.split(','), forRender.correctAnsw);

        }

    }

    checkBox(e) {

        if ( e.target.className == 'answer-container_clickable' ) {
            e.target.firstElementChild.checked = e.target.firstElementChild.checked ? false : true;
        }
    }

    gotoMain() {
        localStorage.removeItem('session_data');
        localStorage.setItem('location', 'main');
        this.saveStats();
    }


    onNextClick() {
        this.model.selectNext();
        this.view.renderQuestion(this.model.forDisplay, this.model.selectedQuestions, this.model.pictureQuestions);
        this.applyHistory();
        this.saveSession();
    }

    onPrevClick() {
        this.model.selectPrev();
        this.view.renderQuestion(this.model.forDisplay, this.model.selectedQuestions, this.model.pictureQuestions);
        this.applyHistory();
        this.saveSession();
    }


    saveStats() {
        const sessionsResults = JSON.parse(localStorage.getItem('session_results')) || [];
        const timeStart = localStorage.getItem('time_start');
        const sessionResultReturn = this.model.saveStats(sessionsResults, timeStart);
        localStorage.setItem('session_results', JSON.stringify(sessionResultReturn));
        localStorage.removeItem('time_start');
    }

    saveSession() {
        localStorage.setItem('session_data', JSON.stringify(this.model));
    }

    submitAnswer(e) {

        e.preventDefault();

        if ( !this.model.answeredList.includes(this.model.forDisplay)) { // check if already answered
            const options = this.view.selectAnswers();
            this.model.check(options, this.answers);
            this.model.updateAnsweredList();

            // ------ Optional auto move to next if correct ----------- //
            // if (this.model.correct) { // jumps to next if correct
            //     this.onNextClick();
            // }
            // -------------------------------------------------------- //

            this.view.renderResult(options, this.model.checkedAnsw, this.model.correctAnsw);
            this.view.renderProgress(this.model.answeredList.length, this.model.selectedQuestions.length, this.model.wrongAnswersList.length);
            this.saveSession();
        }

    }
    
}