const airports = [
{ code: "ADA", name: "Adana Şakirpaşa Havaalanı" },
{ code: "ADF", name: "Adıyaman Havaalanı" },
{ code: "AFY", name: "Afyon Havaalanı" },
{ code: "AJI", name: "Ağrı Havaalanı" },
{ code: "AYT", name: "Antalya Havaalanı" },
{ code: "MZH", name: "Amasya Merzifon Havaalanı" },
{ code: "BAL", name: "Batman Havaalanı" },
{ code: "BGG", name: "Bingöl Havaalanı" },
{ code: "BJV", name: "Milas–Bodrum Havaalanı" },
{ code: "BZI", name: "Balıkesir Merkez Havaalanı" },
{ code: "EDO", name: "Balıkesir Koca Seyit Havaalanı" },
{ code: "YEI", name: "Bursa Yenişehir Havaalanı" },
{ code: "CKZ", name: "Çanakkale Havaalanı" },
{ code: "DLM", name: "Dalaman Havaalanı" },
{ code: "DNZ", name: "Denizli Çardak Havaalanı" },
{ code: "DIY", name: "Diyarbakır Havaalanı" },
{ code: "EZS", name: "Elazığ Havaalanı" },
{ code: "ERC", name: "Erzincan Havaalanı" },
{ code: "ERZ", name: "Erzurum Havaalanı" },
{ code: "ESB", name: "Ankara Esenboğa Havaalanı" },
{ code: "AOE", name: "Eskişehir Hasan Polatkan Havaalanı" },
{ code: "GZP", name: "Gazipaşa Havaalanı" },
{ code: "GZT", name: "Gaziantep Havaalanı" },
{ code: "HTY", name: "Hatay Havaalanı" },
{ code: "IGD", name: "Iğdır Havaalanı" },
{ code: "IST", name: "İstanbul Havaalanı" },
{ code: "SAW", name: "İstanbul Sabiha Gökçen Havaalanı" },
{ code: "KCM", name: "Kahramanmaraş Havaalanı" },
{ code: "KSY", name: "Kars Harakani Havaalanı" },
{ code: "KCO", name: "Kocaeli Cengiz Topel Havaalanı" },
{ code: "KYA", name: "Konya Havaalanı" },
{ code: "MLX", name: "Malatya Erhaç Havaalanı" },
{ code: "MQM", name: "Mardin Havaalanı" },
{ code: "MSR", name: "Muş Havaalanı" },
{ code: "NAV", name: "Nevşehir Kapadokya Havaalanı" },
{ code: "NKT", name: "Şırnak Şerafettin Elçi Havaalanı" },
{ code: "SZF", name: "Samsun Çarşamba Havaalanı" },
{ code: "SXZ", name: "Siirt Havaalanı" },
{ code: "VAS", name: "Sivas Nuri Demirağ Havaalanı" },
{ code: "TEQ", name: "Tekirdağ Çorlu Havaalanı" },
{ code: "TJK", name: "Tokat Havaalanı" },
{ code: "TZX", name: "Trabzon Havaalanı" },
{ code: "VAN", name: "Van Ferit Melen Havaalanı" },
{ code: "ONQ", name: "Zonguldak Çaycuma Havaalanı" },
{ code: "ADB", name: "İzmir Adnan Menderes Havaalanı" },
{ code: "ASR", name: "Kayseri Erkilet Havaalanı" },
{ code: "GNY", name: "Şanlıurfa GAP Havaalanı" },
{ code: "OGU", name: "Ordu-Giresun Havaalanı" },
{ code: "ISE", name: "Isparta Süleyman Demirel Havaalanı" },
{ code: "KFS", name: "Kastamonu Havaalanı" },
{ code: "KZR", name: "Kütahya Zafer Havaalanı" },
{ code: "RZV", name: "Rize-Artvin Havaalanı" },
{ code: "SIC", name: "Sinop Havaalanı" },
{ code: "YKO", name: "Hakkari Yüksekova Selahaddin Eyyubi Havaalanı" }
];

