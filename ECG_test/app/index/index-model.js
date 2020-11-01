export default class IndexModel{
    constructor(){
        this.selectedChapters;
    }

    selectOptions(options) { // DATA
        this.selectedChapters = Array.from(options)
                        .reduce((acc, opt) => opt.checked ? acc.concat(opt.value) : acc,[]);
                        // .reduce((acc, opt) => opt.selected ? acc.concat(opt.value) : acc,[]);
    }
    
}