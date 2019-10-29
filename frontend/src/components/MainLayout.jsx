import connect from "react-redux/es/connect/connect";
import {Route, Switch} from "react-router";
import GearTable from "./GearTable";
import {ConnectedRouter} from "connected-react-router";
import React from "react";
import {history} from "../reducers/rootReducer";
import Navigator from "./Navigator";

class MainLayout extends React.Component {

    render() {
        const {darkTheme} = this.props;

        return (
            <ConnectedRouter history={history}>
                <div className={ darkTheme ? "bp3-dark" : "" }>
                    <Navigator/>
                    <div style={{height: '94.95vh'}}>
                        <Switch>
                            <Route exact path='/' render={() => <span>Home page is under construction</span>}/>
                            <Route exact path='/armory' render={() => <GearTable />}/>
                            <Route path='/rio' render={() => <span>Rio is under construction</span>}/>
                            <Route path='/config' render={() => <span>Configuration is under construction</span>}/>
                        </Switch>
                    </div>
                </div>
            </ConnectedRouter>
        );
    }
}

const mapStateToProps = state => ({
    darkTheme: state.navigator.darkTheme
});

export default connect(mapStateToProps)(MainLayout)