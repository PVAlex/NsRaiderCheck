import React from 'react'
import {push} from 'connected-react-router';

// types of action
const Types = {
    SWITCH_THEME: 'SWITCH_THEME'
};

export function switchTheme() {
    return dispatch => {dispatch(fetchSwitchTheme())};
}

export function navigateTo(path) {
    return dispatch => {dispatch(push(path))};
}

const fetchSwitchTheme = () => ({
    type: Types.SWITCH_THEME,
});

export default {
    fetchSwitchTheme,
    Types
};