function setupAutocomplete(inputId, suggestionsId) {
 const input = document.getElementById(inputId);
 const suggestions = document.getElementById(suggestionsId);

 function filterAirports(query) {
  const q = query.toLowerCase();
  return airports.filter(a =>
   a.code.toLowerCase().startsWith(q) ||
   a.name.toLowerCase().startsWith(q)
  );
 }

 function showSuggestions(filtered) {
  suggestions.innerHTML = "";
  if (filtered.length === 0) {
   suggestions.style.display = "none";
   return;
  }

  filtered.forEach(a => {
   const li = document.createElement("li");
   li.textContent = `${a.code} - ${a.name}`;
   li.addEventListener("click", () => {
    input.value = `${a.code} - ${a.name}`;
    suggestions.innerHTML = "";
    suggestions.style.display = "none";
    input.dataset.valid = "true";
   });
   suggestions.appendChild(li);
  });

  suggestions.style.display = "block";
 }

 input.addEventListener("click", () => {
  input.removeAttribute("readonly");
  input.focus();
  showSuggestions(filterAirports(""));
 });

 input.addEventListener("focus", () => {
  showSuggestions(filterAirports(input.value));
 });

 input.addEventListener("input", () => {
  input.dataset.valid = "false";
  const filtered = filterAirports(input.value);
  showSuggestions(filtered);
 });

 input.addEventListener("blur", (e) => {
  setTimeout(() => {
   if (!input.dataset.valid || input.dataset.valid === "false") {
    input.setAttribute("readonly", "true");
   }
  }, 200);
 });

 document.addEventListener("click", (e) => {
  if (!input.contains(e.target) && !suggestions.contains(e.target)) {
   suggestions.style.display = "none";
   if (!input.dataset.valid || input.dataset.valid === "false") {
    input.setAttribute("readonly", "true");
   }
  }
 });
}

function setupSwapButton() {
 const swapBtn = document.getElementById('swap-btn');
 const fromInput = document.getElementById('from');
 const toInput = document.getElementById('to');

 swapBtn.addEventListener('click', () => {
  const temp = fromInput.value;
  fromInput.value = toInput.value;
  toInput.value = temp;

  const tempValid = fromInput.dataset.valid;
  fromInput.dataset.valid = toInput.dataset.valid;
  toInput.dataset.valid = tempValid;
 });
}

function setupDateTimePicker(inputId, pickerId, dateInputId, timeInputId, todayBtnId, cancelBtnId, confirmBtnId) {
 const datetimeInput = document.getElementById(inputId);
 const datetimePicker = document.getElementById(pickerId);
 const dateInput = document.getElementById(dateInputId);
 const timeInput = document.getElementById(timeInputId);
 const todayBtn = document.getElementById(todayBtnId);
 const cancelBtn = document.getElementById(cancelBtnId);
 const confirmBtn = document.getElementById(confirmBtnId);

 datetimeInput.addEventListener('click', () => {
  datetimePicker.classList.add('active');
 });

 todayBtn.addEventListener('click', () => {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const timeStr = today.toTimeString().split(' ')[0].substring(0, 5);
  dateInput.value = dateStr;
  timeInput.value = timeStr;
 });

 cancelBtn.addEventListener('click', () => {
  datetimePicker.classList.remove('active');
 });

 confirmBtn.addEventListener('click', () => {
  if (dateInput.value && timeInput.value) {
   const dateObj = new Date(dateInput.value);
   const formattedDate = dateObj.toLocaleDateString('tr-TR');
   datetimeInput.value = `${formattedDate} - ${timeInput.value}`;
   datetimeInput.dataset.valid = "true";
   datetimePicker.classList.remove('active');
  }
 });

 document.addEventListener('click', (e) => {
  if (!datetimeInput.contains(e.target) && !datetimePicker.contains(e.target)) {
   datetimePicker.classList.remove('active');
  }
 });
}

