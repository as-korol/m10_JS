const fruitsList = document.querySelector ('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления
const fruitTemplate = document.querySelector('.fruitTemplate'); // шаблон карточки фрукта

let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

let fruits = JSON.parse(fruitsJSON);

const display = () => {
    fruitsList.innerHTML = '';

    for (let i = 0; i < fruits.length; i++) {
        const newFruitElement = fruitTemplate.content.cloneNode(true);
        const importedFruitElement = document.importNode(newFruitElement, true);
        const fruitInfo = importedFruitElement.querySelector('.fruit__info');

        fruitInfo.children[0].textContent = `index: ${i}`;
        fruitInfo.children[1].textContent = `kind: ${fruits[i].kind}`;
        fruitInfo.children[2].textContent = `color: ${fruits[i].color}`;
        fruitInfo.children[3].textContent = `weight (кг): ${fruits[i].weight}`;

        fruitsList.appendChild(importedFruitElement);
    }
};


display();

const getRandomInt = (min, max) => {

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffleFruits = () => {

    let result = [];

  while (fruits.length > 0) {
    const randomIndex = getRandomInt(0, fruits.length - 1);
    const randomElement = fruits.splice(randomIndex, 1)[0];
    result.push(randomElement);
      
  }
    if (JSON.stringify(fruits) === JSON.stringify(result)) {
        alert('Ошибка, нажмите F5 на клавиатуре');
    } else {
        fruits = result;
    }
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

const filterFruits = () => {

    let maxWeight = parseFloat(document.querySelector('.maxweight__input').value);
    let minWeight = parseFloat(document.querySelector('.minweight__input').value);

    fruits = fruits.filter((item) => {
        return item.weight >= minWeight && item.weight <= maxWeight;
    });

    display();
};

filterButton.addEventListener('click', () => {
  filterFruits();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
    const priority = ["красный", "оранжевый", "желтый", "зеленый", "голубой", "синий", "фиолетовый"];
    const indexA = priority.indexOf(a.color);
    const indexB = priority.indexOf(b.color);

    if (indexA < indexB) {
        return -1;
    } else if (indexA > indexB) {
        return 1;
    } else {
        return 0;
    }
};

const sortAPI = {

    bubbleSort(arr, comparation) {
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr.length - 1 - i; j++) {
                if (comparation(arr[j], arr[j + 1]) > 0) {
                    const temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    },

    quickSort(arr, comparation, start = 0, end = arr.length - 1) {
        if (start >= end) {
            return;
        }

        const pivotIndex = partition(arr, comparation, start, end);
        sortAPI.quickSort(arr, comparation, start, pivotIndex - 1);
        sortAPI.quickSort(arr, comparation, pivotIndex + 1, end);
    },

    startSort(sort, arr, comparation) {
        const start = new Date().getTime();
        sortAPI[sort](arr, comparation);
        const end = new Date().getTime();
        sortTime = `${end - start} ms`;
    },
};

function partition(arr, comparation, start, end) {
    const pivot = arr[end];
    let i = start;

    for (let j = start; j < end; j++) {
        if (comparation(arr[j], pivot) <= 0) {
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
            i++;
        }
    }

    const temp = arr[i];
    arr[i] = arr[end];
    arr[end] = temp;

    return i;
}

sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
    if (sortKind === 'bubbleSort') {
        sortKind = 'quickSort';
    } else {
        sortKind = 'bubbleSort';
    }
    sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
    sortTimeLabel.textContent = 'sorting...';
    const sort = sortKind;
    sortAPI.startSort(sort, fruits, comparationColor);
    console.log(fruits);
    display();
    sortTimeLabel.textContent = sortTime;
});


/*** ДОБАВИТЬ ФРУКТ ***/
addActionButton.addEventListener('click', () => {

  const kind = kindInput.value;
  const color = colorInput.value;
  const weight = parseInt(weightInput.value);

    if (kind && color && weight != '') {

        const newFruit = {
            kind: kind,
            color: color,
            weight: weight,
        };

        fruits.push(newFruit);
        display();

    } else {
        alert('Ошибка, заполните все поля!');
    }
});