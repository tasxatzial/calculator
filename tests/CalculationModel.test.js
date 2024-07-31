import { describe, it, expect, beforeEach } from 'vitest';
import CalculationModel from "../src/js/CalculationModel.js";

describe('Allowed characters as first input', {}, () => {
  let model;
  beforeEach(() => {
    model = new CalculationModel();
  })

  it('should allow any digit', {}, () => {
    for (let i = 0; i < 10; i++) {
      model.selectDigit(i.toString());
      expect(model.expression).toBe(i.toString());
      model = new CalculationModel();
    }
  })

  it('should allow [ ( ]', {}, () => {
    model.selectLeftParen();
    expect(model.expression).toBe('(');
  })

  it('should not allow [ ) ]', {}, () => {
    model.selectRightParen();
    expect(model.expression).toBe('');
  })

  it('should allow [ - ]', {}, () => {
    model.selectOperation('-');
    expect(model.expression).toBe('~');
  })

  it('should not allow [ + ]', {}, () => {
    model.selectOperation('+');
    expect(model.expression).toBe('');
  })

  it('should not allow [ * ]', {}, () => {
    model.selectOperation('*');
    expect(model.expression).toBe('');
  })

  it('should not allow [ / ]', {}, () => {
    model.selectOperation('/');
    expect(model.expression).toBe('');
  })

  it('should not allow [ . ]', {}, () => {
    model.selectDot();
    expect(model.expression).toBe('');
  })

  it('should not change expression when delete last input is selected', {}, () => {
    model.delete();
    expect(model.expression).toBe('');
  })
})

describe('Input [ . ] in the middle of expression', {}, () => {
  let model;
  beforeEach(() => {
    model = new CalculationModel();
  })

  it('should allow [ . ] if current number does not have [ . ]', {}, () => {
    model.selectDigit('1');
    model.selectDot();
    expect(model.expression).toBe('1.');
  })

  it('should allow [ . ] if current number does not have [ . ] and there is a previous number that has [.]', {}, () => {
    model.selectDigit('1');
    model.selectDot();
    model.selectDigit('2');
    model.selectOperation('+');
    model.selectDigit('3');
    model.selectDot();
    expect(model.expression).toBe('1.2+3.');
  })

  it('should not allow [ . ] if current number has [ . ]', {}, () => {
    model.selectDigit('1');
    model.selectDot();
    model.selectDigit('2');
    model.selectDot();
    expect(model.expression).toBe('1.2');
  })

  it('should not allow [ . ] after [ ( ]', {}, () => {
    model.selectLeftParen();
    model.selectDot();
    expect(model.expression).toBe('(');
  })

  it('should not allow [ . ] after [ ) ]', {}, () => {
    model.selectLeftParen();
    model.selectDigit('1');
    model.selectRightParen();
    model.selectDot();
    expect(model.expression).toBe('(1)');
  })

  it('should not allow [ . ] after [ + ]', {}, () => {
    model.selectDigit('1');
    model.selectOperation('+');
    model.selectDot();
    expect(model.expression).toBe('1+');
  })

  it('should not allow [ . ] after [ - ]', {}, () => {
    model.selectDigit('1');
    model.selectOperation('-');
    model.selectDot();
    expect(model.expression).toBe('1-');
  })

  it('should not allow [ . ] after [ - ] (negation)', {}, () => {
    model.selectOperation('-');
    model.selectDot();
    expect(model.expression).toBe('~');
  })

  it('should not allow [ . ] after [ * ]', {}, () => {
    model.selectDigit('1');
    model.selectOperation('*');
    model.selectDot();
    expect(model.expression).toBe('1*');
  })

  it('should not allow [ . ] after [ / ]', {}, () => {
    model.selectDigit('1');
    model.selectOperation('/');
    model.selectDot();
    expect(model.expression).toBe('1/');
  })
})

