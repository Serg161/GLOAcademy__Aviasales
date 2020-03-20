// 
const formSearch = document.querySelector('.form-search'),
      inputCitiesFrom = document.querySelector('.input__cities-from'),
      dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
      inputCitiesTo = document.querySelector('.input__cities-to'),
      dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
      inputDateDepart = document.querySelector('.input__date-depart');


// ДАННЫЕ
const sitiesApi = 'dateBase/cities.json';
const proxy = 'https://cors-anywhere.herokuapp.com/';
const API_KEY = '1b4ef28afa0075728119741f154e0b78';
const calendar = 'http://min-prices.aviasales.ru/calendar_preload';

let city = [];

// ФУНКЦИИ

const getData = (url, callback) => {
  const request = new XMLHttpRequest();  //создаем объект на основе API

  request.open('GET', url); //настройки какой запрос и передает юрл адресс куда отправлять запрос

  request.addEventListener('readystatechange', () => { //навешиваем обработчик сыбытия что бы не пропустить ответ
    if (request.readyState !== 4) return;

    if (request.status === 200) { // проверяем положительный ответ
      callback(request.response);  // запускаем функцию
    } else {

    }
  });

  request.send();  //всего запроса не будет пока не выполнится send

};

const showCity = (input, list) => {  // запускаем инпут когда в поле вводится значение

  list.textContent = ''; //очищаем строку 

  if (input.value !== '') { 

    const filterCity = city.filter((item) => {  //filter ,закидывает 1-м элем в функцию.
      const fixItem = item.name.toLowerCase();
      return fixItem.includes(input.value.toLowerCase()); // includer  логический метод, проверяет если в  строке символ   возвращает true или fals
    });

    filterCity.forEach((item) => {     //будем создавать новый список в ul;
      const li = document.createElement('LI');          //создание элемента
      li.classList.add('dropdown__city');      //добавляем класс ко всем li, которые будут выведены на странце.... add - добавитьэ
      li.textContent = item.name; // выводим текст.
      list.append(li); //записаваем строки на странице. свойство append()
    });
  };
};

const handlerCity = (event, input, list) => {
	const target = event.target;  //куда мы кликнули в li
	if (target.tagName.toLowerCase() === 'li') {
		input.value = target.textContent; // в инпут записываем знчение 
		list.textContent = ''; // убираем список после выбора
	};
};

const renderCheapDay = (cheapTicket) => {
  console.log(cheapTicket);
  
};

const renderCheapYear = (cheapTickets) => {

  //ДОМАШКА 1... В ОНЛАЙНЕ нужно было отсортировать по дате, а в ВК по цене. Сделал по цене.

  cheapTickets.sort((a, b) => {
    if (a.value > b.value) {
      return 1;
    }
    if (a.value < b.value) {
      return -1;
    }
    return 0;
  });


  console.log(cheapTickets);  
};

const renderCheap = (data, date) => {
  const cheapTicketYear = JSON.parse(data).best_prices;  //парсим запросы и выбираем только сов-во best_pr
  
  const cheapTicketDay = cheapTicketYear.filter((item) => {
    return item.depart_date === date; //сравниваем с введенной датой в инпут
  });

  renderCheapDay(cheapTicketDay);
  renderCheapYear(cheapTicketYear);
};

// ОБРАБОТЧИКИ СОБЫТИЙ
inputCitiesFrom.addEventListener('input', () => {
  showCity(inputCitiesFrom, dropdownCitiesFrom);
});

inputCitiesTo.addEventListener('input', () => {
  showCity(inputCitiesTo, dropdownCitiesTo);
});

dropdownCitiesFrom.addEventListener('click', (event) => {
  handlerCity(event, inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesTo.addEventListener('click', (event) => {
  handlerCity(event, inputCitiesTo, dropdownCitiesTo);
});

formSearch.addEventListener('submit', (event) => { //событие сабмит - отправка 
  event.preventDefault(); //что бы браузер не перезагружался передали еvеnt 

  const cityFrom = city.find( (item) => inputCitiesFrom.value === item.name );//получаем коды городов метод find - поиск и возвращает один элемент который найдет.
  const cityTo = city.find( (item) => inputCitiesTo.value === item.name );
      
  const formData = {
    from: cityFrom.code, //получаем код города
    to: cityTo.code, 
    when: inputDateDepart.value,
  };
      
  const requestData = `?depart_date=${formData.when}&origin=${formData.from}&destination=${formData.to}&one_way=true&token=${API_KEY}`;

  getData(calendar + requestData, (response) => {
    renderCheap(response, formData.when);
  });
  
});


//ВЫЗОВЫ ФУНКЦИЙ
getData(sitiesApi, (date) => {  //получили данные и сохранили в (date)
  city = JSON.parse(date).filter((item) => item.name);  //преобразовываем JSON формат в объекты по городам метод parse() и выводим только те города где есть имя item.name  
});
