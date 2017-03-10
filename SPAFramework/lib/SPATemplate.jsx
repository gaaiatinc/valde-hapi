"use strict";

import React from "react";
import {connect, Provider} from "react-redux";
import {createStore, applyMiddleware, combineReducers} from "redux";
import redux_thunk from "redux-thunk";

import SPAppReducers from "./reducers";

import {SPATemplate as BaseSPATemplate} from "spa-framework";

/**
 *
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


export class SPATemplate extends BaseSPATemplate {
    /**
     *
     */
    constructor(props) {
        super(props);

        this.genInitialStateData = this
            .genInitialStateData
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

    }

    /**
     * A utility function to create an initial state
     *
     * @param  {[type]} props [description]
     * @return {[type]}       [description]
     */
    genInitialStateData = (props) => {
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
SPATemplate.propTypes = {
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
SPATemplate.defaultProps = {};