describe('Input a digit in the middle of expression', {}, () => {
  let model;
  beforeEach(() => {
    model = new CalculationModel();
  })

  it('should allow any digit after any digit if a number does not start with [ 0 ]', {}, () => {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        model.selectDigit(1);
        model.selectDigit(i.toString());
        model.selectDigit(j.toString());
        expect(model.expression).toBe('1' + i.toString() + j.toString());
        model = new CalculationModel();
      }
    }
  })

  it('should not allow any digit as the second digit if number starts with [ 0 ]', {}, () => {
    for (let i = 0; i < 10; i++) {
      model.selectDigit('0');
      model.selectDigit(i.toString());
      expect(model.expression).toBe('0');
      model = new CalculationModel();
    }
  })

  it('should allow any digit after [ + ]', {}, () => {
    for (let j = 0; j < 10; j++) {
      model.selectDigit('1');
      model.selectOperation('+');
      model.selectDigit(j.toString());
      expect(model.expression).toBe('1+' + j.toString());
      model = new CalculationModel();
    }
  })

  it('should allow any digit after [ - ]', {}, () => {
    for (let j = 0; j < 10; j++) {
      model.selectDigit('1');
      model.selectOperation('-');
      model.selectDigit(j.toString());
      expect(model.expression).toBe('1-' + j.toString());
      model = new CalculationModel();
    }
  })

  it('should allow any digit after [ - ] (negation)', {}, () => {
    for (let j = 0; j < 10; j++) {
      model.selectOperation('-');
      model.selectDigit(j.toString());
      expect(model.expression).toBe('~' + j.toString());
      model = new CalculationModel();
    }
  })

  it('should allow any digit after [ * ]', {}, () => {
    for (let j = 0; j < 10; j++) {
      model.selectDigit('1');
      model.selectOperation('*');
      model.selectDigit(j.toString());
      expect(model.expression).toBe('1*' + j.toString());
      model = new CalculationModel();
    }
  })

  it('should allow any digit after [ / ]', {}, () => {
    for (let j = 0; j < 10; j++) {
      model.selectDigit('1');
      model.selectOperation('/');
      model.selectDigit(j.toString());
      expect(model.expression).toBe('1/' + j.toString());
      model = new CalculationModel();
    }
  })

  it('should allow any digit after [ . ]', {}, () => {
    for (let j = 0; j < 10; j++) {
      model.selectDigit('1');
      model.selectDot();
      model.selectDigit(j.toString());
      expect(model.expression).toBe('1.' + j.toString());
      model = new CalculationModel();
    }
  })

  it('should allow any digit after [ ( ]', {}, () => {
    for (let j = 0; j < 10; j++) {
      model.selectLeftParen();
      model.selectDigit(j.toString());
      expect(model.expression).toBe('(' + j.toString());
      model = new CalculationModel();
    }
  })

  it('should not allow any digit after [ ) ]', {}, () => {
    for (let j = 0; j < 10; j++) {
      model.selectLeftParen();
      model.selectDigit('1');
      model.selectRightParen();
      model.selectDigit(j.toString());
      expect(model.expression).toBe('(1)');
      model = new CalculationModel();
    }
  })
})