function setupMobileMenu() {
 const mobileToggle = document.querySelector('.mobile-menu-toggle');
 const nav = document.querySelector('.header-nav');
 const overlay = document.querySelector('.mobile-overlay');

 mobileToggle.addEventListener('click', () => {
  mobileToggle.classList.toggle('active');
  nav.classList.toggle('active');
  overlay.classList.toggle('active');
  
  document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
 });

 overlay.addEventListener('click', () => {
  mobileToggle.classList.remove('active');
  nav.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
 });

 nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
   mobileToggle.classList.remove('active');
   nav.classList.remove('active');
   overlay.classList.remove('active');
   document.body.style.overflow = '';
  });
 });

 document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('active')) {
   mobileToggle.classList.remove('active');
   nav.classList.remove('active');
   overlay.classList.remove('active');
   document.body.style.overflow = '';
  }
 });
}

function updateRiskScale(riskScore) {
    const riskScale = document.getElementById('risk-scale');
    const scaleScore = document.getElementById('scale-score');
    const scaleLevel = document.getElementById('scale-level');
    const scaleDescription = document.getElementById('scale-description');
    const arrowIndicator = document.getElementById('arrow-indicator');
    
    // Yeni yüzdelik tabanlı eşikler (0.86, 0.93, 0.98'in yüzdeye çevrilmiş hali)
    const thresholds = {
        normal: 86.0,
        low: 93.0,
        high: 98.0
    };
    
    // Yeni risk seviyeleri
    const levels = {
        normal: "Normal",
        low: "Düşük Risk",
        high: "Yüksek Risk",
        veryHigh: "Çok Yüksek Risk"
    };
    
    // Yeni seviye açıklamaları
    const descriptions = {
        normal: "Uçuşunuzun iptal edilme riski normal düzeyde.",
        low: "Düşük olasılıkla uçuş iptali gerçekleşebilir.",
        high: "Yüksek olasılıkla uçuş iptali gerçekleşebilir.",
        veryHigh: "Çok yüksek olasılıkla uçuş iptali gerçekleşebilir."
    };
    
    // Yeni seviye sınıfları
    const classes = {
        normal: "level-normal",
        low: "level-low",
        high: "level-high",
        veryHigh: "level-very-high"
    };

    let level, description, levelClass;
    if (riskScore <= thresholds.normal) {
        level = levels.normal;
        description = descriptions.normal;
        levelClass = classes.normal;
    } else if (riskScore <= thresholds.low) {
        level = levels.low;
        description = descriptions.low;
        levelClass = classes.low;
    } else if (riskScore <= thresholds.high) {
        level = levels.high;
        description = descriptions.high;
        levelClass = classes.high;
    } else {
        level = levels.veryHigh;
        description = descriptions.veryHigh;
        levelClass = classes.veryHigh;
    }
    
    scaleScore.textContent = `${riskScore.toFixed(2)}%`;
    scaleLevel.textContent = level;
    scaleLevel.className = `scale-level ${levelClass}`;
    scaleDescription.textContent = description;
    
    // Ok pozisyonunu yüzdelik değere göre doğru şekilde ayarla
    arrowIndicator.style.left = `${Math.min(Math.max(riskScore, 0), 100)}%`;
    
    riskScale.classList.add('active');
}

function updateDetails(details) {
    const detailsList = document.querySelector('#details-container .detail-box ul');
    if (!detailsList) return;

    detailsList.innerHTML = `
        <li> <b> Sıcaklık (°C): </b> ${details.temperature}</li>
        <li> <b> Yüzey Basıncı (hPa): </b> ${details.pressure}</li>
        <li> <b> Rüzgar Hızı (km/h): </b> ${details.wind_gusts}</li>
        <li> <b> Rüzgar Yönü (°): </b> ${details.wind_direction}</li>
        <li> <b> Uçuş Süresi (saat): </b> ${details.flight_duration}</li>
        <li> <b> Uçuş Mesafesi (mil): </b> ${details.flight_distance}</li>
    `;
}

function toggleDetails() {
 const detailsContainer = document.getElementById('details-container');
 const button = document.getElementById('toggle-details-btn');
 if (detailsContainer.style.maxHeight) {
  detailsContainer.style.maxHeight = null;
  button.textContent = 'Ayrıntıları Göster';
 } else {
  detailsContainer.style.maxHeight = detailsContainer.scrollHeight + 'px';
  button.textContent = 'Ayrıntıları Gizle';
 }
}

