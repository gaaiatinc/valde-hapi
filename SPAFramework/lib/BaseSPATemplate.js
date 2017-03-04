"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _objectDestructuringEmpty2 = require("babel-runtime/helpers/objectDestructuringEmpty");

var _objectDestructuringEmpty3 = _interopRequireDefault(_objectDestructuringEmpty2);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require("react-redux");

var _redux = require("redux");

var _reduxThunk = require("redux-thunk");

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reducers = require("./reducers");

var _reducers2 = _interopRequireDefault(_reducers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @param {[type]} _csrf     [description]
 * @param {[type]} modelData [description]
 */
var TempComponent = function TempComponent(_ref) {
    (0, _objectDestructuringEmpty3.default)(_ref);
    return _react2.default.createElement("div", null);
};

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
var mapStateToProps = function mapStateToProps(state) {
    return {};
};

/**
 *
 * @param  {[type]} dispatch [description]
 * @return {[type]}          [description]
 */
var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {};
};

var TempContainer = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(TempComponent);

/**
 * A utility function to create an initial state
 *
 * @param  {[type]} props [description]
 * @return {[type]}       [description]
 */
var genInitialStateData = function genInitialStateData(props) {
    return {
        pageViewID: props.model.pageViewID,
        run_mode: props.model.run_mode,
        deploy_mode: props.model.deploy_mode,
        requestInfo: props.model.requestInfo,
        content: props.model.content,
        metadata: props.model.metadata,
        appState: {}
    };
};

var BaseSPATemplate = function (_React$Component) {
    (0, _inherits3.default)(BaseSPATemplate, _React$Component);

    /**
     *
     */
    function BaseSPATemplate(props) {
        (0, _classCallCheck3.default)(this, BaseSPATemplate);
        return (0, _possibleConstructorReturn3.default)(this, (BaseSPATemplate.__proto__ || (0, _getPrototypeOf2.default)(BaseSPATemplate)).call(this, props));
    }

    /**
     *
     */


    (0, _createClass3.default)(BaseSPATemplate, [{
        key: "getExternalAssetsDescriptor",
        value: function getExternalAssetsDescriptor(model) {
            var assets = {
                javascript: [],
                styles: []
            };
            return assets;
        }

        /**
        * This method must return a subset of the modelData that is secure for
        * sending to the browser.
        */

    }, {
        key: "filterModelData",
        value: function filterModelData(model) {
            return model;
        }

        /**
         *
         */

    }, {
        key: "getHeaderTags",
        value: function getHeaderTags(model) {
            return [];
        }

        /**
          *
          */

    }, {
        key: "getBodyEndElement",
        value: function getBodyEndElement() {
            return function () {
                return _react2.default.createElement("div", null);
            };
        }

        /**
         *
         */

    }, {
        key: "getBodyClassName",
        value: function getBodyClassName(model) {
            return "";
        }

        /**
         *
         */

    }, {
        key: "createAppContainer",
        value: function createAppContainer() {
            return TempContainer;
        }

        /**
         *
         */

    }, {
        key: "getAppStateReducer",
        value: function getAppStateReducer() {
            return {};
        }

        /**
         * Do not override this method in any single page app!!!
         * Just override the method createApp() to return the main app element
         */

    }, {
        key: "createBody",
        value: function createBody() {

            var AppContainer = this.createAppContainer();

            var appStateReducer = {};
            try {
                appStateReducer = this.getAppStateReducer() || {};
            } catch (err) {}

            /**
             * default appState reducer
             * @param  {Object} [state={}] [description]
             * @return {[type]}            [description]
             */
            function appState() {
                var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                return state;
            }

            var uberReducerObj = {
                appState: appState
            };
            (0, _assign2.default)(uberReducerObj, appStateReducer);
            (0, _assign2.default)(uberReducerObj, _reducers2.default);

            this.___privpriv___store = (0, _redux.createStore)((0, _redux.combineReducers)(uberReducerObj), genInitialStateData(this.props), (0, _redux.applyMiddleware)(_reduxThunk2.default));

            return _react2.default.createElement(
                _reactRedux.Provider,
                { store: this.___privpriv___store },
                _react2.default.createElement(AppContainer, null)
            );
        }

        /**
         *
         */

    }, {
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                "div",
                { id: "document-body" },
                this.createBody()
            );
        }
    }]);
    return BaseSPATemplate;
}(_react2.default.Component);

/**
 *
 * @type {Object}
 */


exports.default = BaseSPATemplate;
BaseSPATemplate.propTypes = {
    pageViewID: _react2.default.PropTypes.string,
    run_mode: _react2.default.PropTypes.string,
    deploy_mode: _react2.default.PropTypes.string,
    content: _react2.default.PropTypes.object,
    metadata: _react2.default.PropTypes.object,
    requestInfo: _react2.default.PropTypes.object
};

/**
 *
 * @type {Object}
 */
BaseSPATemplate.defaultProps = {};
