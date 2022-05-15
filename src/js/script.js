import CalculatorView from './CalculatorView.js';
import CalculatorModel from './CalculatorModel.js';
import Calculator from './Calculator.js';

const calc = document.querySelector('.calc');

const view = new CalculatorView(calc);
const model = new CalculatorModel();
const controller = new Calculator(model, view);
