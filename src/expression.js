class Expression {
    constructor(inputString) {
        this._expr = inputString;
    }

    toString() {
        return this._expr;
    }

    diff(variable) {
        const expression = this._expr;

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

            // check the right derivative
            if (rightDiff.toString() === '0') {
                return new Expression(leftDiff.toString());
            }

            const result = `${leftDiff}*${right} + ${left}*${rightDiff}`;
            return new Expression(this.simplify(result));
        }



        // deal with ^
        const powerMatch = expression.match(/(.*)\^(\d+)/);
        if (powerMatch) {
            const base = powerMatch[1].trim();
            const exponent = parseInt(powerMatch[2]);
            const newExponent = exponent - 1;

            if (newExponent < 0) {
                return new Expression('0');
            }

            const baseDiff = new Expression(base).diff(variable);
            const result = `${exponent}*${base}^${newExponent}*${baseDiff}`;

            // the derivative of the const is 0
            if (baseDiff.toString() === '0') {
                return new Expression('0');
            }

            return new Expression(this.simplify(result));
        }

        //
        if (expression === variable) {
            return new Expression('1');
        }

        //
        return new Expression('0');
    }

    simplify(expression) {
        // remove redundancy
        expression = expression.replace(/0\s*\*\s*[^ +]+/g, '')
            .replace(/\s*\+\s*0/g, '')
            .replace(/\s*-\s*0/g, '')
            .replace(/^\s*\+\s*/, '')
            .replace(/^\s*-\s*/, '');

        // remove * 1 and x^1
        expression = expression.replace(/\s*\*\s*1/g, '')
            .replace(/(\w+)\^1/g, '$1');

        //
        if (expression === '') return '0'; //

        return expression.trim();
    }
}

export { Expression };