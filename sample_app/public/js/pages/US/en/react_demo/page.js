if (typeof document !== "undefined") {    $(function () {        if ((typeof window.PageBundle !== "undefined") && (typeof window.PageBundle.default === "function")) {            var appMainPage = new window.PageBundle.default(window.modelData);            appMainPage.attachComponentsInBrowser();        }    });}
var PageBundle =
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

	var _extends2 = __webpack_require__(1);

	var _extends3 = _interopRequireDefault(_extends2);

	var _getPrototypeOf = __webpack_require__(17);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(21);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(22);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(25);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(60);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(67);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(68);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _parent = __webpack_require__(69);

	var _parent2 = _interopRequireDefault(_parent);

	var _HelloButton = __webpack_require__(80);

	var _HelloButton2 = _interopRequireDefault(_HelloButton);

	var _Greeting = __webpack_require__(81);

	var _Greeting2 = _interopRequireDefault(_Greeting);

	var _my_graph = __webpack_require__(82);

	var _my_graph2 = _interopRequireDefault(_my_graph);

	var _my_graph_refresher = __webpack_require__(84);

	var _my_graph_refresher2 = _interopRequireDefault(_my_graph_refresher);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * An example of an element to override the body top element in the parent template.
	 */

	var PageBodyTop = function (_React$Component) {
	    (0, _inherits3.default)(PageBodyTop, _React$Component);

	    function PageBodyTop(props) {
	        (0, _classCallCheck3.default)(this, PageBodyTop);

	        var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(PageBodyTop).call(this, props));

	        _this.state = {};
	        return _this;
	    }

	    (0, _createClass3.default)(PageBodyTop, [{
	        key: "render",
	        value: function render() {
	            return _react2.default.createElement(
	                "p",
	                null,
	                "hello page body top!!, testing 123"
	            );
	        }
	    }]);
	    return PageBodyTop;
	}(_react2.default.Component);

	/**
	 * An example of an element to override the body main element in the parent template.
	 */


	var PageBodyMain = function (_React$Component2) {
	    (0, _inherits3.default)(PageBodyMain, _React$Component2);

	    function PageBodyMain(props) {
	        (0, _classCallCheck3.default)(this, PageBodyMain);

	        var _this2 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(PageBodyMain).call(this, props));

	        _this2.state = {};
	        return _this2;
	    }

	    (0, _createClass3.default)(PageBodyMain, [{
	        key: "componentWillMount",
	        value: function componentWillMount() {}
	    }, {
	        key: "setNewGraphData",
	        value: function setNewGraphData(newGraphData) {
	            this.__newGraphRef.plotNewGraphData(newGraphData);
	        }
	    }, {
	        key: "render",
	        value: function render() {
	            var _this3 = this;

	            return _react2.default.createElement(_my_graph2.default, (0, _extends3.default)({}, this.props, { ref: function ref(newGraphRef) {
	                    _this3.__newGraphRef = newGraphRef;
	                } }));
	        }
	    }]);
	    return PageBodyMain;
	}(_react2.default.Component);

	/**
	 * An example of an element to override the body bottom element in the parent template.
	 */


	var PageBodyBottom = function (_React$Component3) {
	    (0, _inherits3.default)(PageBodyBottom, _React$Component3);

	    function PageBodyBottom(props) {
	        (0, _classCallCheck3.default)(this, PageBodyBottom);

	        var _this4 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(PageBodyBottom).call(this, props));

	        _this4.state = {};
	        return _this4;
	    }

	    (0, _createClass3.default)(PageBodyBottom, [{
	        key: "componentWillMount",
	        value: function componentWillMount() {}
	    }, {
	        key: "render",
	        value: function render() {
	            return _react2.default.createElement(_my_graph_refresher2.default, this.props);
	        }
	    }]);
	    return PageBodyBottom;
	}(_react2.default.Component);

	/**
	 * An example of how to extend the parent template, and replace the elements that the
	 * parent template allows for overriding.
	 */


	var AppMainPage = function (_ParentTemplate) {
	    (0, _inherits3.default)(AppMainPage, _ParentTemplate);

	    function AppMainPage(props) {
	        (0, _classCallCheck3.default)(this, AppMainPage);

	        //this.state = {balance: props.openingBalance};

	        var _this5 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(AppMainPage).call(this, props));

	        _this5.bodyTop = _react2.default.createElement(PageBodyTop, null);
	        _this5.bodyMain = _react2.default.createElement(PageBodyMain, { id: "t24", ref: function ref(bdyMnRef) {
	                _this5.__bodyMainRef = bdyMnRef;
	            } });
	        _this5.bodyBottom = _react2.default.createElement(PageBodyBottom, { id: "q122", onClick: function onClick() {
	                _this5.__bodyMainRef.setNewGraphData({ age: Math.random() });
	            } });
	        return _this5;
	    }

	    (0, _createClass3.default)(AppMainPage, [{
	        key: "handleClick",
	        value: function handleClick() {
	            this.__bodyMainRef.setState({ age: Math.random() });
	        }

	        /**
	         * You should never override the render method of the parent template!
	         */

	    }]);
	    return AppMainPage;
	}(_parent2.default);

	exports.default = AppMainPage;
	;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _assign = __webpack_require__(2);

	var _assign2 = _interopRequireDefault(_assign);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _assign2.default || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];

	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }

	  return target;
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(3), __esModule: true };

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(4);
	module.exports = __webpack_require__(7).Object.assign;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(5);

	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(10)});

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(6)
	  , core      = __webpack_require__(7)
	  , ctx       = __webpack_require__(8)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && key in target;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(param){
	        return this instanceof C ? new C(param) : C(param);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    if(IS_PROTO)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
	  }
	};
	// type bitmap
	$export.F = 1;  // forced
	$export.G = 2;  // global
	$export.S = 4;  // static
	$export.P = 8;  // proto
	$export.B = 16; // bind
	$export.W = 32; // wrap
	module.exports = $export;