describe('Input [ + - * / ] in the middle of expression', {}, () => {
  let model;
  beforeEach(() => {
    model = new CalculationModel();
  })

  it('should allow [ + ] after any digit', {}, () => {
    for (let j = 0; j < 10; j++) {
      model.selectDigit(j.toString());
      model.selectOperation('+');
      expect(model.expression).toBe(j.toString() + '+');
      model = new CalculationModel();
    }
  })

  it('should allow [ - ] after any digit', {}, () => {
    for (let j = 0; j < 10; j++) {
      model.selectDigit(j.toString());
      model.selectOperation('-');
      expect(model.expression).toBe(j.toString() + '-');
      model = new CalculationModel();
    }
  })

  it('should allow [ * ] after any digit', {}, () => {
    for (let j = 0; j < 10; j++) {
      model.selectDigit(j.toString());
      model.selectOperation('*');
      expect(model.expression).toBe(j.toString() + '*');
      model = new CalculationModel();
    }
  })

  it('should allow [ / ] after any digit', {}, () => {
    for (let j = 0; j < 10; j++) {
      model.selectDigit(j.toString());
      model.selectOperation('/');
      expect(model.expression).toBe(j.toString() + '/');
      model = new CalculationModel();
    }
  })

  it('should allow [ + ] after [ . ]', {}, () => {
    model.selectDigit('1');
    model.selectDot();
    model.selectOperation('+');
    expect(model.expression).toBe('1.+');
  })

  it('should allow [ - ] after [ . ]', {}, () => {
    model.selectDigit('1');
    model.selectDot();
    model.selectOperation('-');
    expect(model.expression).toBe('1.-');
  })

  it('should allow [ * ] after [ . ]', {}, () => {
    model.selectDigit('1');
    model.selectDot();
    model.selectOperation('*');
    expect(model.expression).toBe('1.*');
  })

  it('should allow [ / ] after [ . ]', {}, () => {
    model.selectDigit('1');
    model.selectDot();
    model.selectOperation('/');
    expect(model.expression).toBe('1./');
  })

  it('should not allow [ + ] after [ ( ]', {}, () => {
    model.selectLeftParen();
    model.selectOperation('+');
    expect(model.expression).toBe('(');
  })

  it('should not allow [ * ] after [ ( ]', {}, () => {
    model.selectLeftParen();
    model.selectOperation('*');
    expect(model.expression).toBe('(');
  })

  it('should not allow [ / ] after [ ( ]', {}, () => {
    model.selectLeftParen();
    model.selectOperation('/');
    expect(model.expression).toBe('(');
  })

  it('should allow [ - ] after [ ( ]', {}, () => {
    model.selectLeftParen();
    model.selectOperation('-');
    expect(model.expression).toBe('(~');
  })

  it('should allow [ + ] after [ ) ]', {}, () => {
    model.selectLeftParen();
    model.selectDigit('1');
    model.selectRightParen();
    model.selectOperation('+');
    expect(model.expression).toBe('(1)+');
  })

  it('should allow [ - ] after [ ) ]', {}, () => {
    model.selectLeftParen();
    model.selectDigit('1');
    model.selectRightParen();
    model.selectOperation('-');
    expect(model.expression).toBe('(1)-');
  })

  it('should allow [ * ] after [ ) ]', {}, () => {
    model.selectLeftParen();
    model.selectDigit('1');
    model.selectRightParen();
    model.selectOperation('*');
    expect(model.expression).toBe('(1)*');
  })

  it('should allow [ / ] after [ ) ]', {}, () => {
    model.selectLeftParen();
    model.selectDigit('1');
    model.selectRightParen();
    model.selectOperation('/');
    expect(model.expression).toBe('(1)/');
  })
})

