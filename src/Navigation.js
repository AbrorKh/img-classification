import React from 'react';
import {TiCloudStorageOutline} from 'react-icons/ti';
import {Link} from '@reach/router';

class Navigation extends React.Component {
    render(){
        const { user, logOutUser } = this.props;
        return (
            <nav className="site-nav family-sans navbar navbar-expand bg-primary navbar-dark higher">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand">
                    <TiCloudStorageOutline className="mr-1" size={50}/>
                    </Link>
                    <div className="navbar-nav ml-auto">
                    {/* {user && (
                        <Link className="nav-item nav-link" to="/map">
                            Map
                        </Link>
                        )
                    } */}
                    { user && (
                        <Link className="nav-item nav-link" to="/login"
                            onClick={e => logOutUser(e)}>
                        Logout
                        </Link>
                        )
                    }
                    
                    </div>
                </div>
            </nav>
        );
    }
}
export default Navigation;