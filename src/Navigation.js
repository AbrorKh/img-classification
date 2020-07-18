import React from 'react';
import {Link} from '@reach/router';
import mySvg from './bee.svg'
class Navigation extends React.Component {
    render(){
        const { user, logOutUser } = this.props;
        return (
            <nav className="site-nav family-sans navbar navbar-expand bg-primary navbar-dark higher">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand">
                    <img src={mySvg} width="60" height="60" alt="bee-logo"/>
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