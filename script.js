document.addEventListener('DOMContentLoaded', () => {
    const intro = document.getElementById('intro');
    const mainContent = document.getElementById('mainContent');
    const enterBtn = document.getElementById('enterBtn');
    const countdownEl = document.getElementById('countdown');
    const timeInput = document.getElementById('timeInput');
    const startBtn = document.getElementById('startBtn');
    const alarmTimeInput = document.getElementById('alarmTime');
    const setAlarmBtn = document.getElementById('setAlarmBtn');
    const alarmMessage = document.getElementById('alarmMessage');
    const worldTimeDisplay = document.getElementById('worldTime');
    const citySelect = document.getElementById('citySelect');
    const cityInput = document.getElementById('cityInput');
    const getWeatherBtn = document.getElementById('getWeatherBtn');
    const weatherInfo = document.getElementById('weatherInfo');
  
    let timerInterval;
  
    enterBtn.addEventListener('click', () => {
      intro.style.display = 'none';
      mainContent.style.display = 'block';
      showTab('timer');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  
    window.goBack = function () {
      intro.style.display = 'flex';
      mainContent.style.display = 'none';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    setAlarmBtn.addEventListener('click', () => {
        const alarmTimeString = alarmTimeInput.value;
        if (!alarmTimeString) {
            alert('Please set a time!');
            return;
        }

        const currentTime = new Date();
        const [hours, minutes] = alarmTimeString.split(':').map(num => parseInt(num, 10));

        alarmTime = new Date(currentTime.setHours(hours, minutes, 0, 0));

        alarmMessage.textContent = `Alarm set for ${alarmTime.toLocaleTimeString()}`;
    });

    setInterval(() => {
        if (alarmTime !== null) {
            const currentTime = new Date();
            if (currentTime >= alarmTime && currentTime - alarmTime < 1000) {
                alarmMessage.textContent = `It's time! Alarm is ringing!`;
                alarmTime = null;  
            }
        }
    }, 1000);


    startBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        let timeLeft = parseInt(timeInput.value);
    
        if (isNaN(timeLeft) || timeLeft <= 0) {
            alert('Enter a valid number of seconds!');
            return;
        }
    
        updateTimerDisplay(timeLeft);
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                countdownEl.textContent = 'Time’s up!';
            }
        }, 1000);
    });
  
    function updateTimerDisplay(seconds) {
        const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        countdownEl.textContent = `${h}:${m}:${s}`;
    }
    
    const offsets = {
        'Asia/Dushanbe': 5,
        'Europe/Moscow': 3,
        'Europe/London': 0,
        'Asia/Tokyo': 9,
        'America/New_York': -4,
        'Australia/Sydney': 11,
        'Europe/Paris': 1,
        'Asia/Seoul': 9,
        'Europe/Berlin': 1,
        'Africa/Nairobi': 3,
        'America/Los_Angeles': -7,
        'Asia/Dubai': 4,
        'Asia/Kolkata': 5.5,
        'Asia/Shanghai': 8,
        'America/Sao_Paulo': -3,
        'Africa/Cairo': 2
    };

    setInterval(() => {
        const selectedCity = citySelect.value;
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;

        const offset = offsets[selectedCity];
        if (offset === undefined) {
            worldTimeDisplay.textContent = 'City not supported.';
            return;
        }

        const cityTime = new Date(utc + 3600000 * offset);
        const cityName = selectedCity.split('/')[1].replace('_', ' ');
        worldTimeDisplay.textContent = `Current time in ${cityName}: ${cityTime.toLocaleTimeString()}`;
    }, 1000);
  
    getWeatherBtn.addEventListener('click', () => {
        const city = cityInput.value;
        if (!city) {
            alert('Enter city name!');
            return;
        }
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=663d8abbb560a5032f213d8701085b3d&units=metric`)
            .then(response => response.json())
            .then(data => {
                weatherInfo.textContent = `Weather in ${data.name}: ${data.weather[0].description}, ${data.main.temp}°C`;
            })
            .catch(err => console.error(err));
    });
  
    window.showTab = function (tabName) {
        const tabs = document.querySelectorAll('.tab-content');
        tabs.forEach(tab => (tab.style.display = 'none'));
        document.getElementById(tabName).style.display = 'block';
    };
});