describe('Input [ ( ) ] in the middle of expression', {}, () => {
  let model;
  beforeEach(() => {
    model = new CalculationModel();
  })

  it('should allow [ ( ] after [ + ]', {}, () => {
    model.selectDigit('1');
    model.selectOperation('+');
    model.selectLeftParen();
    expect(model.expression).toBe('1+(');
  })

  it('should allow [ ( ] after [ - ]', {}, () => {
    model.selectDigit('1');
    model.selectOperation('-');
    model.selectLeftParen();
    expect(model.expression).toBe('1-(');
  })

  it('should allow [ ( ] after [ - ] (negation)', {}, () => {
    model.selectOperation('-');
    model.selectLeftParen();
    expect(model.expression).toBe('~(');
  })

  it('should allow [ ( ] after [ * ]', {}, () => {
    model.selectDigit('1');
    model.selectOperation('*');
    model.selectLeftParen();
    expect(model.expression).toBe('1*(');
  })

  it('should allow [ ( ] after [ / ]', {}, () => {
    model.selectDigit('1');
    model.selectOperation('/');
    model.selectLeftParen();
    expect(model.expression).toBe('1/(');
  })

  it('should allow [ ( ] after [ ( ]', {}, () => {
    model.selectLeftParen();
    model.selectLeftParen();
    expect(model.expression).toBe('((');
  })

  it('should not allow [ ( ] after any digit', {}, () => {
    for (let i = 0; i < 10; i++) {
      model.selectDigit(i.toString());
      model.selectLeftParen();
      expect(model.expression).toBe(i.toString());
      model = new CalculationModel();
    }
  })

  it('should not allow [ ( ] after [ ) ]', {}, () => {
    model.selectLeftParen();
    model.selectRightParen();
    expect(model.expression).toBe('(');
  })

  it('should not allow [ ( ] after [ . ]', {}, () => {
    model.selectDigit('1');
    model.selectDot();
    model.selectRightParen();
    expect(model.expression).toBe('1.');
  })

  it('should not allow [ ) ] after [ + ]', {}, () => {
    model.selectDigit('1');
    model.selectOperation('+');
    model.selectRightParen();
    expect(model.expression).toBe('1+');
  })

  it('should not allow [ ) ] after [ - ]', {}, () => {
    model.selectDigit('1');
    model.selectOperation('-');
    model.selectRightParen();
    expect(model.expression).toBe('1-');
  })

  it('should not allow [ ) ] after [ - ] (negation)', {}, () => {
    model.selectOperation('-');
    model.selectRightParen();
    expect(model.expression).toBe('~');
  })

  it('should not allow [ ) ] after [ * ]', {}, () => {
    model.selectDigit('1');
    model.selectOperation('*');
    model.selectRightParen();
    expect(model.expression).toBe('1*');
  })

  it('should not allow [ ) ] after [ / ]', {}, () => {
    model.selectDigit('1');
    model.selectOperation('/');
    model.selectRightParen();
    expect(model.expression).toBe('1/');
  })
})

describe('Delete last input', {}, () => {
  let model;
  beforeEach(() => {
    model = new CalculationModel();
  })

  it('test (1)', {}, () => {
    model.expression = '1+2';
    model.delete();
    expect(model.expression).toBe('1+');
    expect(model.leftParenCount).toBe(0);
    expect(model.result).toBe('');
  })

  it('test (2)', {}, () => {
    model.expression = '1+(';
    model.leftParenCount = 1;
    model.delete();
    expect(model.expression).toBe('1+');
    expect(model.leftParenCount).toBe(0);
    expect(model.result).toBe('');
  })

  it('test (3)', {}, () => {
    model.expression = '1+(3-2)';
    model.leftParenCount = 0;
    model.delete();
    expect(model.expression).toBe('1+(3-2');
    expect(model.leftParenCount).toBe(1);
    expect(model.result).toBe('');
  })

  it('test (4): should delete nothing if expression is empty', {}, () => {
    model.expression = '';
    model.leftParenCount = 0;
    model.delete();
    expect(model.expression).toBe('');
    expect(model.leftParenCount).toBe(0);
    expect(model.result).toBe('');
  })
})

