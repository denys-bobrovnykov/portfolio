import React from 'react';
import './App.css';
import '../Business/business';
import '../BusinessList/BusinessList';
import '../SearchBar/SearchBar';
import SearchBar from '../SearchBar/SearchBar';
import BusinessList from '../BusinessList/BusinessList';
import Yelp from '../../util/Yelp';
import NotFound from '../../components/NotFound/NotFound';



class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      businesses: [],
      location: true
    };
    this.searchYelp = this.searchYelp.bind(this);
  }
  searchYelp(term, location, sortBy){
    Yelp.search(term, location, sortBy).then((businesses) => {
      if (businesses) {
        this.setState({
          businesses: businesses,
          location: true
          });
      } else {
        this.setState({
          location: false
        });
      }
    });
  }
  render () {
    const result = this.state.location ? <BusinessList businesses={this.state.businesses}/> : <NotFound text='Location not found.'/>;
    return(
    <div className="App">
    <h1>ravenous</h1>
    <SearchBar searchYelp={this.searchYelp}/>
    { result }
  </div>
    )
  }
}

export default App;
