"use strict";

import React from "react";
import {connect} from "react-redux";

import SPAppReducers from "./reducers";

import {SPATemplate as RootTemplate} from "spa-framework";

/**
 *
 */
const TempComponent = ({}) => (
    <div><h1>A single page app test</h1></div>
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

export class SPATemplate extends RootTemplate {
    /**
     *
     */
    constructor(props) {
        super(props);

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

    }

    /**
     * A utility function to create an initial state
     *
     * @param  {[type]} props [description]
     * @return {[type]}       [description]
     */
    genInitialStateData(props) {
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
            javascript: [
                "https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.23.0/polyfill.min.js",
                // "https://npmcdn.com/axios/dist/axios.min.js",
                // "/dsweb/res/js/polyfill.min.js",
                "https://cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react.min.js",
                "https://cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react-dom.min.js",
                "https://cdnjs.cloudflare.com/ajax/libs/react-bootstrap/0.30.7/react-bootstrap.min.js"
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
        return SPAppReducers;
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
