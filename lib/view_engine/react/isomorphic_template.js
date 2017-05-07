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

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

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

        var _this = (0, _possibleConstructorReturn3.default)(this, (IsomorphicTemplate.__proto__ || (0, _getPrototypeOf2.default)(IsomorphicTemplate)).call(this, props));

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
            var _props = this.props,
                assets = _props.assets,
                filtered_model = _props.filtered_model,
                header_tags = _props.header_tags,
                body_class_name = _props.body_class_name,
                app_element_markup = _props.app_element_markup,
                app_script_url = _props.app_script_url,
                body_end_element = _props.body_end_element;


            var app_mount_code = " if (typeof window !== \"undefined\" && window.document && window.document.createElement) {" + " var appElement = React.createElement(window.PageBundle.default,   {model: window.model}); " + " ReactDOM.render(appElement, window.document.getElementById(\"app-element-mountpoint\")); " + "}";

            var model = this.props.model || {};
            var clientInfo = model.client_info || {};
            var clientLocale = clientInfo.client_locale_language || "en";
            var clientCountry = clientInfo.client_locale_country || "US";
            var deviceType = clientInfo.client_type || "desktop";
            var lang = clientLocale + "-" + clientCountry;

            var sanitized_model = filtered_model;

            var app_element_div = _react2.default.createElement("div", { id: "app-element-mountpoint", dangerouslySetInnerHTML: {
                    __html: app_element_markup
                } });

            var modelVarStr = "var model = {};";
            try {
                modelVarStr = "var model = " + (0, _stringify2.default)(sanitized_model) + ";";
            } catch (err) {
                //
            }

            var modelBrowserElement = _react2.default.createElement("script", { dangerouslySetInnerHTML: {
                    __html: modelVarStr
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
                    modelBrowserElement,
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
                    " ",
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
    run_mode: _propTypes2.default.string,
    body_class_name: _propTypes2.default.string,
    assets: _propTypes2.default.object.isRequired,
    model: _propTypes2.default.object.isRequired,
    app_element_markup: _propTypes2.default.string.isRequired,
    filtered_model: _propTypes2.default.object.isRequired,
    header_tags: _propTypes2.default.arrayOf(_propTypes2.default.node),
    locale: _propTypes2.default.string,
    body_end_element: _propTypes2.default.node,
    app_script_url: _propTypes2.default.string.isRequired
};

/**
 * [defaultProps description]
 * @type {Object}
 */
IsomorphicTemplate.defaultProps = {
    run_mode: "production",
    assets: {}
    // app_element_markup     : PropTypes.string,
    // header_tags: PropTypes.arrayOf(PropTypes.node),
    // body_start  : PropTypes.func,
    // body_end    : PropTypes.func,
    // locale      : PropTypes.string
};
