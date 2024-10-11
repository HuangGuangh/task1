class Expression {
    constructor(inputString) {
        this._expr = inputString;
    }

    toString() {
        return this._expr;
    }

    diff(variable) {
        const expression = this._expr;

        // Check if the expression contains the variable
        if (!expression.includes(variable)) {
            return new Expression('0');
        }

        // deal with +
        if (expression.includes('+')) {
            const parts = expression.split('+');
            const derivedParts = parts.map(part => new Expression(part.trim()).diff(variable).toString());
            return new Expression(this.simplify(derivedParts.join(' + ')));
        }

        // deal with -
        if (expression.includes('-')) {
            const parts = expression.split('-');
            const derivedParts = parts.map(part => new Expression(part.trim()).diff(variable).toString());
            return new Expression(this.simplify(derivedParts.join(' - ')));
        }

        // deal with *
        const multiplyMatch = expression.match(/(.*)\*(.*)/);
        if (multiplyMatch) {
            const left = multiplyMatch[1].trim();
            const right = multiplyMatch[2].trim();
            const leftDiff = new Expression(left).diff(variable);
            const rightDiff = new Expression(right).diff(variable);

            const result = `${leftDiff}*${right} + ${left}*${rightDiff}`;
            return new Expression(this.simplify(result));
        }

        // deal with ^
        const powerMatch = expression.match(/(.*)\^(\d+)/);
        if (powerMatch) {
            const base = powerMatch[1].trim();
            const exponent = parseInt(powerMatch[2]);
            const newExponent = exponent - 1;

            const baseDiff = new Expression(base).diff(variable);
            const result = `${exponent}*${base}^${newExponent}*${baseDiff}`;

            return new Expression(this.simplify(result));
        }

        // if it's the variable
        if (expression === variable) {
            return new Expression('1');
        }

        // if it's a constant
        return new Expression('0');
    }

    simplify(expression) {
        // remove redundancy
        expression = expression.replace(/0\s*\*\s*[^ +]+/g, '')
            .replace(/\s*\+\s*0/g, '')
            .replace(/\s*-\s*0/g, '')
            .replace(/^\s*\+\s*/, '')
            .replace(/^\s*-\s*/, '');

        // handle 0+ and 0- cases
        expression = expression.replace(/(?<=\s)0\+/g, '')
            .replace(/(?<=\s)0-\s*/g, '-');

        expression = expression.replace(/^\s*0\s*\+\s*/, '')
            .replace(/^\s*0\s*-\s*/, '-');

        // remove * 1 and x^1
        expression = expression.replace(/\s*\*\s*1/g, '')
            .replace(/(\w+)\^1/g, '$1');

        // Simplify numerical multiplication
        expression = this.simplifyMultiplication(expression);

        // return zero if the expression is empty
        return expression.trim() === '' ? '0' : expression.trim();
    }

    simplifyMultiplication(expression) {
        // Replace patterns of the form 'number*number*variable'
        return expression.replace(/(\d+)\s*\*\s*(\d+)(\s*\*\s*\w+)/g, (match, num1, num2, varPart) => {
            const product = parseFloat(num1) * parseFloat(num2);
            return product + varPart;
        });
    }
}

export { Expression };
