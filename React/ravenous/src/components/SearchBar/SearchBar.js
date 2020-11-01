import React from 'react';
import './SearchBar.css';


class SearchBar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            term: '',
            location: '',
            sortBy: 'best_match'
        };
        this.handleTermChange = this.handleTermChange.bind(this);
        this.handleLocationChange = this.handleLocationChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.sortByOptions = {
            'Best Match': 'best_match',
            'Highest Rated': 'rating',
            'Most Reviewed': 'review_count'
          };;
    }
    handleSortByChange(sortByOption) {
        this.setState({sortBy: sortByOption});
    }
    handleTermChange(ev){
        this.setState({term: ev.target.value});
    }
    handleLocationChange(ev){
        this.setState({location: ev.target.value});
    }
    handleSearch(ev) {
        this.props.searchYelp(this.state.term, this.state.location, this.state.sortBy);
        ev.preventDefault();
    }
    getSortByClass(sortByOption){
        if ( this.state.sortBy === sortByOption ) {
            return 'active';
        } else {
            return '';
        }

    }
    renderSortByOptions() {
        return Object.keys(this.sortByOptions).map(sortByOption => {
        let sortByOptionValue = this.sortByOptions[sortByOption];
        return <li onClick={this.handleSortByChange.bind(this, sortByOptionValue)} className={ this.getSortByClass(sortByOptionValue) } key={sortByOptionValue}>{sortByOption}</li>;
        });
    }

    render() {
        return (
            <div className="SearchBar">
            <div className="SearchBar-sort-options">
                <ul>
                    {this.renderSortByOptions()}
                </ul>
            </div>
            <form>
            <div className="SearchBar-fields">
                <input onChange={this.handleTermChange} placeholder="Search Businesses" />
                <input onChange={this.handleLocationChange} placeholder="Where?" autoComplete="on"/>
            </div>
            <div onClick={this.handleSearch} className="SearchBar-submit">
                <a>Let's Go</a>
            </div>
            </form>
            </div>
        )
    }
}
export default SearchBar;