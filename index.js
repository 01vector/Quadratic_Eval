const SEND_BUTTON = document.querySelector('#sendButton');
const TEXT_INPUT = document.querySelector('#evalInput');
let equation = null;
let roots = {};
let rootsElem;

rootsElem = document.createElement('p');
document.querySelector('.solution').append(rootsElem);

class QuadraticEquation {
    constructor(eqData) {
        this.eqData = eqData.replace(/\s/g, '').split('');

        this.a = 0;
        this.b = 0;
        this.c = 0;

        this.d = 0;

        this.roots = {
            x1 : 'the root is missing',
            x2 : 'the root is missing',
        }

        const getCoef = (temp, position) => {
            let pf_temp = parseFloat(temp);

            if (temp.includes('^')) {
                if (isNaN(pf_temp)) {
                    position == -1 ? this.a -= 1 : this.a += 1
                } else {
                    position == -1 ? this.a -= pf_temp : this.a += pf_temp;
                }

            } else if (isNaN(temp)) {
                if (isNaN(pf_temp)) {
                    position == -1 ? this.b -= 1 : this.b += 1;
                } else {
                    position == -1 ? this.b -= pf_temp : this.b += pf_temp;
                }

            } else {
                position == -1 ? this.c -= pf_temp : this.c += pf_temp;
            }
        }

        const checkCountSymbol = (countSymbol, previousSymbol, index, length) => {
            if (countSymbol === '+'  || countSymbol === '-'  || 
                countSymbol === '='  || index == length - 1 &&
                (index > 0 && previousSymbol !== '=')) 

                return true;
        }

        const eqInit = () => {

            let start = 0,
                end = 0,
                i,
                position = 0,
                temp = '';

            for (i = 0; i < this.eqData.length; i++) {

                if ( checkCountSymbol(this.eqData[i], this.eqData[i-1], i, eqData.length)) {
                    end = i;

                    if (i == this.eqData.length - 1) {
                        temp = this.eqData.slice(start, end + 1).join("");
                    } else temp = this.eqData.slice(start, end).join("");

                    getCoef(temp, position);
                    start = end;
                }

                if (eqData[start] === '=') {
                    position = -1;
                    ++start;
                }
            }
        }
        
        eqInit();
    }

    discriminant() {
        return this.b * this.b - 4 * this.a * this.c;
    }

    solve() {
        this.d = this.discriminant();

        if (this.d < 0) {
            return this.roots;
        } else if (this.d === 0) {
            this.roots.x1 = (-this.b / 2 * this.a).toFixed(3);
            return this.roots;
        } else {
            this.roots.x1 = ((-this.b + Math.sqrt(this.d)) / (2 * this.a)).toFixed(3);
            this.roots.x2 = ((-this.b - Math.sqrt(this.d)) / (2 * this.a)).toFixed(3);
            return this.roots;
        }
    }
}

const renderSolution = () => {
    eqData = TEXT_INPUT.value.replace(/\s/g, '');
    equation = new QuadraticEquation(eqData);

    roots = equation.solve();

    if (roots.x1.slice(1) == 'Infinity' || roots.x2.slice(1) == 'Infinity') {
        rootsElem.innerText = 'Некорректное уравнение';
        return false;
    }

    rootsElem.innerText = `x1: ${roots.x1}\nx2: ${roots.x2}`;
}

SEND_BUTTON.addEventListener('click', renderSolution);
TEXT_INPUT.addEventListener('keypress', function (e) {
    if (e.keyCode == 13) {
        e.preventDefault();
        renderSolution();
    }
});