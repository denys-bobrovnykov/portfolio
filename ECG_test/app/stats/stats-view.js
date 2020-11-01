export default class StatsView{
    constructor(){
        //View container
        this.container = document.querySelector('.stats-container');
        //Buttons
        this.gotoMain = document.querySelector('.nav-home');
        //Listeners
    }

    renderList(data){

        this.container.innerHTML = ''; //clear container

        for (let i = 0, last = data.length; i < last; i++) {

            const item = data[i];
            const chaptersRanges = JSON.parse(localStorage.getItem('chaptersRanges'));
            const result = (item.correctAnswList.length/item.answeredList.length * 100).toFixed(0);
            let count = 0;
            for(let key of item.chapters){// calculate total questions in selected chapters
                count += chaptersRanges[key][1] - chaptersRanges[key][0] + 1;
            }
            this.container.innerHTML += `<table class="result">
                                            <tr>
                                                <th>Початок</th>
                                                <td>${item.start}</td>
                                            </tr>
                                            <tr>
                                                <th>Кінець</th>
                                                <td>${item.finish}</td>
                                            </tr>
                                            <tr>
                                                <th>Розділи</th>
                                                <td>${item.chapters.join(',')}</td>
                                            </tr>
                                            <tr>
                                                <th>Усього питань у розділах</th>
                                                <td>${count}</td>
                                            </tr>
                                            <tr>
                                                <th>Відповідей</th>
                                                <td>${item.answeredList.length}</td>
                                            </tr>
                                            <tr>
                                                <th>Результат</th>
                                                <td>${isNaN(result) ? 0 : result}%</td>
                                            </tr>
                                        </table>
                                        <hr>`;

        }// endFor //

    }// endMethod //
}