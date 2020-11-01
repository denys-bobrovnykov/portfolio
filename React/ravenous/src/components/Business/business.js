import React from 'react';
import './business.css';


class Business extends React.Component {
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(){
        const lon = this.props.business.coordinates.longitude;
        const lat = this.props.business.coordinates.latitude;
        window.open(`https://www.google.com/maps/place/${lat},${lon}`);
    }
    render() {
        return (
            <div className="Business">
            <div className="image-container">
                <img src={this.props.business.imageSrc} alt=''/>
            </div>
            <h2>{this.props.business.name}</h2>
            <div className="Business-information">
                <div className="Business-address" onClick={this.handleClick}>
                <p >{this.props.business.address}</p>
                <p>{this.props.business.city}</p>
                <p>{this.props.business.state} {this.props.business.zipCode}</p>
                </div>
                <div className="Business-reviews">
                <h3>{this.props.business.category}</h3>
            <h3 className="rating">{this.props.business.rating}</h3>
                <p>{this.props.business.reviewCount} reviews</p>
                </div>
            </div>
            </div>
        )
    }
}
export default Business;