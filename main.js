// получаем элементы с траницы
const formSearch = document.querySelector('.form-search'),
      inputCitiesFrom = document.querySelector('.input__cities-from'),
      dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
      inputCitiesTo = document.querySelector('.input__cities-to'),
      dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
      inputDateDepart = formSearch.querySelector('.input__date-depart'),
      cheapestTicket = document.getElementById('cheapest-ticket'),
      otherCheapTickets = document.getElementById('other-cheap-tickets');


// ДАННЫЕ
const sitiesApi = 'dateBase/cities.json';
const proxy = 'https://cors-anywhere.herokuapp.com/';
const API_KEY = '1b4ef28afa0075728119741f154e0b78';
const calendar = 'http://min-prices.aviasales.ru/calendar_preload';

MAX_COUNT = 5;

let city = [];

// ФУНКЦИИ

const getData = (url, callback, reject = console.error) => {
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

const showCity = (input, list) => {  // запускаем инпут когда в поле вводится значение ВЫВОДИМ СПИСОК ГОРОДОВ

  list.textContent = ''; //очищаем строку 

  if (input.value !== '') { 

    const filterCity = city.filter((item) => {  //filter ,закидывает 1-м элем в функцию.
      const fixItem = item.name.toLowerCase();
      return fixItem.startsWith(input.value.toLowerCase()); // startsWith сортирует список по введенным первым буквам
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

const getNameCity = (code) => { //Конвертируем код города в название
  const obgCity = city.find(item => item.code === code);
  return obgCity.name;
};

const getDate = (date) => {
  return new Date(date).toLocaleString('ru', { 
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getChanges = (num) => {
  if (num) {
    return num === 1 ? 'С одной пересадкой' : 'С двумя пересадками';
  } else {
    return 'Без пересадок'
  }
};

const getLinkAviasales = (data) => {
  let link = 'https://www.aviasales.ru/search/';

  link += data.origin;

  const date = new Date(data.depart_date);

  const day = date.getDate();

  link += day < 10 ? '0' + day : day;

  const month = date.getMonth() + 1;

  link += month < 10 ? '0' + month : month;

  link += data.destination;

  link += '1';

  return link;
};

const createCard = (data) => {
  const ticket = document.createElement('article');
  ticket.classList.add('ticket');

  let deep = '';

  if (data) {
    deep = `
    <h3 class="agent">${data.gate}</h3>
    <div class="ticket__wrapper">
      <div class="left-side">
        <a href="${getLinkAviasales(data)}" target='_blank' class="button button__buy">Купить
          за ${data.value}₽</a>
      </div>
      <div class="right-side">
        <div class="block-left">
          <div class="city__from">Вылет из города
            <span class="city__name">${getNameCity(data.origin)}</span>
          </div>
          <div class="date">${getDate(data.depart_date)}</div>
        </div>
    
        <div class="block-right">
          <div class="changes">${getChanges(data.number_of_changes)}</div>
          <div class="city__to">Город назначения:
            <span class="city__name">${getNameCity(data.destination)}</span>
          </div>
        </div>
      </div>
    </div>
    `;
  } else {
    deep = '<h3>К сожалению билеты на текущую дату не найдены!</h3>';
  };

  //вставляем верстку
  ticket.insertAdjacentHTML('afterbegin', deep);

  return ticket;
};

const renderCheapDay = (cheapTicket) => {
  cheapestTicket.style.display = 'block';
  cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';

  const ticket = createCard(cheapTicket[0]);
  cheapestTicket.append(ticket); //ыводим карточку на страницу
  console.log(ticket);
};

const renderCheapYear = (cheapTickets) => {
  otherCheapTickets.style.display = 'block';
  otherCheapTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';
  //ДОМАШКА ... В ОНЛАЙНЕ нужно было отсортировать по дате, а в ВК по цене. Сделал по цене.

  cheapTickets.sort((a, b) => a.value - b.value);

  for (let i = 0; i < cheapTickets.length && i < MAX_COUNT; i += 1) {
    const ticket = createCard(cheapTickets[i]);
    otherCheapTickets.append(ticket);
  }

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
    from: cityFrom, //получаем код города
    to: cityTo, 
    when: inputDateDepart.value,
  };

  

  if (formData.from && formData.to) { //Если введенный город совпадает со списком то делаем запрос иначе alert

    const requestData = `?depart_date=${formData.when}&origin=${formData.from.code}&destination=${formData.to.code}&  one_way=true&token=${API_KEY}`;

    getData(calendar + requestData, (response) => {
      renderCheap(response, formData.when);
    });
  } else {
    let deep = '';

    deep = `<h2>Введите корректное название городов!</h2>
            <div class="def__sities"></div>`;

    formSearch.insertAdjacentHTML('afterend', deep);
  };  
  
});


//ВЫЗОВЫ ФУНКЦИЙ
getData(sitiesApi, (date) => {  //получили данные и сохранили в (date)
  city = JSON.parse(date).filter((item) => item.name);  //преобразовываем JSON формат в объекты по городам метод parse() и выводим только те города где есть имя item.name  
  city.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    if (a.name < b.name) {
      return -1;
    }
    return 0;
  });
});
