import '../style/main.scss'

let arr = []
let currentSize = 4;

const root = document.querySelector('.container')
const _answer = document.createElement('p')

function checkGameArray() {
    let number = arr.flat().map((it, i, a) => {
        let sum = 0
        for(let j = i; j < a.length; j++) {
            if(it > a[j] && a[j] != 0) sum++
        }
        return sum
    }).reduce((w, c) => w + c, 0)
    let number2
    arr.forEach((a, i) => {a.forEach((el, j) => {if(el === 0) number2 = i + 1})})
    number += number2
    return number % 2 === arr.length % 2
}

function setCurrentSize(val) {
    currentSize = val
    root.innerHTML = ''
    clearAnswer()
    createVisual()
}

function createVisual() {
    let _grid = document.createElement('div')
    _grid.classList.add(`grid`)
    _grid.classList.add(`grid-${currentSize}`)
    for (let i = 0; i < currentSize; i++) {
        for (let j = 0; j < currentSize; j++) {
            const _el = document.createElement('div')
            _el.classList.add('element')
            _el.classList.add(`element${i+1}-${j+1}`)
            const _input = document.createElement('input')
            _input.setAttribute('type', 'text')
            _input.addEventListener('keydown', textListener)
            _el.append(_input)
            _grid.appendChild(_el)
        }
    }

    const _title = document.createElement('h1')
    _title.textContent = 'Проверка пазла'
    const _subTitle = document.createElement('h2')
    _subTitle.innerHTML = 'Введите цифры на свои места (пустое поле в пазле можно оставить пустым или заполнить нулем)<br>После заполнения - нажмите кнопку "ПРОВЕРИТЬ"" и получите результат!<br>Не гарантируется корректная работа при неверном заполнении пазла, заполняйте пазл верно'

    const _sizes = document.createElement('div')
    const _sizesTitle = document.createElement('h3')
    _sizes.appendChild(_sizesTitle)
    const _sizesSelector = document.createElement('div')
    _sizesSelector.classList.add('size-selector')
    _sizesTitle.textContent = 'Размер пазла:'
    for(let i = 3; i < 9; i++) {
        const _selSize = document.createElement('a')
        _selSize.onclick = (e) => {setCurrentSize(i)}
        _selSize.textContent = `${i}x${i}`
        _sizesSelector.appendChild(_selSize)
    }
    _sizes.appendChild(_sizesSelector)

    const _buttonCheck = document.createElement('button')
    _buttonCheck.setAttribute('type', 'submit')
    _buttonCheck.onclick = checkThisPuzzle
    _buttonCheck.textContent = 'Проверить'

    root.appendChild(_title)
    root.appendChild(_subTitle)
    root.appendChild(_grid)
    root.appendChild(_sizes)
    root.appendChild(_buttonCheck)
    root.appendChild(_answer)
}

const digits = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'])
function textListener(e) {
    setTimeout(() => {
        console.log(this.value)
        let val = this.value.toString()
        this.value = val.split('').filter((it, i) => digits.has(it) && i < 2).join('')
    }, 1);
    if (e.key === "Enter") {
        checkThisPuzzle()
    } else {
        _answer.textContent = 'идет ввод...'
        _answer.classList.value = ''
        _answer.classList.add('is-write')
    }
}

function checkThisPuzzle(e) {
    try {e.preventDefault() } catch (er) {return}
    setAllToArray()
    clearAnswer()
    let check = checkGameArray()
    let checkStr = check ? 'решаемый!' : 'не решаемый!'
    let checkClass = check ? 'is-good' : 'is-bad'

    _answer.textContent = checkStr
    _answer.classList.add(checkClass)
}

function setAllToArray() {
    arr = new Array(currentSize)
    for(let i = 0; i < currentSize; i++) {
        arr[i] = new Array(currentSize)
        for(let j = 0; j < currentSize; j++) {
            const inp = document.querySelector(`.element${i+1}-${j+1}`).firstChild
            arr[i][j] = inp.value != '' ? Number(inp.value) : 0
        }
    }
    moveItUp()
}

function moveItUp() {
    for(let i = 0; i < currentSize; i++) {
        for(let j = 0; j < currentSize; j++) {
            if(arr[i][j] == 0 && (i < currentSize - 1)) {
                arr[i][j] = arr[i+1][j]
                arr[i+1][j] = 0
            }
        }
    }
}

function clearAnswer() {
    _answer.innerText = ''
    _answer.classList.value = ''
}

createVisual()