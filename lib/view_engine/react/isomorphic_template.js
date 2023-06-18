/**
 * Created by aismael on 4/20/2016.
 */

"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
 *
 */
var IsomorphicTemplate = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(IsomorphicTemplate, _React$Component);
  var _super = _createSuper(IsomorphicTemplate);
  /**
   *
   * @param props
   */
  function IsomorphicTemplate(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, IsomorphicTemplate);
    _this = _super.call(this, props);
    _this.state = {};
    return _this;
  }

  /**
   * This method is for server-side rendering only!
   * @returns {XML}
   */
  (0, _createClass2["default"])(IsomorphicTemplate, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
        assets = _this$props.assets,
        filtered_model = _this$props.filtered_model,
        header_tags = _this$props.header_tags,
        body_class_name = _this$props.body_class_name,
        app_element_markup = _this$props.app_element_markup,
        app_script_url = _this$props.app_script_url,
        body_end_element = _this$props.body_end_element;
      var app_mount_code = "if (typeof window !== \"undefined\" && window.document && window.document.createElement) {\n            var appElement = React.createElement(window.PageBundle.default,   {model: window.model});\n            ReactDOM.hydrate(appElement, window.document.getElementById(\"app-element-mountpoint\"));\n        }";
      var model = this.props.model || {};
      var clientInfo = model.client_info || {};
      var clientLocale = clientInfo.client_locale_language || "en";
      var clientCountry = clientInfo.client_locale_country || "US";
      var deviceType = clientInfo.client_type || "desktop";
      var lang = "".concat(clientLocale, "-").concat(clientCountry);
      var sanitized_model = filtered_model;
      var app_element_div = /*#__PURE__*/_react["default"].createElement("div", {
        id: "app-element-mountpoint",
        dangerouslySetInnerHTML: {
          __html: app_element_markup
        }
      });
      var modelVarStr = "var model = {};";
      try {
        modelVarStr = "var model = " + JSON.stringify(sanitized_model) + ";";
      } catch (err) {
        //
      }
      var modelBrowserElement = /*#__PURE__*/_react["default"].createElement("script", {
        dangerouslySetInnerHTML: {
          __html: modelVarStr
        }
      });
      var html = /*#__PURE__*/_react["default"].createElement("html", {
        lang: lang,
        "data-device-type": deviceType,
        className: "no-js"
      }, /*#__PURE__*/_react["default"].createElement("head", null, header_tags.map(function (header_tag) {
        return header_tag;
      }), modelBrowserElement, assets.styles.map(function (style_url, idx) {
        return /*#__PURE__*/_react["default"].createElement("link", {
          key: "style_" + idx,
          href: style_url,
          media: "screen, projection",
          rel: "stylesheet",
          type: "text/css",
          charSet: "UTF-8"
        });
      })), /*#__PURE__*/_react["default"].createElement("body", {
        className: body_class_name
      }, app_element_div, assets.javascript.map(function (script_url, idx) {
        return /*#__PURE__*/_react["default"].createElement("script", {
          src: script_url,
          key: "js_script_" + idx,
          charSet: "UTF-8"
        });
      }), /*#__PURE__*/_react["default"].createElement("script", {
        src: app_script_url,
        charSet: "UTF-8"
      }), " ", /*#__PURE__*/_react["default"].createElement("script", {
        dangerouslySetInnerHTML: {
          __html: app_mount_code
        },
        charSet: "UTF-8"
      }), " ", body_end_element));
      return html;
    }
  }]);
  return IsomorphicTemplate;
}(_react["default"].Component);
/**
 * [propTypes description]
 * @type {Object}
 */
exports["default"] = IsomorphicTemplate;
IsomorphicTemplate.propTypes = {
  run_mode: _propTypes["default"].string,
  body_class_name: _propTypes["default"].string,
  assets: _propTypes["default"].object.isRequired,
  model: _propTypes["default"].object.isRequired,
  app_element_markup: _propTypes["default"].string.isRequired,
  filtered_model: _propTypes["default"].object.isRequired,
  header_tags: _propTypes["default"].arrayOf(_propTypes["default"].node),
  locale: _propTypes["default"].string,
  body_end_element: _propTypes["default"].node,
  app_script_url: _propTypes["default"].string.isRequired
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