/***/ },
/* 6 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 7 */
/***/ function(module, exports) {

	var core = module.exports = {version: '1.2.6'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(9);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.1 Object.assign(target, source, ...)
	var $        = __webpack_require__(11)
	  , toObject = __webpack_require__(12)
	  , IObject  = __webpack_require__(14);

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = __webpack_require__(16)(function(){
	  var a = Object.assign
	    , A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , $$    = arguments
	    , $$len = $$.length
	    , index = 1
	    , getKeys    = $.getKeys
	    , getSymbols = $.getSymbols
	    , isEnum     = $.isEnum;
	  while($$len > index){
	    var S      = IObject($$[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  }
	  return T;
	} : Object.assign;

/***/ },
/* 11 */
/***/ function(module, exports) {

	var $Object = Object;
	module.exports = {
	  create:     $Object.create,
	  getProto:   $Object.getPrototypeOf,
	  isEnum:     {}.propertyIsEnumerable,
	  getDesc:    $Object.getOwnPropertyDescriptor,
	  setDesc:    $Object.defineProperty,
	  setDescs:   $Object.defineProperties,
	  getKeys:    $Object.keys,
	  getNames:   $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each:       [].forEach
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(13);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(15);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 15 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(18), __esModule: true };

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(19);
	module.exports = __webpack_require__(7).Object.getPrototypeOf;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject = __webpack_require__(12);

	__webpack_require__(20)('getPrototypeOf', function($getPrototypeOf){
	  return function getPrototypeOf(it){
	    return $getPrototypeOf(toObject(it));
	  };
	});

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(5)
	  , core    = __webpack_require__(7)
	  , fails   = __webpack_require__(16);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 21 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(23);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(24), __esModule: true };

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(11);
	module.exports = function defineProperty(it, key, desc){
	  return $.setDesc(it, key, desc);
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _typeof2 = __webpack_require__(26);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _iterator = __webpack_require__(27);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _symbol = __webpack_require__(50);

	var _symbol2 = _interopRequireDefault(_symbol);

	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(28), __esModule: true };

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(29);
	__webpack_require__(45);
	module.exports = __webpack_require__(42)('iterator');

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(30)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(32)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(31)
	  , defined   = __webpack_require__(13);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 31 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(33)
	  , $export        = __webpack_require__(5)
	  , redefine       = __webpack_require__(34)
	  , hide           = __webpack_require__(35)
	  , has            = __webpack_require__(38)
	  , Iterators      = __webpack_require__(39)
	  , $iterCreate    = __webpack_require__(40)
	  , setToStringTag = __webpack_require__(41)
	  , getProto       = __webpack_require__(11).getProto
	  , ITERATOR       = __webpack_require__(42)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';

	var returnThis = function(){ return this; };

	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , methods, key;
	  // Fix native
	  if($native){
	    var IteratorPrototype = getProto($default.call(new Base));
	    // Set @@toStringTag to native iterators
	    setToStringTag(IteratorPrototype, TAG, true);
	    // FF fix
	    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    // fix Array#{values, @@iterator}.name in V8 / FF
	    if(DEF_VALUES && $native.name !== VALUES){
	      VALUES_BUG = true;
	      $default = function values(){ return $native.call(this); };
	    }
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES  ? $default : getMethod(VALUES),
	      keys:    IS_SET      ? $default : getMethod(KEYS),
	      entries: !DEF_VALUES ? $default : getMethod('entries')
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 33 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(35);

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var $          = __webpack_require__(11)
	  , createDesc = __webpack_require__(36);
	module.exports = __webpack_require__(37) ? function(object, key, value){
	  return $.setDesc(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 36 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(16)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 38 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 39 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $              = __webpack_require__(11)
	  , descriptor     = __webpack_require__(36)
	  , setToStringTag = __webpack_require__(41)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(35)(IteratorPrototype, __webpack_require__(42)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(11).setDesc
	  , has = __webpack_require__(38)
	  , TAG = __webpack_require__(42)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var store  = __webpack_require__(43)('wks')
	  , uid    = __webpack_require__(44)
	  , Symbol = __webpack_require__(6).Symbol;
	module.exports = function(name){
	  return store[name] || (store[name] =
	    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(6)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 44 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(46);
	var Iterators = __webpack_require__(39);
	Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(47)
	  , step             = __webpack_require__(48)
	  , Iterators        = __webpack_require__(39)
	  , toIObject        = __webpack_require__(49);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(32)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 47 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 48 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(14)
	  , defined = __webpack_require__(13);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(51), __esModule: true };

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(52);
	__webpack_require__(59);
	module.exports = __webpack_require__(7).Symbol;

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var $              = __webpack_require__(11)
	  , global         = __webpack_require__(6)
	  , has            = __webpack_require__(38)
	  , DESCRIPTORS    = __webpack_require__(37)
	  , $export        = __webpack_require__(5)
	  , redefine       = __webpack_require__(34)
	  , $fails         = __webpack_require__(16)
	  , shared         = __webpack_require__(43)
	  , setToStringTag = __webpack_require__(41)
	  , uid            = __webpack_require__(44)
	  , wks            = __webpack_require__(42)
	  , keyOf          = __webpack_require__(53)
	  , $names         = __webpack_require__(54)
	  , enumKeys       = __webpack_require__(55)
	  , isArray        = __webpack_require__(56)
	  , anObject       = __webpack_require__(57)
	  , toIObject      = __webpack_require__(49)
	  , createDesc     = __webpack_require__(36)
	  , getDesc        = $.getDesc
	  , setDesc        = $.setDesc
	  , _create        = $.create
	  , getNames       = $names.get
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , setter         = false
	  , HIDDEN         = wks('_hidden')
	  , isEnum         = $.isEnum
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , useNative      = typeof $Symbol == 'function'
	  , ObjectProto    = Object.prototype;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(setDesc({}, 'a', {
	    get: function(){ return setDesc(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = getDesc(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  setDesc(it, key, D);
	  if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
	} : setDesc;

	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol.prototype);
	  sym._k = tag;
	  DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
	    configurable: true,
	    set: function(value){
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    }
	  });
	  return sym;
	};

	var isSymbol = function(it){
	  return typeof it == 'symbol';
	};

	var $defineProperty = function defineProperty(it, key, D){
	  if(D && has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))setDesc(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return setDesc(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key);
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
	    ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  var D = getDesc(it = toIObject(it), key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = getNames(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
	  return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var names  = getNames(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
	  return result;
	};
	var $stringify = function stringify(it){
	  if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	  var args = [it]
	    , i    = 1
	    , $$   = arguments
	    , replacer, $replacer;
	  while($$.length > i)args.push($$[i++]);
	  replacer = args[1];
	  if(typeof replacer == 'function')$replacer = replacer;
	  if($replacer || !isArray(replacer))replacer = function(key, value){
	    if($replacer)value = $replacer.call(this, key, value);
	    if(!isSymbol(value))return value;
	  };
	  args[1] = replacer;
	  return _stringify.apply($JSON, args);
	};
	var buggyJSON = $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	});

	// 19.4.1.1 Symbol([description])
	if(!useNative){
	  $Symbol = function Symbol(){
	    if(isSymbol(this))throw TypeError('Symbol is not a constructor');
	    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
	  };
	  redefine($Symbol.prototype, 'toString', function toString(){
	    return this._k;
	  });

	  isSymbol = function(it){
	    return it instanceof $Symbol;
	  };

	  $.create     = $create;
	  $.isEnum     = $propertyIsEnumerable;
	  $.getDesc    = $getOwnPropertyDescriptor;
	  $.setDesc    = $defineProperty;
	  $.setDescs   = $defineProperties;
	  $.getNames   = $names.get = $getOwnPropertyNames;
	  $.getSymbols = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__webpack_require__(33)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }
	}

	var symbolStatics = {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    return keyOf(SymbolRegistry, key);
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	};
	// 19.4.2.2 Symbol.hasInstance
	// 19.4.2.3 Symbol.isConcatSpreadable
	// 19.4.2.4 Symbol.iterator
	// 19.4.2.6 Symbol.match
	// 19.4.2.8 Symbol.replace
	// 19.4.2.9 Symbol.search
	// 19.4.2.10 Symbol.species
	// 19.4.2.11 Symbol.split
	// 19.4.2.12 Symbol.toPrimitive
	// 19.4.2.13 Symbol.toStringTag
	// 19.4.2.14 Symbol.unscopables
	$.each.call((
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
	  'species,split,toPrimitive,toStringTag,unscopables'
	).split(','), function(it){
	  var sym = wks(it);
	  symbolStatics[it] = useNative ? sym : wrap(sym);
	});

	setter = true;

	$export($export.G + $export.W, {Symbol: $Symbol});

	$export($export.S, 'Symbol', symbolStatics);

	$export($export.S + $export.F * !useNative, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!useNative || buggyJSON), 'JSON', {stringify: $stringify});

	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var $         = __webpack_require__(11)
	  , toIObject = __webpack_require__(49);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = $.getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(49)
	  , getNames  = __webpack_require__(11).getNames
	  , toString  = {}.toString;

	var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function(it){
	  try {
	    return getNames(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};

	module.exports.get = function getOwnPropertyNames(it){
	  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
	  return getNames(toIObject(it));
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var $ = __webpack_require__(11);
	module.exports = function(it){
	  var keys       = $.getKeys(it)
	    , getSymbols = $.getSymbols;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = $.isEnum
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))keys.push(key);
	  }
	  return keys;
	};

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(15);
	module.exports = Array.isArray || function(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(58);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 58 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 59 */
/***/ function(module, exports) {

	

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _setPrototypeOf = __webpack_require__(61);

	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

	var _create = __webpack_require__(65);

	var _create2 = _interopRequireDefault(_create);

	var _typeof2 = __webpack_require__(26);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
	  }

	  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
	};

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(62), __esModule: true };

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(63);
	module.exports = __webpack_require__(7).Object.setPrototypeOf;

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(5);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(64).set});

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var getDesc  = __webpack_require__(11).getDesc
	  , isObject = __webpack_require__(58)
	  , anObject = __webpack_require__(57);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(8)(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(66), __esModule: true };

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(11);
	module.exports = function create(P, D){
	  return $.create(P, D);
	};

/***/ },
/* 67 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 68 */
/***/ function(module, exports) {

	module.exports = ReactDOM;

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _getPrototypeOf = __webpack_require__(17);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(21);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(22);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(25);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(60);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(67);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(68);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _TemplateHead = __webpack_require__(70);

	var _TemplateHead2 = _interopRequireDefault(_TemplateHead);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//import {AppMainPage} from "AppMainPage";

	/**
	 *
	 */

	var AppMount = function (_React$Component) {
	    (0, _inherits3.default)(AppMount, _React$Component);

	    function AppMount(props) {
	        (0, _classCallCheck3.default)(this, AppMount);

	        var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(AppMount).call(this, props));

	        _this.state = {};
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
	}(_react2.default.Component);

	/**
	 *
	 */


	var ParentTemplate = function (_React$Component2) {
	    (0, _inherits3.default)(ParentTemplate, _React$Component2);

	    /**
	     *
	     * @param props
	     */

	    function ParentTemplate(props) {
	        (0, _classCallCheck3.default)(this, ParentTemplate);

	        //this.state = {balance: props.openingBalance};

	        var _this2 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ParentTemplate).call(this, props));

	        _this2.state = {};

	        /**
	         * The following eelements are replaceable by pages which extend this template:
	         */
	        _this2.bodyTop = _react2.default.createElement(AppMount, null);
	        _this2.bodyMain = _react2.default.createElement(AppMount, null);
	        _this2.bodyBottom = _react2.default.createElement(AppMount, null);
	        return _this2;
	    }

	    /**
	     * This method will replace/re-mount the page-specific elements in the browser:
	     */


	    (0, _createClass3.default)(ParentTemplate, [{
	        key: "attachComponentsInBrowser",
	        value: function attachComponentsInBrowser() {
	            $("#body_top_mount_point").replaceWith("<div id='body_top_mount_point'></div>");
	            _reactDom2.default.render(this.bodyTop, document.getElementById("body_top_mount_point"));

	            $("#body_main_mount_point").replaceWith("<div id='body_main_mount_point'></div>");
	            _reactDom2.default.render(this.bodyMain, document.getElementById("body_main_mount_point"));

	            $("#body_bottom_mount_point").replaceWith("<div id='body_bottom_mount_point'></div>");
	            _reactDom2.default.render(this.bodyBottom, document.getElementById("body_bottom_mount_point"));
	        }

	        /**
	         * This method is for server-side rendering only!
	         * @returns {XML}
	         */

	    }, {
	        key: "render",
	        value: function render() {

	            return _react2.default.createElement(
	                "html",
	                null,
	                _react2.default.createElement(_TemplateHead2.default, { entityRelativePath: modelData.pageViewID, modelData: modelData }),
	                _react2.default.createElement(
	                    "body",
	                    { id: "document-body" },
	                    _react2.default.createElement(
	                        "div",
	                        { id: "body_top_mount_point" },
	                        this.bodyTop
	                    ),
	                    _react2.default.createElement(
	                        "div",
	                        { id: "body_main_mount_point" },
	                        this.bodyMain
	                    ),
	                    _react2.default.createElement(
	                        "div",
	                        { id: "body_bottom_mount_point" },
	                        this.bodyBottom
	                    )
	                )
	            );
	        }
	    }]);
	    return ParentTemplate;
	}(_react2.default.Component);

	exports.default = ParentTemplate;

	ParentTemplate.propTypes = { modelData: _react2.default.PropTypes.object };
	ParentTemplate.defaultProps = {};

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _getPrototypeOf = __webpack_require__(17);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(21);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(22);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(25);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(60);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(67);

	var _react2 = _interopRequireDefault(_react);

	var _HeadReactScript = __webpack_require__(71);

	var _HeadReactScript2 = _interopRequireDefault(_HeadReactScript);

	var _HeadReactDOMScript = __webpack_require__(72);

	var _HeadReactDOMScript2 = _interopRequireDefault(_HeadReactDOMScript);

	var _ModelData = __webpack_require__(73);

	var _ModelData2 = _interopRequireDefault(_ModelData);

	var _Title = __webpack_require__(76);

	var _Title2 = _interopRequireDefault(_Title);

	var _MetaCharSet = __webpack_require__(77);

	var _MetaCharSet2 = _interopRequireDefault(_MetaCharSet);

	var _HeadJQueryScript = __webpack_require__(78);

	var _HeadJQueryScript2 = _interopRequireDefault(_HeadJQueryScript);

	var _AppScript = __webpack_require__(79);

	var _AppScript2 = _interopRequireDefault(_AppScript);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var HeadScripts = function (_React$Component) {
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
	                _react2.default.createElement(_ModelData2.default, { modelData: this.props.modelData }),
	                _react2.default.createElement(_AppScript2.default, { entityRelativePath: modelData.pageViewID })
	            );
	        }
	    }]);
	    return HeadScripts;
	}(_react2.default.Component);

	exports.default = HeadScripts;

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _getPrototypeOf = __webpack_require__(17);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(21);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(22);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(25);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(60);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(67);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var HeadReactScript = function (_React$Component) {
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
	}(_react2.default.Component);

	exports.default = HeadReactScript;

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _getPrototypeOf = __webpack_require__(17);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(21);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(22);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(25);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(60);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(67);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var HeadReactDOMScript = function (_React$Component) {
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
	}(_react2.default.Component);

	exports.default = HeadReactDOMScript;

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _stringify = __webpack_require__(74);

	var _stringify2 = _interopRequireDefault(_stringify);

	var _getPrototypeOf = __webpack_require__(17);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(21);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(22);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(25);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(60);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(67);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ModelData = function (_React$Component) {
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
	}(_react2.default.Component);

	exports.default = ModelData;

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(75), __esModule: true };

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	var core = __webpack_require__(7);
	module.exports = function stringify(it){ // eslint-disable-line no-unused-vars
	  return (core.JSON && core.JSON.stringify || JSON.stringify).apply(JSON, arguments);
	};

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(17);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(21);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(22);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(25);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(60);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(67);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Title = function (_React$Component) {
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
	}(_react2.default.Component);

	exports.default = Title;

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(17);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(21);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(22);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(25);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(60);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(67);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var MetaCharSet = function (_React$Component) {
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
	}(_react2.default.Component);

	exports.default = MetaCharSet;

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _getPrototypeOf = __webpack_require__(17);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(21);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(22);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(25);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(60);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(67);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var HeadJQueryScript = function (_React$Component) {
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
	}(_react2.default.Component);

	exports.default = HeadJQueryScript;

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _getPrototypeOf = __webpack_require__(17);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(21);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(22);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(25);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(60);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(67);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var AppScript = function (_React$Component) {
	    (0, _inherits3.default)(AppScript, _React$Component);

	    function AppScript() {
	        (0, _classCallCheck3.default)(this, AppScript);
	        return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(AppScript).apply(this, arguments));
	    }

	    (0, _createClass3.default)(AppScript, [{
	        key: "render",
	        value: function render() {
	            var appScriptPath = "/res/js" + modelData.pageViewID + ".js";

	            return _react2.default.createElement("script", { src: appScriptPath });
	        }
	    }]);
	    return AppScript;
	}(_react2.default.Component);

	exports.default = AppScript;

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _getPrototypeOf = __webpack_require__(17);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(21);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(22);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(25);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(60);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(67);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var HelloButton = function (_React$Component) {
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
	}(_react2.default.Component);

	exports.default = HelloButton;

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(17);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(21);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(22);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(25);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(60);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(67);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Greeting = function (_React$Component) {
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
	}(_react2.default.Component);

	exports.default = Greeting;

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Ali on 1/3/2016.
	 */
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _getPrototypeOf = __webpack_require__(17);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(21);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(22);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(25);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(60);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(67);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(68);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _graph_impl = __webpack_require__(83);

	var MyCanvas = _interopRequireWildcard(_graph_impl);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * An example of an element to override the body top element in the parent template.
	 */

	var MyGraph = function (_React$Component) {
	    (0, _inherits3.default)(MyGraph, _React$Component);

	    function MyGraph(props) {
	        (0, _classCallCheck3.default)(this, MyGraph);

	        var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(MyGraph).call(this, props));

	        _this.state = {};

	        _this.__canvas = _react2.default.createElement("canvas", { id: "canvas", width: "1210", height: "610", ref: function ref(canvsNode) {
	                _this.__canvasRef = canvsNode;
	            } });
	        return _this;
	    }

	    (0, _createClass3.default)(MyGraph, [{
	        key: "plotNewGraphData",
	        value: function plotNewGraphData(newGraphData) {
	            this.redrawCanvas(newGraphData);
	        }
	    }, {
	        key: "componentDidMount",
	        value: function componentDidMount() {
	            this.redrawCanvas();
	        }
	    }, {
	        key: "redrawCanvas",
	        value: function redrawCanvas(newGraphData) {
	            function getRandomInc() {
	                return Math.floor(Math.random() * 30 - 15);
	            }

	            var ctx = this.__canvasRef.getContext("2d");
	            var oldCtxStrokeStyle = ctx.strokeStyle;
	            var oldCtxFillStyle = ctx.fillStyle;
	            var oldCtxFont = ctx.font;

	            ctx.fillStyle = "#EBF4FA";
	            ctx.fillRect(10, 10, 1190, 590);

	            ctx.strokeStyle = "black";
	            ctx.strokeRect(10, 10, 1190, 590);

	            ctx.fillStyle = "black";
	            ctx.font = "32px serif";
	            ctx.strokeText("Hello world", 500, 40);
	            ctx.font = "16px serif";
	            ctx.fillText("Goodness proliferation index", 480, 60);

	            var yyyy = 295;
	            ctx.strokeStyle = "rgba(200, 0, 0, 0.95)";
	            ctx.beginPath();
	            ctx.moveTo(20, yyyy);

	            for (var xxxx = 30; xxxx < 1180; xxxx += 10) {
	                ctx.lineTo(xxxx, yyyy);
	                yyyy -= getRandomInc();
	                if (yyyy < 70) {
	                    yyyy = 70;
	                } else if (yyyy > 590) {
	                    yyyy = 590;
	                }
	            }
	            ctx.stroke();

	            ctx.fillStyle = oldCtxFillStyle;
	            ctx.strokeStyle = oldCtxStrokeStyle;
	            ctx.font = oldCtxFont;
	        }
	    }, {
	        key: "render",
	        value: function render() {
	            return _react2.default.createElement(
	                "div",
	                null,
	                _react2.default.createElement(
	                    "p",
	                    null,
	                    "canvas title: demo graph"
	                ),
	                this.__canvas,
	                _react2.default.createElement(
	                    "p",
	                    null,
	                    "canvas caption: TBD"
	                )
	            );
	        }
	    }]);
	    return MyGraph;
	}(_react2.default.Component);

	MyGraph.propTypes = { modelData: _react2.default.PropTypes.object };
	MyGraph.defaultProps = {};

	exports.default = MyGraph;

