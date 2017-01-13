"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PointTarget = ReactPoint.PointTarget;

var AutoScalingText = function (_React$Component) {
  _inherits(AutoScalingText, _React$Component);

  function AutoScalingText() {
    var _temp, _this, _ret;

    _classCallCheck(this, AutoScalingText);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      scale: 1
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  AutoScalingText.prototype.componentDidUpdate = function componentDidUpdate() {
    var scale = this.state.scale;

    var node = this.node;
    var parentNode = node.parentNode;

    var availableWidth = parentNode.offsetWidth;
    var actualWidth = node.offsetWidth;
    var actualScale = availableWidth / actualWidth;

    if (scale === actualScale) return;

    if (actualScale < 1) {
      this.setState({ scale: actualScale });
    } else if (scale < 1) {
      this.setState({ scale: 1 });
    }
  };

  AutoScalingText.prototype.render = function render() {
    var _this2 = this;

    var scale = this.state.scale;

    return React.createElement(
      "div",
      {
        className: "auto-scaling-text",
        style: { transform: "scale(" + scale + "," + scale + ")" },
        ref: function ref(node) {
          return _this2.node = node;
        }
      },
      this.props.children
    );
  };

  return AutoScalingText;
}(React.Component);

var CalculatorDisplay = function (_React$Component2) {
  _inherits(CalculatorDisplay, _React$Component2);

  function CalculatorDisplay() {
    _classCallCheck(this, CalculatorDisplay);

    return _possibleConstructorReturn(this, _React$Component2.apply(this, arguments));
  }

  CalculatorDisplay.prototype.render = function render() {
    var _props = this.props;
    var value = _props.value;

    var props = _objectWithoutProperties(_props, ["value"]);

    var language = navigator.language || 'en-US';
    var formattedValue = parseFloat(value).toLocaleString(language, {
      useGrouping: true,
      maximumFractionDigits: 6
    });

    // Add back missing .0 in e.g. 12.0
    var match = value.match(/\.\d*?(0*)$/);

    if (match) formattedValue += /[1-9]/.test(match[0]) ? match[1] : match[0];

    return React.createElement(
      "div",
      _extends({}, props, { className: "calculator-display" }),
      React.createElement(
        AutoScalingText,
        null,
        formattedValue
      )
    );
  };

  return CalculatorDisplay;
}(React.Component);

var CalculatorKey = function (_React$Component3) {
  _inherits(CalculatorKey, _React$Component3);

  function CalculatorKey() {
    _classCallCheck(this, CalculatorKey);

    return _possibleConstructorReturn(this, _React$Component3.apply(this, arguments));
  }

  CalculatorKey.prototype.render = function render() {
    var _props2 = this.props;
    var onPress = _props2.onPress;
    var className = _props2.className;

    var props = _objectWithoutProperties(_props2, ["onPress", "className"]);

    return React.createElement(
      PointTarget,
      { onPoint: onPress },
      React.createElement("button", _extends({ className: "calculator-key " + className }, props))
    );
  };

  return CalculatorKey;
}(React.Component);

var CalculatorOperations = {
  '/': function _(prevValue, nextValue) {
    return prevValue / nextValue;
  },
  '*': function _(prevValue, nextValue) {
    return prevValue * nextValue;
  },
  '+': function _(prevValue, nextValue) {
    return prevValue + nextValue;
  },
  '-': function _(prevValue, nextValue) {
    return prevValue - nextValue;
  },
  '=': function _(prevValue, nextValue) {
    return nextValue;
  }
};

var Calculator = function (_React$Component4) {
  _inherits(Calculator, _React$Component4);

  function Calculator() {
    var _temp2, _this5, _ret2;

    _classCallCheck(this, Calculator);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this5 = _possibleConstructorReturn(this, _React$Component4.call.apply(_React$Component4, [this].concat(args))), _this5), _this5.state = {
      value: null,
      displayValue: '0',
      operator: null,
      waitingForOperand: false
    }, _this5.handleKeyDown = function (event) {
      var key = event.key;

      if (key === 'Enter') key = '=';

      if (/\d/.test(key)) {
        event.preventDefault();
        _this5.inputDigit(parseInt(key, 10));
      } else if (key in CalculatorOperations) {
        event.preventDefault();
        _this5.performOperation(key);
      } else if (key === '.') {
        event.preventDefault();
        _this5.inputDot();
      } else if (key === '%') {
        event.preventDefault();
        _this5.inputPercent();
      } else if (key === 'Backspace') {
        event.preventDefault();
        _this5.clearLastChar();
      } else if (key === 'Clear') {
        event.preventDefault();

        if (_this5.state.displayValue !== '0') {
          _this5.clearDisplay();
        } else {
          _this5.clearAll();
        }
      }
    }, _temp2), _possibleConstructorReturn(_this5, _ret2);
  }

  Calculator.prototype.clearAll = function clearAll() {
    this.setState({
      value: null,
      displayValue: '0',
      operator: null,
      waitingForOperand: false
    });
  };

  Calculator.prototype.clearDisplay = function clearDisplay() {
    this.setState({
      displayValue: '0'
    });
  };

  Calculator.prototype.clearLastChar = function clearLastChar() {
    var displayValue = this.state.displayValue;

    this.setState({
      displayValue: displayValue.substring(0, displayValue.length - 1) || '0'
    });
  };

  Calculator.prototype.toggleSign = function toggleSign() {
    var displayValue = this.state.displayValue;

    var newValue = parseFloat(displayValue) * -1;

    this.setState({
      displayValue: String(newValue)
    });
  };

  Calculator.prototype.inputPercent = function inputPercent() {
    var displayValue = this.state.displayValue;

    var currentValue = parseFloat(displayValue);

    if (currentValue === 0) return;

    var fixedDigits = displayValue.replace(/^-?\d*\.?/, '');
    var newValue = parseFloat(displayValue) / 100;

    this.setState({
      displayValue: String(newValue.toFixed(fixedDigits.length + 2))
    });
  };

  Calculator.prototype.inputDot = function inputDot() {
    var displayValue = this.state.displayValue;

    if (!/\./.test(displayValue)) {
      this.setState({
        displayValue: displayValue + '.',
        waitingForOperand: false
      });
    }
  };

  Calculator.prototype.inputDigit = function inputDigit(digit) {
    var _state = this.state;
    var displayValue = _state.displayValue;
    var waitingForOperand = _state.waitingForOperand;

    if (waitingForOperand) {
      this.setState({
        displayValue: String(digit),
        waitingForOperand: false
      });
    } else {
      this.setState({
        displayValue: displayValue === '0' ? String(digit) : displayValue + digit
      });
    }
  };

  Calculator.prototype.performOperation = function performOperation(nextOperator) {
    var _state2 = this.state;
    var value = _state2.value;
    var displayValue = _state2.displayValue;
    var operator = _state2.operator;

    var inputValue = parseFloat(displayValue);

    if (value == null) {
      this.setState({
        value: inputValue
      });
    } else if (operator) {
      var currentValue = value || 0;
      var newValue = CalculatorOperations[operator](currentValue, inputValue);

      this.setState({
        value: newValue,
        displayValue: String(newValue)
      });
    }

    this.setState({
      waitingForOperand: true,
      operator: nextOperator
    });
  };

  Calculator.prototype.componentDidMount = function componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  };

  Calculator.prototype.componentWillUnmount = function componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  };

  Calculator.prototype.render = function render() {
    var _this6 = this;

    var displayValue = this.state.displayValue;

    var clearDisplay = displayValue !== '0';
    var clearText = clearDisplay ? 'C' : 'AC';

    return React.createElement(
      "div",
      { className: "calculator" },
      React.createElement(CalculatorDisplay, { value: displayValue }),
      React.createElement(
        "div",
        { className: "calculator-keypad" },
        React.createElement(
          "div",
          { className: "input-keys" },
          React.createElement(
            "div",
            { className: "function-keys" },
            React.createElement(
              CalculatorKey,
              { className: "key-clear", onPress: function onPress() {
                  return clearDisplay ? _this6.clearDisplay() : _this6.clearAll();
                } },
              clearText
            ),
            React.createElement(
              CalculatorKey,
              { className: "key-sign", onPress: function onPress() {
                  return _this6.toggleSign();
                } },
              "±"
            ),
            React.createElement(
              CalculatorKey,
              { className: "key-percent", onPress: function onPress() {
                  return _this6.inputPercent();
                } },
              "%"
            )
          ),
          React.createElement(
            "div",
            { className: "digit-keys" },
            React.createElement(
              CalculatorKey,
              { className: "key-0", onPress: function onPress() {
                  return _this6.inputDigit(0);
                } },
              "0"
            ),
            React.createElement(
              CalculatorKey,
              { className: "key-dot", onPress: function onPress() {
                  return _this6.inputDot();
                } },
              "●"
            ),
            React.createElement(
              CalculatorKey,
              { className: "key-1", onPress: function onPress() {
                  return _this6.inputDigit(1);
                } },
              "1"
            ),
            React.createElement(
              CalculatorKey,
              { className: "key-2", onPress: function onPress() {
                  return _this6.inputDigit(2);
                } },
              "2"
            ),
            React.createElement(
              CalculatorKey,
              { className: "key-3", onPress: function onPress() {
                  return _this6.inputDigit(3);
                } },
              "3"
            ),
            React.createElement(
              CalculatorKey,
              { className: "key-4", onPress: function onPress() {
                  return _this6.inputDigit(4);
                } },
              "4"
            ),
            React.createElement(
              CalculatorKey,
              { className: "key-5", onPress: function onPress() {
                  return _this6.inputDigit(5);
                } },
              "5"
            ),
            React.createElement(
              CalculatorKey,
              { className: "key-6", onPress: function onPress() {
                  return _this6.inputDigit(6);
                } },
              "6"
            ),
            React.createElement(
              CalculatorKey,
              { className: "key-7", onPress: function onPress() {
                  return _this6.inputDigit(7);
                } },
              "7"
            ),
            React.createElement(
              CalculatorKey,
              { className: "key-8", onPress: function onPress() {
                  return _this6.inputDigit(8);
                } },
              "8"
            ),
            React.createElement(
              CalculatorKey,
              { className: "key-9", onPress: function onPress() {
                  return _this6.inputDigit(9);
                } },
              "9"
            )
          )
        ),
        React.createElement(
          "div",
          { className: "operator-keys" },
          React.createElement(
            CalculatorKey,
            { className: "key-divide", onPress: function onPress() {
                return _this6.performOperation('/');
              } },
            "÷"
          ),
          React.createElement(
            CalculatorKey,
            { className: "key-multiply", onPress: function onPress() {
                return _this6.performOperation('*');
              } },
            "×"
          ),
          React.createElement(
            CalculatorKey,
            { className: "key-subtract", onPress: function onPress() {
                return _this6.performOperation('-');
              } },
            "−"
          ),
          React.createElement(
            CalculatorKey,
            { className: "key-add", onPress: function onPress() {
                return _this6.performOperation('+');
              } },
            "+"
          ),
          React.createElement(
            CalculatorKey,
            { className: "key-equals", onPress: function onPress() {
                return _this6.performOperation('=');
              } },
            "="
          )
        )
      )
    );
  };

  return Calculator;
}(React.Component);

ReactDOM.render(React.createElement(Calculator, null), document.getElementById('app'));