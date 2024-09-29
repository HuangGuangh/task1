import { Expression } from "./expression";

document.addEventListener('DOMContentLoaded', setup);

function setup() {
    const button = document.getElementById('diffButton');
    button.onclick = runDiff;
}

function runDiff() {
    const expressionInput = document.getElementById('expressionInput').value;
    const variableInput = document.getElementById('variableInput').value;
    const expression = new Expression(expressionInput);

    const result = expression.diff(variableInput).toString();
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `Result: ${result}`;
}
