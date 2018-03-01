"use strict";




import React from "react";
import PropTypes from "prop-types";
import {createStore, applyMiddleware, combineReducers} from "redux";
import redux_thunk from "redux-thunk";
import {connect, Provider} from "react-redux";
import {get as _get, set as _set} from "lodash";

import SPAppReducers from "./reducers";

/**
 *
 */
const TempComponent = ({}) => (<div>
    <h1>A single page app - test</h1>
</div>);

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

export class SPATemplate extends React.Component {
    /**
     *
     */
    constructor(props) {
        super(props);

        this.____createBody__ = this
            .____createBody__
            .bind(this);

        this.genInitialStateData = this
            .genInitialStateData
            .bind(this);

        this.getExternalAssetsDescriptor = this
            .getExternalAssetsDescriptor
            .bind(this);
        this.filterModel = this
            .filterModel
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

        const isomorphic_props = _get(props, "isomorphic_props");
        const model = _get(props, "model");
        if ((typeof isomorphic_props === "object") && (typeof model === "object")) {
            _set(isomorphic_props, "assets", this.getExternalAssetsDescriptor(model));
            _set(isomorphic_props, "filtered_model", this.filterModel(model));
            _set(isomorphic_props, "header_tags", this.getHeaderTags(model));
            _set(isomorphic_props, "body_class_name", this.getBodyClassName(model));
            _set(isomorphic_props, "body_end_element", this.getBodyEndElement(model));
        }
    }

    /**
     * A utility function to create an initial state
     *
     * @param  {[type]} props [description]
     * @return {[type]}       [description]
     */
    genInitialStateData(props) {
        return {
            appMountPoint: props.model.app_root,
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
    }

    /**
     *
     */
    getExternalAssetsDescriptor(model) {
        const assets = {
            javascript: [
                "https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.26.0/polyfill.min.js",
                "https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js",
                "https://cdnjs.cloudflare.com/ajax/libs/react/16.2.0/cjs/react.production.min.js",
                "https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.2.0/cjs/react-dom.production.min.js",
                "https://cdnjs.cloudflare.com/ajax/libs/react-bootstrap/0.32.1/react-bootstrap.min.js"
            ],
            styles: [
                //
                //
                "https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css",
                "https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap-theme.min.css",
                "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css",
                "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-social/5.0.0/bootstrap-social.min.css"
            ]
        };
        return assets;
    }

    /**
    * This method must return a subset of the model that is secure for
    * sending to the browser.
    */
    filterModel(model) {
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
    getBodyEndElement(model) {
        return (<div/>);
    }

    /**
     *
     */
    getBodyClassName(model) {
        return "body-class";
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
        return SPAppReducers;
    }

    /**
     *
     */
    ____createBody__() {

        const AppContainer = this.createAppContainer();

        let appStateReducer = {};
        try {
            appStateReducer = this.getAppStateReducer() || {};
        } catch (err) {
            //
        }

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

        this.___privpriv___store = createStore(combineReducers(uberReducerObj), this.genInitialStateData(this.props), applyMiddleware(redux_thunk));

        return (<Provider store={this.___privpriv___store}>
            <AppContainer/>
        </Provider>);
    }

    /**
     *
     */
    render() {
        return (<div id="document-body">
            {this.____createBody__()}
        </div>);
    }
}

/**
 *
 * @type {Object}
 */
SPATemplate.propTypes = {
    model: PropTypes.shape({
        app_root: PropTypes.string,
        pageViewID: PropTypes.string,
        run_mode: PropTypes.string,
        deploy_mode: PropTypes.string,
        content: PropTypes.object,
        metadata: PropTypes.object,
        requestInfo: PropTypes.object,
        resolvedLocale: PropTypes.object,
        pageID: PropTypes.string
    })
};

/**
 *
 * @type {Object}
 */
SPATemplate.defaultProps = {};
