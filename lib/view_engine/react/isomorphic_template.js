/**
 * Created by aismael on 4/20/2016.
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

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

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _server = require("react-dom/server");

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 */

var IsomorphicTemplate = function (_React$Component) {
    (0, _inherits3.default)(IsomorphicTemplate, _React$Component);


    /**
     *
     * @param props
     */

    function IsomorphicTemplate(props) {
        (0, _classCallCheck3.default)(this, IsomorphicTemplate);

        //this.state = {balance: props.openingBalance};

        var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(IsomorphicTemplate).call(this, props));

        _this.state = {};
        return _this;
    }

    /**
     * This method is for server-side rendering only!
     * @returns {XML}
     */


    (0, _createClass3.default)(IsomorphicTemplate, [{
        key: "render",
        value: function render() {
            var _props = this.props;
            var run_mode = _props.run_mode;
            var assets = _props.assets;
            var filter_model_data = _props.filter_model_data;
            var header_tags = _props.header_tags;
            var body_class_name = _props.body_class_name;
            var app_element = _props.app_element;
            var locale = _props.locale;
            var app_script_url = _props.app_script_url;
            var body_end_element = _props.body_end_element;


            var app_element_markup = _server2.default.renderToString(app_element);
            var app_element_div = _react2.default.createElement("div", { id: "app-element-mountpoint", dangerouslySetInnerHTML: {
                    __html: app_element_markup
                } });

            var app_mount_code = " if (typeof window !== \"undefined\" && window.document && window.document.createElement) {" + " var appElement = React.createElement(window.PageBundle.default,   {modelData: window.modelData}); " + " ReactDOM.render(appElement, window.document.getElementById(\"app-element-mountpoint\")); " + "}";

            var tempModelData = this.props.modelData || {};

            var modelData = tempModelData;
            var clientInfo = tempModelData.client_info;
            var clientLocale = "en"; //clientInfo.client_locale_language;
            var clientCountry = "US"; //clientInfo.client_locale_country;
            var deviceType = "desktop"; //clientInfo.client_type;
            var lang = clientLocale + "-" + clientCountry;

            var sanitized_model_data = this.props.filter_model_data(tempModelData);

            var modelDataVarStr = "var modelData = {};";
            try {
                modelDataVarStr = "var modelData = " + (0, _stringify2.default)(sanitized_model_data) + ";";
            } catch (err) {}

            var modelDataBrowserElement = _react2.default.createElement("script", { dangerouslySetInnerHTML: {
                    __html: modelDataVarStr
                } });

            var html = _react2.default.createElement(
                "html",
                { lang: lang, "data-device-type": deviceType, className: "no-js" },
                _react2.default.createElement(
                    "head",
                    null,
                    header_tags.map(function (header_tag) {
                        return header_tag;
                    }),
                    modelDataBrowserElement,
                    assets.styles.map(function (style_url, idx) {
                        return _react2.default.createElement("link", { key: "style_" + idx, href: style_url, media: "screen, projection", rel: "stylesheet", type: "text/css", charSet: "UTF-8" });
                    })
                ),
                _react2.default.createElement(
                    "body",
                    { className: body_class_name },
                    app_element_div,
                    assets.javascript.map(function (script_url, idx) {
                        return _react2.default.createElement("script", { src: script_url, key: "js_script_" + idx, charSet: "UTF-8" });
                    }),
                    _react2.default.createElement("script", { src: app_script_url, charSet: "UTF-8" }),
                    _react2.default.createElement("script", { dangerouslySetInnerHTML: {
                            __html: app_mount_code
                        }, charSet: "UTF-8" }),
                    " ",
                    body_end_element
                )
            );

            return html;
        }
    }]);
    return IsomorphicTemplate;
}(_react2.default.Component);

/**
 * [propTypes description]
 * @type {Object}
 */


exports.default = IsomorphicTemplate;
IsomorphicTemplate.propTypes = {
    run_mode: _react.PropTypes.string,
    body_class_name: _react.PropTypes.string,
    assets: _react.PropTypes.object.isRequired,
    modelData: _react.PropTypes.object.isRequired,
    app_element: _react.PropTypes.node.isRequired,
    filter_model_data: _react.PropTypes.func.isRequired,
    header_tags: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.node),
    locale: _react.PropTypes.string,
    body_end_element: _react.PropTypes.node,
    app_script_url: _react.PropTypes.string.isRequired
};

/**
 * [defaultProps description]
 * @type {Object}
 */
IsomorphicTemplate.defaultProps = {
    run_mode: "production",
    assets: {}
    // app_element     : PropTypes.node,
    // header_tags: React.PropTypes.arrayOf(React.PropTypes.node),
    // body_start  : PropTypes.func,
    // body_end    : PropTypes.func,
    // locale      : PropTypes.string
};
