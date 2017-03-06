"use strict";

import React from "react";
import {connect, Provider} from "react-redux";
import {createStore, applyMiddleware, combineReducers} from "redux";
import redux_thunk from "redux-thunk";

import SPAppReducers from "./reducers";

/**
 *
 * @param {[type]} _csrf     [description]
 * @param {[type]} modelData [description]
 */
const TempComponent = ({}) => (
    <div></div>
);

/**
 *
 * @type {Object}
 */
TempComponent.propTypes = {};

/**
 *
 * @param  {[type]} state [description]
 * @return {[type]}       [description]
 */
const mapStateToProps = (state) => {
    return {};
};

/**
 *
 * @param  {[type]} dispatch [description]
 * @return {[type]}          [description]
 */
const mapDispatchToProps = (dispatch) => {
    return {};
};

const TempContainer = connect(mapStateToProps, mapDispatchToProps)(TempComponent);

/**
 * A utility function to create an initial state
 *
 * @param  {[type]} props [description]
 * @return {[type]}       [description]
 */
const genInitialStateData = (props) => {
    return {
        pageViewID: props.model.pageViewID,
        run_mode: props.model.run_mode,
        deploy_mode: props.model.deploy_mode,
        requestInfo: props.model.requestInfo,
        content: props.model.content,
        metadata: props.model.metadata,
        pageID: props.model.pageID,
        resolvedLocale: props.model.resolvedLocale,
        appState: {}
    };
};

export default class BaseSPATemplate extends React.Component {
    /**
     *
     */
    constructor(props) {
        super(props);

        this.getExternalAssetsDescriptor = this
            .getExternalAssetsDescriptor
            .bind(this);
        this.filterModelData = this
            .filterModelData
            .bind(this);
        this.getHeaderTags = this
            .getHeaderTags
            .bind(this);
        this.getBodyEndElement = this
            .getBodyEndElement
            .bind(this);
        this.getBodyClassName = this
            .getBodyClassName
            .bind(this);
        this.createAppContainer = this
            .createAppContainer
            .bind(this);
        this.getAppStateReducer = this
            .getAppStateReducer
            .bind(this);

    }

    /**
     *
     */
    getExternalAssetsDescriptor(model) {
        const assets = {
            javascript: [],
            styles: []
        };
        return assets;
    }

    /**
    * This method must return a subset of the modelData that is secure for
    * sending to the browser.
    */
    filterModelData(model) {
        return model;
    }

    /**
     *
     */
    getHeaderTags(model) {
        return [];
    }

    /**
      *
      */
    getBodyEndElement() {
        return function() {
            return (<div/>);
        };
    }

    /**
     *
     */
    getBodyClassName(model) {
        return "";
    }

    /**
     *
     */
    createAppContainer() {
        return TempContainer;
    }

    /**
     *
     */
    getAppStateReducer() {
        return {};
    }

    /**
     * Do not override this method in any single page app!!!
     * Just override the method createApp() to return the main app element
     */
    createBody() {

        const AppContainer = this.createAppContainer();

        let appStateReducer = {};
        try {
            appStateReducer = this.getAppStateReducer() || {};
        } catch (err) {}

        /**
         * default appState reducer
         * @param  {Object} [state={}] [description]
         * @return {[type]}            [description]
         */
        function appState(state = {}) {
            return state;
        }

        let uberReducerObj = {
            appState
        };
        Object.assign(uberReducerObj, appStateReducer);
        Object.assign(uberReducerObj, SPAppReducers);

        this.___privpriv___store = createStore(combineReducers(uberReducerObj), genInitialStateData(this.props), applyMiddleware(redux_thunk));

        return (
            <Provider store={this.___privpriv___store}>
                <AppContainer/>
            </Provider>
        );
    }

    /**
     *
     */
    render() {
        return (
            <div id="document-body">
                {this.createBody()}
            </div>
        );
    }

}

/**
 *
 * @type {Object}
 */
BaseSPATemplate.propTypes = {
    pageViewID: React.PropTypes.string,
    run_mode: React.PropTypes.string,
    deploy_mode: React.PropTypes.string,
    content: React.PropTypes.object,
    metadata: React.PropTypes.object,
    requestInfo: React.PropTypes.object,
    resolvedLocale: React.PropTypes.object,
    pageID: React.PropTypes.string
};

/**
 *
 * @type {Object}
 */
BaseSPATemplate.defaultProps = {};