/***/ },
/* 83 */
/***/ function(module, exports) {

	/**
	 * Created by Ali on 1/3/2016.
	 */
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	function __plot_utils() {
	  return "did plot util ops.";
	}

	exports.plotUtils = __plot_utils;

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Ali on 1/3/2016.
	 */
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _extends2 = __webpack_require__(1);

	var _extends3 = _interopRequireDefault(_extends2);

	var _getPrototypeOf = __webpack_require__(17);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(21);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(22);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(25);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(60);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(67);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(68);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _graph_impl = __webpack_require__(83);

	var MyCanvas = _interopRequireWildcard(_graph_impl);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * An example of an element to override the body top element in the parent template.
	 */

	var MyGraphRefresher = function (_React$Component) {
	    (0, _inherits3.default)(MyGraphRefresher, _React$Component);

	    function MyGraphRefresher(props) {
	        (0, _classCallCheck3.default)(this, MyGraphRefresher);

	        var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(MyGraphRefresher).call(this, props));

	        _this.state = {};
	        return _this;
	    }

	    (0, _createClass3.default)(MyGraphRefresher, [{
	        key: "componentDidMount",
	        value: function componentDidMount() {}
	    }, {
	        key: "render",
	        value: function render() {
	            return _react2.default.createElement(
	                "button",
	                (0, _extends3.default)({ type: "button" }, this.props),
	                "Refresh Index"
	            );
	        }
	    }]);
	    return MyGraphRefresher;
	}(_react2.default.Component);

	MyGraphRefresher.propTypes = { modelData: _react2.default.PropTypes.object };
	MyGraphRefresher.defaultProps = {};

	exports.default = MyGraphRefresher;

/***/ }
/******/ ]);