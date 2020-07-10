import React from 'react';

class Welcome extends React.Component {
    render(){

        // const { userName } = this.props;

        return (
            <div className="text-center mt-4">
            <span  className="text-secondary font-weight-bold pl-1">
                {/* Welcome {userName}  */}
            </span>
            </div>
        );
    }
}
export default Welcome;