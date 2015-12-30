/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./WebComponents";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _getPrototypeOf = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/core-js/object/get-prototype-of\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/classCallCheck\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/createClass\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/possibleConstructorReturn\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/inherits\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(2);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _HelloButton = __webpack_require__(3);

	var _HelloButton2 = _interopRequireDefault(_HelloButton);

	var _Greeting = __webpack_require__(4);

	var _Greeting2 = _interopRequireDefault(_Greeting);

	var _parent = __webpack_require__(5);

	var _parent2 = _interopRequireDefault(_parent);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var PageBodyTop = (function (_React$Component) {
	    (0, _inherits3.default)(PageBodyTop, _React$Component);

	    function PageBodyTop(props) {
	        (0, _classCallCheck3.default)(this, PageBodyTop);

	        var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(PageBodyTop).call(this, props));

	        _this.state = { balance: props.openingBalance };
	        return _this;
	    }

	    (0, _createClass3.default)(PageBodyTop, [{
	        key: "render",
	        value: function render() {
	            return _react2.default.createElement(
	                "p",
	                null,
	                "hello page body top!!"
	            );
	        }
	    }]);
	    return PageBodyTop;
	})(_react2.default.Component);

	var pageBodyTop = _react2.default.createElement(PageBodyTop, null);

	var PageBodyMain = (function (_React$Component2) {
	    (0, _inherits3.default)(PageBodyMain, _React$Component2);

	    function PageBodyMain(props) {
	        (0, _classCallCheck3.default)(this, PageBodyMain);

	        var _this2 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(PageBodyMain).call(this, props));

	        _this2.state = { balance: props.openingBalance };
	        return _this2;
	    }

	    (0, _createClass3.default)(PageBodyMain, [{
	        key: "componentWillMount",
	        value: function componentWillMount() {
	            console.log("pageBodyMain did mount!!!");
	        }
	    }, {
	        key: "render",
	        value: function render() {
	            return _react2.default.createElement(_HelloButton2.default, null);
	        }
	    }]);
	    return PageBodyMain;
	})(_react2.default.Component);

	var pageBodyMain = _react2.default.createElement(PageBodyMain, { id: "tttttttt" });

	var DemoPage = (function (_ParentTemplate) {
	    (0, _inherits3.default)(DemoPage, _ParentTemplate);

	    function DemoPage(props) {
	        (0, _classCallCheck3.default)(this, DemoPage);

	        //this.state = {balance: props.openingBalance};

	        var _this3 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(DemoPage).call(this, props));

	        _this3.bodyTop = pageBodyTop;
	        _this3.bodyMain = pageBodyMain;

	        if (typeof document !== "undefined") {
	            alert("we are almost there!");
	        }
	        return _this3;
	    }

	    //render() {
	    //    return (
	    //        <html>
	    //        <TemplateHead entityRelativePath={entityRelativePath} modelData={modelData}/>
	    //        <TemplateBody />
	    //        </html>
	    //    );
	    //}

	    return DemoPage;
	})(_parent2.default);
	//DemoPage.propTypes = { openingBalance: React.PropTypes.number };
	//DemoPage.defaultProps = { openingBalance: 0 };

	//let fullApp = React.createElement(DemoPage);

	exports.default = DemoPage;
	if (typeof document !== "undefined") {
	    //pageBodyMain.forceUpdate();
	    //alert(pageBodyMain.props);
	    _reactDom2.default.render(pageBodyMain, document.getElementById("mmmmmmmm"));
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = ReactDOM;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _getPrototypeOf = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/core-js/object/get-prototype-of\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/classCallCheck\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/createClass\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/possibleConstructorReturn\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/inherits\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var HelloButton = (function (_React$Component) {
	    (0, _inherits3.default)(HelloButton, _React$Component);

	    function HelloButton() {
	        (0, _classCallCheck3.default)(this, HelloButton);
	        return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(HelloButton).apply(this, arguments));
	    }

	    (0, _createClass3.default)(HelloButton, [{
	        key: "handleClick",
	        value: function handleClick() {
	            alert("Hello From React...");
	        }
	    }, {
	        key: "render",
	        value: function render() {
	            return _react2.default.createElement(
	                "button",
	                { type: "button", onClick: this.handleClick },
	                "Click Me! "
	            );
	        }
	    }]);
	    return HelloButton;
	})(_react2.default.Component);

	exports.default = HelloButton;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/core-js/object/get-prototype-of\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/classCallCheck\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/createClass\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/possibleConstructorReturn\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/inherits\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Greeting = (function (_React$Component) {
	  (0, _inherits3.default)(Greeting, _React$Component);

	  function Greeting() {
	    (0, _classCallCheck3.default)(this, Greeting);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Greeting).apply(this, arguments));
	  }

	  (0, _createClass3.default)(Greeting, [{
	    key: "render",
	    value: function render() {
	      return _react2.default.createElement(
	        "p",
	        null,
	        "Hello, Universe"
	      );
	    }
	  }]);
	  return Greeting;
	})(_react2.default.Component);

	exports.default = Greeting;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _getPrototypeOf = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/core-js/object/get-prototype-of\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/classCallCheck\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/createClass\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/possibleConstructorReturn\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/inherits\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(2);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _TemplateHead = __webpack_require__(6);

	var _TemplateHead2 = _interopRequireDefault(_TemplateHead);

	var _AppScript = __webpack_require__(13);

	var _AppScript2 = _interopRequireDefault(_AppScript);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 *
	 */

	var AppMount = (function (_React$Component) {
	    (0, _inherits3.default)(AppMount, _React$Component);

	    function AppMount(props) {
	        (0, _classCallCheck3.default)(this, AppMount);

	        var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(AppMount).call(this, props));

	        _this.state = { balance: props.openingBalance };
	        return _this;
	    }

	    (0, _createClass3.default)(AppMount, [{
	        key: "render",
	        value: function render() {
	            return _react2.default.createElement(
	                "p",
	                null,
	                "hello!!"
	            );
	        }
	    }]);
	    return AppMount;
	})(_react2.default.Component);

	var ParentTemplate = (function (_React$Component2) {
	    (0, _inherits3.default)(ParentTemplate, _React$Component2);

	    function ParentTemplate(props) {
	        (0, _classCallCheck3.default)(this, ParentTemplate);

	        var _this2 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ParentTemplate).call(this, props));

	        _this2.state = { balance: props.openingBalance };

	        _this2.bodyTop = _react2.default.createElement(AppMount, null);
	        _this2.bodyMain = _react2.default.createElement(AppMount, { id: "qqqq" });
	        _this2.bodyBottom = _react2.default.createElement(AppMount, null);
	        return _this2;
	    }

	    (0, _createClass3.default)(ParentTemplate, [{
	        key: "componentDidMount",
	        value: function componentDidMount() {

	            console.log(">>>>>>>  parentTmplate did mount!");
	            /**
	             * The following is for client side rendering:
	             */
	            if (typeof document !== "undefined") {
	                alert("foooo");
	                _reactDom2.default.render(this.bodyMain, document.getElementById("mmmmmmmm"));
	                //ReactDOM.render(this.renderBodyTop(), document.getElementById("body_top_mount_point"));
	                //ReactDOM.render(this.renderBodyMain(), document.getElementById("body_main_mount_point"));
	                //ReactDOM.render(this.renderBodyBottom(), document.getElementById("body_bottom_mount_point"));
	            }
	        }
	    }, {
	        key: "render",
	        value: function render() {
	            return _react2.default.createElement(
	                "html",
	                null,
	                _react2.default.createElement(_TemplateHead2.default, { entityRelativePath: entityRelativePath, modelData: modelData }),
	                _react2.default.createElement(
	                    "body",
	                    null,
	                    _react2.default.createElement(
	                        "div",
	                        { id: "body_top_mount_point" },
	                        this.bodyTop
	                    ),
	                    _react2.default.createElement(
	                        "div",
	                        { id: "mmmmmmmm" },
	                        this.bodyMain
	                    ),
	                    _react2.default.createElement(
	                        "div",
	                        { id: "body_bottom_mount_point" },
	                        this.bodyBottom
	                    ),
	                    _react2.default.createElement(_AppScript2.default, null)
	                )
	            );
	        }
	    }]);
	    return ParentTemplate;
	})(_react2.default.Component);

	exports.default = ParentTemplate;

	ParentTemplate.propTypes = { openingBalance: _react2.default.PropTypes.number };
	ParentTemplate.defaultProps = { openingBalance: 0 };

	var fullApp = _react2.default.createElement(ParentTemplate);

	/**
	 * The following is for client side rendering:
	 */
	if (typeof document !== "undefined") {
	    //alert("we are almost there!");
	    //ReactDOM.render(fullApp, document.documentElement);
	    //ReactDOM.render(fullApp, document.getElementById("body_main_mount_point"));
	    //ReactDOM.render(ParentTemplate.renderBodyMain(), document.getElementById("body_main_mount_point"));
	    //ReactDOM.render(ParentTemplate.renderBodyBottom(), document.getElementById("body_bottom_mount_point"));
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	   value: true
	});

	var _getPrototypeOf = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/core-js/object/get-prototype-of\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/classCallCheck\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/createClass\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/possibleConstructorReturn\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/inherits\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _HeadReactScript = __webpack_require__(7);

	var _HeadReactScript2 = _interopRequireDefault(_HeadReactScript);

	var _HeadReactDOMScript = __webpack_require__(8);

	var _HeadReactDOMScript2 = _interopRequireDefault(_HeadReactDOMScript);

	var _ModelData = __webpack_require__(9);

	var _ModelData2 = _interopRequireDefault(_ModelData);

	var _Title = __webpack_require__(10);

	var _Title2 = _interopRequireDefault(_Title);

	var _MetaCharSet = __webpack_require__(11);

	var _MetaCharSet2 = _interopRequireDefault(_MetaCharSet);

	var _HeadJQueryScript = __webpack_require__(12);

	var _HeadJQueryScript2 = _interopRequireDefault(_HeadJQueryScript);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var HeadScripts = (function (_React$Component) {
	   (0, _inherits3.default)(HeadScripts, _React$Component);

	   function HeadScripts() {
	      (0, _classCallCheck3.default)(this, HeadScripts);
	      return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(HeadScripts).apply(this, arguments));
	   }

	   (0, _createClass3.default)(HeadScripts, [{
	      key: "render",
	      value: function render() {
	         return _react2.default.createElement(
	            "head",
	            null,
	            _react2.default.createElement(_MetaCharSet2.default, null),
	            _react2.default.createElement(_Title2.default, null),
	            _react2.default.createElement(_HeadReactScript2.default, null),
	            _react2.default.createElement(_HeadReactDOMScript2.default, null),
	            _react2.default.createElement(_HeadJQueryScript2.default, null),
	            _react2.default.createElement(_ModelData2.default, { modelData: this.props.modelData })
	         );
	      }
	   }]);
	   return HeadScripts;
	})(_react2.default.Component);

	exports.default = HeadScripts;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _getPrototypeOf = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/core-js/object/get-prototype-of\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/classCallCheck\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/createClass\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/possibleConstructorReturn\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/inherits\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var HeadReactScript = (function (_React$Component) {
	    (0, _inherits3.default)(HeadReactScript, _React$Component);

	    function HeadReactScript() {
	        (0, _classCallCheck3.default)(this, HeadReactScript);
	        return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(HeadReactScript).apply(this, arguments));
	    }

	    (0, _createClass3.default)(HeadReactScript, [{
	        key: "render",
	        value: function render() {
	            return _react2.default.createElement("script", { src: "https://fb.me/react-0.14.3.js" });
	        }
	    }]);
	    return HeadReactScript;
	})(_react2.default.Component);

	exports.default = HeadReactScript;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _getPrototypeOf = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/core-js/object/get-prototype-of\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/classCallCheck\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/createClass\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/possibleConstructorReturn\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/inherits\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var HeadReactDOMScript = (function (_React$Component) {
	    (0, _inherits3.default)(HeadReactDOMScript, _React$Component);

	    function HeadReactDOMScript() {
	        (0, _classCallCheck3.default)(this, HeadReactDOMScript);
	        return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(HeadReactDOMScript).apply(this, arguments));
	    }

	    (0, _createClass3.default)(HeadReactDOMScript, [{
	        key: "render",
	        value: function render() {
	            return _react2.default.createElement("script", { src: "https://fb.me/react-dom-0.14.3.js" });
	        }
	    }]);
	    return HeadReactDOMScript;
	})(_react2.default.Component);

	exports.default = HeadReactDOMScript;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _stringify = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/core-js/json/stringify\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _stringify2 = _interopRequireDefault(_stringify);

	var _getPrototypeOf = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/core-js/object/get-prototype-of\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/classCallCheck\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/createClass\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/possibleConstructorReturn\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/inherits\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ModelData = (function (_React$Component) {
	    (0, _inherits3.default)(ModelData, _React$Component);

	    function ModelData() {
	        (0, _classCallCheck3.default)(this, ModelData);
	        return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ModelData).apply(this, arguments));
	    }

	    (0, _createClass3.default)(ModelData, [{
	        key: "render",
	        value: function render() {
	            return _react2.default.createElement("script", {
	                dangerouslySetInnerHTML: { __html: "var modelData = " + (0, _stringify2.default)(this.props.modelData) + ";" } });
	        }
	    }]);
	    return ModelData;
	})(_react2.default.Component);

	exports.default = ModelData;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/core-js/object/get-prototype-of\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/classCallCheck\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/createClass\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/possibleConstructorReturn\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/inherits\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Title = (function (_React$Component) {
	  (0, _inherits3.default)(Title, _React$Component);

	  function Title() {
	    (0, _classCallCheck3.default)(this, Title);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Title).apply(this, arguments));
	  }

	  (0, _createClass3.default)(Title, [{
	    key: "render",
	    value: function render() {
	      return _react2.default.createElement(
	        "title",
	        null,
	        "Hello React 2.0"
	      );
	    }
	  }]);
	  return Title;
	})(_react2.default.Component);

	exports.default = Title;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/core-js/object/get-prototype-of\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/classCallCheck\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/createClass\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/possibleConstructorReturn\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/inherits\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var MetaCharSet = (function (_React$Component) {
	  (0, _inherits3.default)(MetaCharSet, _React$Component);

	  function MetaCharSet() {
	    (0, _classCallCheck3.default)(this, MetaCharSet);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(MetaCharSet).apply(this, arguments));
	  }

	  (0, _createClass3.default)(MetaCharSet, [{
	    key: "render",
	    value: function render() {
	      return _react2.default.createElement("meta", { charSet: "UTF-8" });
	    }
	  }]);
	  return MetaCharSet;
	})(_react2.default.Component);

	exports.default = MetaCharSet;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _getPrototypeOf = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/core-js/object/get-prototype-of\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/classCallCheck\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/createClass\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/possibleConstructorReturn\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/inherits\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var HeadJQueryScript = (function (_React$Component) {
	    (0, _inherits3.default)(HeadJQueryScript, _React$Component);

	    function HeadJQueryScript() {
	        (0, _classCallCheck3.default)(this, HeadJQueryScript);
	        return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(HeadJQueryScript).apply(this, arguments));
	    }

	    (0, _createClass3.default)(HeadJQueryScript, [{
	        key: "render",
	        value: function render() {
	            return _react2.default.createElement("script", { src: "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js" });
	        }
	    }]);
	    return HeadJQueryScript;
	})(_react2.default.Component);

	exports.default = HeadJQueryScript;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _getPrototypeOf = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/core-js/object/get-prototype-of\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/classCallCheck\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/createClass\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/possibleConstructorReturn\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-runtime/helpers/inherits\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var AppScript = (function (_React$Component) {
	    (0, _inherits3.default)(AppScript, _React$Component);

	    function AppScript() {
	        (0, _classCallCheck3.default)(this, AppScript);
	        return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(AppScript).apply(this, arguments));
	    }

	    (0, _createClass3.default)(AppScript, [{
	        key: "render",
	        value: function render() {
	            var appScriptPath = "/res/js" + entityRelativePath + ".js";

	            return _react2.default.createElement("script", { src: appScriptPath });
	        }
	    }]);
	    return AppScript;
	})(_react2.default.Component);

	exports.default = AppScript;

/***/ }
/******/ ]);