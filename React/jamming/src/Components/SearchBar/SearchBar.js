import React from 'react';
import './SearchBar.css';


export class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            term: ''
        }
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }

    search() {
        if (this.state.term.length > 0) {
            this.props.onSearch(this.state.term);
            this.setState({term: ''});
        }
    }

    handleTermChange(e) {
        this.setState({term: e.target.value});
    }

    render() {
        return(
            <div className="SearchBar">
                <input placeholder="Enter A Song, Album, or Artist" 
                        onChange={this.handleTermChange}
                        value={this.state.term}
                        />
                <button className="SearchButton" 
                        onClick={this.search}>SEARCH</button>
            </div>
        )
    }
}