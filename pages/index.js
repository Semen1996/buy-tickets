const route = document.querySelector('#route');
const time1 = document.querySelector('#time1');
const time2 = document.querySelector('#time2');
const numOfTickets = document.querySelector('#num');
const form = document.querySelector('.popup__container');
const btn = document.querySelector('.popup__submitButton');
const popupInfo = document.querySelector('.popup__information');
const popupInfoText = popupInfo.querySelectorAll('.popup__result');

const timeList1 = Array.from(time1.children);
const timeList2 = Array.from(time2.children);

// Время в пути в минутах
const travelTime = 50;


// Функция, переводящая время в селектах в минуты
function hoursToMinutes(optionVal) {
  const timeString = optionVal.match(/\d\d:\d\d/).toString();
  const timeHours = Number( timeString.slice(0, 2) );
  const timeMinutes = Number( timeString.slice(3) );

  return timeHours*60 + timeMinutes;
}

//Функция для изменения количества вариантов в обратную сторону
function handleABA(e) {
  const departureTimeMin = hoursToMinutes(e.target.value);
  const arrivalTimeMin = departureTimeMin + travelTime;

  let index = 0;
  timeList2.forEach(item => {
    const backDepartureTimeMin = hoursToMinutes(item.value);

    if(backDepartureTimeMin <= arrivalTimeMin) {
      item.style.display = "none";
    }else {
      item.style.display = "inline";

      index += 1;
      if( index === 1) {
        item.selected = true;
      }
    }
  });
}

// Функция при изменение направления
function handleRoute(evt) {
  const valueRoute = evt.target.value;

  if(valueRoute === 'из A в B и обратно в А') {
    time2.classList.remove('popup__field_back_hidden');
    hideOptions(timeList1, /из A в B/);
    time1.addEventListener('change', handleABA);
  }else {
    time2.classList.add('popup__field_back_hidden');
    time1.removeEventListener('change', handleABA);
  }

  if(valueRoute === "из A в B") {
    hideOptions(timeList1, /из A в B/);
  }else if(valueRoute === "из B в A") {
    hideOptions(timeList1, /из B в A/);
  }
}

// Функция, скрывающая ненужные пункты в раскрывающемся списке 
function hideOptions(list, nameRoute) {
  let index = 0;

  list.forEach(item => {
    if(item.value.match(nameRoute) === null) {
      item.style.display = "none";
    }else {
      item.style.display = "inline";

      index += 1;
      if( index === 1) {
        item.selected = true;
      }
    }
  });
}

function handleNumOfTickets(e) {
  if(e.target.value === '') {
    btn.setAttribute('disabled', true);
    btn.classList.add('popup__submitButton_inactive');
  }else {
    btn.removeAttribute("disabled");
    btn.classList.remove('popup__submitButton_inactive');
  };
}

// Функция, выводящая результат при нажатии кнопки "Посчитать"
function handleBuyTicket(evt) {
  evt.preventDefault();

  popupInfo.classList.remove('popup__information_hidden');

  let cost = 0;
  const tickets = Number(numOfTickets.value);
  const travel = route.value;

  const timeDeparture = time1.value;
  const timeDepatureMin = hoursToMinutes(timeDeparture);
  const timeArrivalMin = timeDepatureMin + travelTime;

  const timeArrival = `${parseInt(timeArrivalMin/60)}:${(timeArrivalMin%60)}`;

  let timeArrivalBack = '';
  let timeDepartureBack = '';
  if(travel === 'из A в B и обратно в А') {
    cost = tickets*1200;

    timeDepartureBack = time2.value;
    const timeDepatureBackMin = hoursToMinutes(timeDepartureBack);
    const timeArrivalBackMin = timeDepatureBackMin + travelTime;
  
    timeArrivalBack = `${parseInt(timeArrivalBackMin/60)}:${(timeArrivalBackMin%60)}`;
  }else {
    cost = tickets*700;
  }

  popupInfoText[0].textContent = `Вы выбрали ${tickets} билет${tickets === 1 ? '' : tickets > 4 ? 'ов' : 'а'} по маршруту ${travel} стоимостью ${cost}р.`;
  popupInfoText[1].textContent = `Это путешествие займет у вас 50 минут${travel === 'из A в B и обратно в А' ? ' в каждую сторону' : ''}.`;
  popupInfoText[2].textContent = `Теплоход отправляется в ${timeDeparture}, а прибудет в ${timeArrival}.${travel === 'из A в B и обратно в А' ? `А из пункта B в пункт А он отправляется в ${timeDepartureBack} и прибудет в ${timeArrivalBack}.` : ''}`;
}

route.addEventListener('change', handleRoute);
numOfTickets.addEventListener('input', handleNumOfTickets);
form.addEventListener('submit', handleBuyTicket);