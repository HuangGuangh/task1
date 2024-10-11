import {Expression} from "../src/expression";

test('Single operand can be processed', ()=>{
   const expr = new Expression('x^2');
    expect(expr.diff('x').toString()).toBe('2*x');
});

test('Multiple operands can be processed', ()=>{
    const expr = new Expression('x^4-x^2');
    expect(expr.diff('x').toString()).toBe('4*x^3 - 2*x');
});

test('Another variable can be processed', ()=>{
    const expr = new Expression('x^4-x^2');
    expect(expr.diff('y').toString()).toBe('0');
});

test('leading plus', ()=>{
    const expr = new Expression('+x^2');
    expect(expr.diff('x').toString()).toBe('2*x');
});

test('multiply test', ()=>{
    const expr = new Expression('-3*x^2');
    expect(expr.diff('x').toString()).toBe('-6*x');
});