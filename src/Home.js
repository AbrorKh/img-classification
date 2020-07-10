import React from 'react';
import {Link} from '@reach/router';

class Home extends React.Component {
    render(){

        const {user} = this.props;

        const biggerLead = {
            fontSize: 1.4 + 'em', 
            fontWeight: 200
        }

        return (
        <div className="container text-center">
            <div className="row justify-content-center">
                <div className="col-10 col-md-10 col-lg-8 col-xl-7">
                <div className="display-4 text-primary mt-3 mb-2" 
                style={{
                    fontSize: 3 + 'em'
                }}>
                UPLOAD IMAGES
                </div>
                <p className="lead" style={ biggerLead }>
                You can upload up to 10 images.
                </p>
                {user && (
                    <p className="row justify-content-center display-7 text-secondary">Go to the image upload page pressing the button below</p>
                )}
                {/*check if user is null, then do switch*/}
                {user == null && (
                    <span>
                        {/* <Link to="/register" className="btn btn-outline-primary mr-2">
                            Register
                        </Link> */}
                        <Link to="/login" className="btn btn-outline-primary mr-2">
                            Login
                        </Link>
                    </span>
                )}
                {user && (
                    
                    <Link to="/uploadimages" className="btn btn-primary">
                    Upload images
                    </Link>
                )
                }
                
                </div> 
            </div>
        </div>
        );
    }
}
export default Home;