describe('Evaluate valid expression', {}, () => {
  let model;
  beforeEach(() => {
    model = new CalculationModel();
  })

  it('Basic Operations with Parentheses', {}, () => {
    model.expression = '(10+5)*2-3/4';
    model.leftParenCount = 0;
    model.selectEvaluate();
    expect(model.result.toString()).toBe('29.25');
  })

  it('Mixed Operations with Decimals', {}, () => {
    model.expression = '(~1.5+3.5)-2*(0.5*6)';
    model.leftParenCount = 0;
    model.selectEvaluate();
    expect(model.result.toString()).toBe('-4');
  })

  it('Nested Parentheses', {}, () => {
    model.expression = '(((2+3)*4.)-5)/6';
    model.leftParenCount = 0;
    model.selectEvaluate();
    expect(model.result.toString()).toBe('2.5');
  })

  it('Multiplication and Division Before Addition and Subtraction', {}, () => {
    model.expression = '15-12/(6/2)*4+3';
    model.leftParenCount = 0;
    model.selectEvaluate();
    expect(model.result.toString()).toBe('2');
  })

  it('Combination of All Operations', {}, () => {
    model.expression = '~(10+5)*2-3./4+(~1.5+3.5)-2*(0.5*6)';
    model.leftParenCount = 0;
    model.selectEvaluate();
    expect(model.result.toString()).toBe('-34.75');
  })

  it('Complex Expression with Multiple Operations', {}, () => {
    model.expression = '72+4*6/2-8-((10+5)*2-3/4)';
    model.leftParenCount = 0;
    model.selectEvaluate();
    expect(model.result.toString()).toBe('46.75');
  })

  it('Expression with Negation', {}, () => {
    model.expression = '~(~10+5)*2.-3/4+(~1.5+3.5)';
    model.leftParenCount = 0;
    model.selectEvaluate();
    expect(model.result.toString()).toBe('11.25');
  })

  it('Subtraction with Parentheses', {}, () => {
    model.expression = '10-(5+3)*2/4';
    model.leftParenCount = 0;
    model.selectEvaluate();
    expect(model.result.toString()).toBe('6');
  })

  it('Division Inside Parentheses', {}, () => {
    model.expression = '10/(5+3)*2-3';
    model.leftParenCount = 0;
    model.selectEvaluate();
    expect(model.result.toString()).toBe('-0.5');
  })

  it('Expression with Mixed Types and Operations', {}, () => {
    model.expression = '72+4*6/2-8-((10+5)*2-3/4)+(~1.5+3.5)';
    model.leftParenCount = 0;
    model.selectEvaluate();
    expect(model.result.toString()).toBe('48.75');
  })

  it('Deeply Nested Expressions', {}, () => {
    model.expression = '((((10+5)*2-3/4)+((~1.5+3.5)*6))-(0.5*(2+3)))*4';
    model.leftParenCount = 0;
    model.selectEvaluate();
    expect(model.result.toString()).toBe('155');
  })

  it('Complex Nested Structure with Decimals', {}, () => {
    model.expression = '((10+5)*2-3/4)+((~1.5+3.5)*6)-(0.5*(2+3))+7-2';
    model.leftParenCount = 0;
    model.selectEvaluate();
    expect(model.result.toString()).toBe('43.75');
  })
})

describe('Evaluate incomplete expression returns null', {}, () => {
  let model;
  beforeEach(() => {
    model = new CalculationModel();
  })

  it('test (1)', {}, () => {
    model.expression = '3*';
    model.leftParenCount = 0;
    model.selectEvaluate();
    expect(model.result).toBe(null);
  })

  it('test (2)', {}, () => {
    model.expression = '3-';
    model.leftParenCount = 0;
    model.selectEvaluate();
    expect(model.result).toBe(null);
  })
  it('test (3)', {}, () => {
    model.expression = '~';
    model.leftParenCount = 0;
    model.selectEvaluate();
    expect(model.result).toBe(null);
  })

  it('test (4)', {}, () => {
    model.expression = '3*(';
    model.leftParenCount = 1;
    model.selectEvaluate();
    expect(model.result).toBe(null);
  })

  it('test (5)', {}, () => {
    model.expression = '3*(~';
    model.leftParenCount = 1;
    model.selectEvaluate();
    expect(model.result).toBe(null);
  })

  it('test (6)', {}, () => {
    model.expression = '3*(~2';
    model.leftParenCount = 1;
    model.selectEvaluate();
    expect(model.result).toBe(null);
  })

  it('test (7)', {}, () => {
    model.expression = '(';
    model.leftParenCount = 1;
    model.selectEvaluate();
    expect(model.result).toBe(null);
  })

  it('test (8)', {}, () => {
    model.expression = '5+(3.5+(6-4.5*(8/2)-4)-2.5';
    model.leftParenCount = 1;
    model.selectEvaluate();
    expect(model.result).toBe(null);
  })

  it('test (9)', {}, () => {
    model.expression = '5+(0.';
    model.leftParenCount = 1;
    model.selectEvaluate();
    expect(model.result).toBe(null);
  })

  it('test (10)', {}, () => {
    model.expression = '3*(~2+(';
    model.leftParenCount = 2;
    model.selectEvaluate();
    expect(model.result).toBe(null);
  })

  it('test (11)', {}, () => {
    model.expression = '3*(~2+(~';
    model.leftParenCount = 2;
    model.selectEvaluate();
    expect(model.result).toBe(null);
  })

  it('test (12)', {}, () => {
    model.expression = '~3*(~2+(~';
    model.leftParenCount = 2;
    model.selectEvaluate();
    expect(model.result).toBe(null);
  })

  it('test (13)', {}, () => {
    model.expression = '((5.5';
    model.leftParenCount = 2;
    model.selectEvaluate();
    expect(model.result).toBe(null);
  })

  it('test (14)', {}, () => {
    model.expression = '((5+';
    model.leftParenCount = 2;
    model.selectEvaluate();
    expect(model.result).toBe(null);
  })

  it('test (15)', {}, () => {
    model.expression = '((5-(6)';
    model.leftParenCount = 2;
    model.selectEvaluate();
    expect(model.result).toBe(null);
  })

  it('test (16)', {}, () => {
    model.expression = '~((5+(6)';
    model.leftParenCount = 2;
    model.selectEvaluate();
    expect(model.result).toBe(null);
  })

  it('test (17)', {}, () => {
    model.expression = '(~(5';
    model.leftParenCount = 2;
    model.selectEvaluate();
    expect(model.result).toBe(null);
  })
})

describe('Identify previous number when delete last input is selected', {}, () => {
  let model;
  beforeEach(() => {
    model = new CalculationModel();
  })

  it('test (1)', {}, () => {
    model.selectDigit('2');
    model.selectDigit('3');
    model.selectOperation('+');
    model.delete();
    expect(model.prevNumber).toBe('23');
  })

  it('test (2)', {}, () => {
    model.selectDigit('2');
    model.selectDigit('3');
    model.selectDot();
    model.selectOperation('*');
    model.delete();
    expect(model.prevNumber).toBe('23.');
  })

  it('test (3)', {}, () => {
    model.selectDigit('2');
    model.selectDigit('3');
    model.selectDot();
    model.selectDigit('4');
    model.selectDigit('5');
    model.selectOperation('*');
    model.delete();
    expect(model.prevNumber).toBe('23.45');
  })

  it('test (4)', {}, () => {
    model.selectDigit('2');
    model.selectDigit('3');
    model.selectOperation('+');
    model.selectLeftParen();
    model.delete();
    expect(model.prevNumber).toBe('');
  })
  
  it('test (5)', {}, () => {
    model.selectDigit('2');
    model.selectOperation('+');
    model.selectLeftParen();
    model.selectDigit('3');
    model.delete();
    expect(model.prevNumber).toBe('');
  })

  it('test (6)', {}, () => {
    model.selectDigit('2');
    model.selectOperation('+');
    model.selectLeftParen();
    model.selectLeftParen();
    model.selectDigit('3');
    model.selectRightParen();
    model.selectRightParen();
    model.delete();
    expect(model.prevNumber).toBe('');
  })

  it('test (7)', {}, () => {
    model.selectDigit('2');
    model.selectOperation('+');
    model.selectDigit('3');
    model.selectDigit('5');
    model.delete();
    expect(model.prevNumber).toBe('3');
  })

  it('test (8)', {}, () => {
    model.selectDigit('2');
    model.selectOperation('+');
    model.selectDigit('3');
    model.selectDigit('5');
    model.selectDot();
    model.delete();
    expect(model.prevNumber).toBe('35');
  })

  it('test (9)', {}, () => {
    model.selectDigit('2');
    model.selectOperation('+');
    model.selectDigit('3');
    model.selectDigit('5');
    model.selectDot();
    model.selectDigit('6');
    model.delete();
    expect(model.prevNumber).toBe('35.');
  })

  it('test (10)', {}, () => {
    model.selectDigit('2');
    model.selectOperation('+');
    model.selectDigit('3');
    model.selectDigit('5');
    model.selectDot();
    model.selectDigit('6');
    model.selectDigit('8');
    model.delete();
    expect(model.prevNumber).toBe('35.6');
  })
})
