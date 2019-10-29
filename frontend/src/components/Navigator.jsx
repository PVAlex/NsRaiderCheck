import React from "react";
import {Button, Navbar, Alignment} from "@blueprintjs/core";
import {connect} from "react-redux";
import {navigateTo, switchTheme} from "../actions/navigatorActions";


class Navigator extends React.Component {

    render() {
        const {darkTheme, navigateTo, switchTheme} = this.props;

        return (
                <Navbar>
                    <Navbar.Group align={Alignment.LEFT}>
                        <Navbar.Heading>Raider check</Navbar.Heading>
                        <Navbar.Divider/>
                        <Button className="bp3-minimal" icon="home"
                                onClick={() => navigateTo('/')}/>
                        <Button className="bp3-minimal" icon="document" text="Armory"
                                onClick={() => navigateTo('/armory')}/>
                        <Button className="bp3-minimal" icon="document" text="Rio"
                                onClick={() => navigateTo('/rio')}/>
                        <Button className="bp3-minimal" icon="document" text="Wcl"
                                onClick={() => navigateTo('/wcl')}/>
                    </Navbar.Group>
                    <Navbar.Group align={Alignment.RIGHT}>
                        <Navbar.Divider/>
                        <Button className='disable-focus' minimal icon={darkTheme ? 'moon' : 'flash'}
                                onClick={switchTheme}/>
                        <Button className='disable-focus' minimal icon="cog"
                                onClick={() => navigateTo('/config')}/>
                    </Navbar.Group>
                </Navbar>
        );
    }
}

const mapStateToProps = state => ({
    darkTheme: state.navigator.darkTheme
});

const mapDispatchToProps = dispatch => ({
    navigateTo: (path) => dispatch(navigateTo(path)),
    switchTheme: () => dispatch(switchTheme())
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigator)