import React from 'react';

import './NotFound.css';

class NotFound extends React.Component {


    render () {
        return (
        <div className="NotFound">
            <h2>{ this.props.text }</h2>
        </div>
        )
    }
}

export default NotFound;