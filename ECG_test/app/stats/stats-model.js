export default class StatsModel{
    constructor(){
        this.data = JSON.parse(localStorage.getItem('session_results'));
    }
    
}