class Expression {
    constructor(inputString) {
        this._expr = inputString;
    }

    toString() {
        return this._expr;
    }

    diff(variable) {
        const expression = this._expr;

        // 匹配加法
        if (expression.includes('+')) {
            const parts = expression.split('+');
            const derivedParts = parts.map(part => new Expression(part.trim()).diff(variable).toString());
            return new Expression(this.simplify(derivedParts.join(' + ')));
        }

        // 匹配减法
        if (expression.includes('-')) {
            const parts = expression.split('-');
            const derivedParts = parts.map(part => new Expression(part.trim()).diff(variable).toString());
            return new Expression(this.simplify(derivedParts.join(' - ')));
        }

        // 匹配乘法 (Product Rule)
        const multiplyMatch = expression.match(/(.*)\*(.*)/);
        if (multiplyMatch) {
            const left = multiplyMatch[1].trim();
            const right = multiplyMatch[2].trim();
            const leftDiff = new Expression(left).diff(variable);
            const rightDiff = new Expression(right).diff(variable);

            // 检查右侧导数
            if (rightDiff.toString() === '0') {
                return new Expression(leftDiff.toString());
            }

            const result = `${leftDiff}*${right} + ${left}*${rightDiff}`;
            return new Expression(this.simplify(result));
        }



        // 匹配幂运算
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

            // 对于常数的导数返回 0
            if (baseDiff.toString() === '0') {
                return new Expression('0');
            }

            return new Expression(this.simplify(result));
        }

        // 对于简单变量或常数
        if (expression === variable) {
            return new Expression('1');
        }

        // 如果表达式不是目标变量，直接返回 0
        return new Expression('0');
    }

    simplify(expression) {
        // 移除冗余项
        expression = expression.replace(/0\s*\*\s*[^ +]+/g, '')
            .replace(/\s*\+\s*0/g, '')
            .replace(/\s*-\s*0/g, '')
            .replace(/^\s*\+\s*/, '')
            .replace(/^\s*-\s*/, '');

        // 移除 * 1 和 x^1
        expression = expression.replace(/\s*\*\s*1/g, '')
            .replace(/(\w+)\^1/g, '$1');

        // 特定情况处理
        if (expression === '') return '0'; // 空表达式返回 0

        return expression.trim();
    }
}

export { Expression };