document.addEventListener("DOMContentLoaded", () => {
 setupAutocomplete("from", "from-suggestions");
 setupAutocomplete("to", "to-suggestions");
 setupSwapButton();
 
 setupDateTimePicker('departure-datetime', 'datetime-picker', 'date-input', 'time-input', 
  'today-btn', 'cancel-datetime', 'confirm-datetime');
  
 setupDateTimePicker('arrival-datetime', 'arrival-datetime-picker', 'arrival-date-input', 
  'arrival-time-input', 'arrival-today-btn', 'arrival-cancel-datetime', 'arrival-confirm-datetime');
  
 setupMobileMenu();

 const form = document.getElementById("flight-form");
 const result = document.getElementById("result");
 const toggleDetailsBtn = document.getElementById('toggle-details-btn');

 toggleDetailsBtn.addEventListener('click', toggleDetails);

 form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fromInput = document.getElementById("from");
  const toInput = document.getElementById("to");
  const departureDatetimeInput = document.getElementById("departure-datetime");
  const arrivalDatetimeInput = document.getElementById("arrival-datetime");

  if (!fromInput.value || !toInput.value) {
   result.textContent = "Lütfen kalkış ve varış havalimanlarını seçin.";
   result.style.color = "red";
   result.style.display = "block";
   document.getElementById('risk-scale').classList.remove('active');
   return;
  }

  if (fromInput.value === toInput.value) {
   result.textContent = "Kalkış ve varış havalimanları aynı olamaz!";
   result.style.color = "red";
   result.style.display = "block";
   document.getElementById('risk-scale').classList.remove('active');
   return;
  }

  if (!departureDatetimeInput.value) {
   result.textContent = "Lütfen kalkış tarih ve saatini seçin.";
   result.style.color = "red";
   result.style.display = "block";
   document.getElementById('risk-scale').classList.remove('active');
   return;
  }
  
  if (!arrivalDatetimeInput.value) {
   result.textContent = "Lütfen varış tarih ve saatini seçin.";
   result.style.color = "red";
   result.style.display = "block";
   document.getElementById('risk-scale').classList.remove('active');
   return;
  }

  const [depDateStr, depTimeStr] = departureDatetimeInput.value.split(' - ');
  const [depDay, depMonth, depYear] = depDateStr.split('.');
  const departureDate = new Date(`${depYear}-${depMonth}-${depDay}T${depTimeStr}`);

  const [arrDateStr, arrTimeStr] = arrivalDatetimeInput.value.split(' - ');
  const [arrDay, arrMonth, arrYear] = arrDateStr.split('.');
  const arrivalDate = new Date(`${arrYear}-${arrMonth}-${arrDay}T${arrTimeStr}`);

  if (arrivalDate <= departureDate) {
   result.textContent = "Varış tarihi kalkış tarihinden sonra olmalıdır.";
   result.style.color = "red";
   result.style.display = "block";
   document.getElementById('risk-scale').classList.remove('active');
   return;
  }

  const formData = {
    from: fromInput.value.split(' - ')[0],
    to: toInput.value.split(' - ')[0],
    departure_datetime: departureDate.toISOString(),
    arrival_datetime: arrivalDate.toISOString()
  };
  
  const loadingOverlay = document.createElement('div');
  loadingOverlay.className = 'loading-overlay';
  loadingOverlay.innerHTML = '<div class="loading-content">Tahmin ediliyor...</div>';
  document.body.appendChild(loadingOverlay);

  try {
    const response = await fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    
    document.body.removeChild(loadingOverlay);

    if (data.success) {
      updateRiskScale(data.risk_score);
            updateDetails(data.details); // Yeni fonksiyon çağrısı
      result.style.display = "none";
    } else {
      result.textContent = data.message;
      result.style.color = "red";
      result.style.display = "block";
      document.getElementById('risk-scale').classList.remove('active');
    }
  } catch (error) {
    document.body.removeChild(loadingOverlay);
    result.textContent = "Sunucuya bağlanırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
    result.style.color = "red";
    result.style.display = "block";
    document.getElementById('risk-scale').classList.remove('active');
  }
});



});