import IndexModel from "./index-model.js";
import IndexView from "./index-view.js"

export default class IndexControl{
    
    constructor(){
        //Reload local storage
        localStorage.removeItem('questions');
        localStorage.removeItem('answers');
        this.loadFromDB();
        this.model = new IndexModel();
        this.view = new IndexView(this.selectChapter.bind(this), this.goClick.bind(this), this.checkBox.bind(this));
    }

    checkBox(e) {
        if ( e.target.tagName == 'LI' ) {
            e.target.firstElementChild.checked = e.target.firstElementChild.checked ? false : true;
            this.model.selectOptions(this.view.selectElement);
        }
        
    }

    goClick(e) {
        e.preventDefault();
        if(this.model.selectedChapters[0]) {
            this.storeData();
            window.location.href = './test.html';
        } else {
            alert('Виберіть розділ');
        }
    }

    initIndex() {
        console.log('init');
        if ( localStorage.getItem('location') == 'test') {
            window.location.href = "./test.html";
        } else { 
            localStorage.setItem('location', 'main');
        }
    }

    selectChapter() {
        console.log('select');
        this.model.selectOptions(this.view.selectElement);
    }

    storeData() { 
        localStorage.setItem('modes',JSON.stringify({'randomize': this.view.modeSelect.random.value}));
        localStorage.setItem('chapters',JSON.stringify(this.model.selectedChapters || ['1']));
        const timeStart  = new Date();
        localStorage.setItem('time_start', timeStart.toLocaleString());
    }
    
    loadFromDB() {
        console.group('Loading questions db');
        fetch('./app/index/questions/QuestionsObj.json')
        .then(res => res.json())
        .then(data => {
            this.storeDBdata(data,'questions');
            console.log('db loaded')
            this.loadAnswers();// then load answers
        }, rej => document.body.innerHTML = "ERROR LOADING QUESTIONS DB")
        .catch(err => console.error(err));
    }

    loadAnswers(){
        console.group('Loading answers db');
        fetch('./app/index/answers/answersObj.json')
        .then(res => res.json())
        .then(data => {
                this.storeDBdata(data, 'answers');
                console.log('db loaded')
                this.loadChapters(); // then load chapters
                this.initIndex(); // and fire init function
        }, rej => document.body.innerHTML = "ERROR LOADING ANSWERS DB")
        .catch(err => console.error(err));
    } 
    
    loadChapters(){
        const chaptersRanges = {
                1: [1,213],
                2: [214,293],
                3: [294,346],
                4: [347,412],
                5: [413, 481],
                6: [482, 603],
                7: [604, 702],
                8: [703, 886],
                9: [887, 1002],
                10: [1003, 1092],
                11: [1093, 1239],
                12: [1240, 1469],
                13: [1470, 1508],
                14: [1509, 1661],
                15: [1662, 1706],
                16: [1707, 2131]
        }   
        localStorage.setItem('chaptersRanges', JSON.stringify(chaptersRanges));
    }
    
    storeDBdata(data, name) {
        localStorage.setItem(name, JSON.stringify(data));
    }

    
}

