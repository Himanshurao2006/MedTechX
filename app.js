/**
 * MedTechX — Complete Healthcare Platform Interactive Engine
 * Fully functional modules: RPM ECG stream, Multilingual AI Triage, Doctor Marketplace & Teleconsultation,
 * Emergency GPS Ambulance Tracker, EHR & Prescription Generator, Smart Medication Alerts, Architecture Explorer.
 */

// ==========================================
// 1. DATA & STATE MANAGEMENT
// ==========================================
const MedTechState = {
  currentView: 'dashboard',
  language: 'en', // 'en' or 'hi'
  isDark: false,
  isLowBandwidth: false,
  ecgAnomaly: false,
  patientData: {
    name: "Rameshwar Patel",
    age: 58,
    gender: "Male",
    abhaId: "91-4820-9182-4102",
    bloodGroup: "O+",
    vitals: { hr: 74, spo2: 98, bpSys: 122, bpDia: 82, glucose: 108, temp: 98.4 },
    adherence: 92
  },
  ambulanceState: {
    active: false,
    etaSeconds: 420,
    distanceKm: 4.8,
    intervalId: null
  },
  callState: {
    active: false,
    doctor: null,
    timer: 0,
    intervalId: null,
    isMuted: false,
    isVideoOff: false
  }
};

// Doctors Database
const DOCTOR_ROSTER = [
  {
    id: 1,
    name: "Dr. Rakesh Sharma",
    spec: "General Physician",
    regNo: "MCI-48921",
    exp: 14,
    rating: 4.9,
    reviews: 320,
    languages: ["Hindi", "English"],
    fee: 250,
    city: "Nagpur (Rural Outreach)",
    modes: ["Online", "Home Visit"],
    status: "Available Now",
    hospital: "District Civil Hospital",
    bio: "Specializes in rural chronic disease management, diabetes and acute fevers."
  },
  {
    id: 2,
    name: "Dr. Priya Nair",
    spec: "Pediatrics",
    regNo: "MCI-52110",
    exp: 10,
    rating: 4.9,
    reviews: 215,
    languages: ["English", "Malayalam", "Hindi"],
    fee: 350,
    city: "Kochi / Tele-Network",
    modes: ["Online"],
    status: "Available Now",
    hospital: "Amrita Institute of Medical Sciences",
    bio: "Child healthcare, immunization guidance, and seasonal pediatric infections."
  },
  {
    id: 3,
    name: "Dr. Arjun Menon",
    spec: "Cardiology",
    regNo: "MCI-39184",
    exp: 21,
    rating: 4.8,
    reviews: 440,
    languages: ["English", "Tamil", "Hindi"],
    fee: 700,
    city: "Chennai & Remote Tele-ICU",
    modes: ["Online"],
    status: "Available Now",
    hospital: "Apollo Heart Centre",
    bio: "Preventive cardiology, ECG telemetry analysis and hypertension control."
  },
  {
    id: 4,
    name: "Dr. Sunita Rao",
    spec: "Gynecology",
    regNo: "MCI-41902",
    exp: 18,
    rating: 4.9,
    reviews: 380,
    languages: ["Marathi", "Hindi", "English"],
    fee: 400,
    city: "Pune / Satara District",
    modes: ["Online", "Home Visit"],
    status: "Available Now",
    hospital: "Sanjeevani Maternity Center",
    bio: "Maternal healthcare, high-risk pregnancy triage and rural women's wellness."
  },
  {
    id: 5,
    name: "Dr. Imran Sheikh",
    spec: "Orthopedics",
    regNo: "MCI-60124",
    exp: 15,
    rating: 4.7,
    reviews: 190,
    languages: ["Hindi", "Urdu", "English"],
    fee: 600,
    city: "Bhopal",
    modes: ["Online", "Home Visit"],
    status: "In Consultation",
    hospital: "Bhopal Memorial Hospital",
    bio: "Joint pain, osteoarthritis in elderly patients, and trauma stabilization."
  },
  {
    id: 6,
    name: "Dr. Anil Deshmukh",
    spec: "General Physician",
    regNo: "MCI-31294",
    exp: 9,
    rating: 4.6,
    reviews: 160,
    languages: ["Marathi", "Hindi"],
    fee: 180,
    city: "Latur Rural Health Center",
    modes: ["Online", "Home Visit"],
    status: "Available Now",
    hospital: "PHC Latur",
    bio: "Primary healthcare, ASHA-worker collaborative care and home visits."
  },
  {
    id: 7,
    name: "Dr. Fatima Khan",
    spec: "Dermatology",
    regNo: "MCI-65239",
    exp: 8,
    rating: 4.7,
    reviews: 130,
    languages: ["Hindi", "English"],
    fee: 350,
    city: "Lucknow",
    modes: ["Online"],
    status: "Offline",
    hospital: "King George's Medical University",
    bio: "Dermatological infections, eczema, fungal and pediatric rashes."
  },
  {
    id: 8,
    name: "Dr. Ravi Verma",
    spec: "Psychiatry",
    regNo: "MCI-48192",
    exp: 12,
    rating: 4.8,
    reviews: 180,
    languages: ["Hindi", "English"],
    fee: 500,
    city: "Jaipur",
    modes: ["Online"],
    status: "Available Now",
    hospital: "SMS Hospital Tele-Psychiatry",
    bio: "Stress management, insomnia, anxiety and geriatric mental wellness."
  }
];

// Symptoms database for Triage
const SYMPTOMS_LIST = [
  "Chest Pain (छाती में दर्द)",
  "Breathlessness (सांस फूलना)",
  "High Fever (तेज़ बुखार)",
  "Severe Headache (सिरदर्द)",
  "Abdominal Pain (पेट में दर्द)",
  "Dizziness / Fainting (चक्कर आना)",
  "Palpitations (धड़कन तेज़)",
  "Persistent Cough (खांसी)",
  "Vomiting / Nausea (उल्टी)",
  "Unconsciousness (बेहोशी)",
  "Heavy Bleeding (खून बहना)",
  "Joint Swelling (जोड़ों में सूजन)"
];

// Multilingual Translations Dictionary
const I18N = {
  en: {
    brandTag: "ONE PLATFORM. COMPLETE HEALTHCARE.",
    pageTitles: {
      dashboard: ["Dashboard Overview", "SIH26200 / SIH26133 · Complete Digital Healthcare Ecosystem"],
      rpm: ["Remote Patient Monitoring (RPM)", "Live IoT Wearable Sensor Stream & Real-Time ECG Waveform"],
      triage: ["AI-Assisted Disease Detection & Triage", "Describe symptoms in English / Hindi / Hinglish → Care Pathway"],
      doctors: ["24×7 Available Now Doctors", "Verified Doctor Marketplace with Instant Teleconsultation"],
      emergency: ["Emergency Assistance & SOS", "Real-Time Ambulance GPS Dispatch & Hospital Bed Tracker"],
      homevisit: ["Doctor Home Visit Request", "Compassionate In-Person Care for Mobility-Limited Patients"],
      ehr: ["Electronic Health Records (EHR)", "Centralized ABDM-Aligned Health Profile & Prescription Hub"],
      medications: ["Medication & Smart Pill Reminders", "Adherence Tracking & SMS/WhatsApp Notification Simulator"],
      architecture: ["System Architecture & Service Flow", "Continuous Improvement, Block Diagram & Stakeholder Map (Image 3)"],
      analytics: ["Health Analytics & SIH Overview", "Population Health Insights, Travel Cost Savings & Feasibility"]
    }
  },
  hi: {
    brandTag: "एक मंच। सम्पूर्ण स्वास्थ्य सेवा।",
    pageTitles: {
      dashboard: ["डैशबोर्ड अवलोकन", "SIH26200 / SIH26133 · सम्पूर्ण डिजिटल स्वास्थ्य सेवा तंत्र"],
      rpm: ["रिमोट रोगी निगरानी (RPM)", "लाइव IoT सेंसर डेटा एवं वास्तविक समय ईसीजी वेवफॉर्म"],
      triage: ["एआई-संचालित लक्षण जांच एवं ट्राइएज", "हिंदी/अंग्रेजी में लक्षण दर्ज करें → उचित उपचार मार्ग"],
      doctors: ["24×7 उपलब्ध डॉक्टर", "सत्यापित डॉक्टरों से तुरंत वीडियो/ऑडियो परामर्श"],
      emergency: ["आपातकालीन सहायता एवं एसओएस", "लाइव एम्बुलेंस जीपीएस ट्रैकिंग एवं अस्पताल बेड मॉनिटर"],
      homevisit: ["डॉक्टर होम विजिट सेवा", "बुजुर्गों एवं यात्रा में असमर्थ मरीजों के लिए घर पर सेवा"],
      ehr: ["इलेक्ट्रॉनिक स्वास्थ्य रिकॉर्ड (EHR)", "केंद्रीकृत स्वास्थ्य प्रोफाइल एवं डिजिटल नुस्खा संग्रह"],
      medications: ["दवा एवं स्मार्ट रिमाइंडर", "दवा समय सारणी एवं एसएमएस/व्हाट्सएप अलर्ट सिस्टम"],
      architecture: ["सिस्टम आर्किटेक्चर एवं फ्लोचार्ट", "सतत सुधार चक्र, सिस्टम ब्लॉक आरेख एवं कार्यप्रणाली"],
      analytics: ["स्वास्थ्य विश्लेषण एवं एसआईएच विवरण", "ग्रामीण स्वास्थ्य प्रभाव, लागत बचत एवं तकनीकी दृष्टिकोण"]
    }
  }
};

// ==========================================
// 2. VIEW NAVIGATION & TOPBAR
// ==========================================
function navigateTo(viewId) {
  if (!document.getElementById(viewId)) return;
  
  MedTechState.currentView = viewId;
  
  // Update view visibility
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
  
  // Update sidebar active link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.view === viewId);
  });
  
  // Update topbar headers based on locale
  const titles = I18N[MedTechState.language].pageTitles[viewId] || [viewId, ""];
  document.getElementById('pageTitle').textContent = titles[0];
  document.getElementById('pageSub').textContent = titles[1];
  
  // Close mobile sidebar if open
  document.querySelector('.sidebar').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // If entering RPM, ensure canvas is running
  if (viewId === 'rpm') {
    startEcgCanvas();
  }
}

function toggleMobileMenu() {
  document.querySelector('.sidebar').classList.toggle('open');
}

function toggleTheme() {
  MedTechState.isDark = !MedTechState.isDark;
  document.body.classList.toggle('dark', MedTechState.isDark);
  document.getElementById('themeBtn').innerHTML = MedTechState.isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
}

function toggleLanguage() {
  MedTechState.language = MedTechState.language === 'en' ? 'hi' : 'en';
  document.getElementById('langBtn').textContent = MedTechState.language.toUpperCase();
  document.getElementById('brandTagline').textContent = I18N[MedTechState.language].brandTag;
  navigateTo(MedTechState.currentView);
}

function toggleLowBandwidth() {
  MedTechState.isLowBandwidth = !MedTechState.isLowBandwidth;
  document.body.classList.toggle('low-bandwidth', MedTechState.isLowBandwidth);
  const btn = document.getElementById('bandwidthBtn');
  if (MedTechState.isLowBandwidth) {
    btn.style.color = 'var(--amber-500)';
    btn.title = "Low-Bandwidth Mode Active (SMS/IVR Optimized)";
    alert("Low-Bandwidth / Rural Mode Activated:\n• Animations paused\n• Data compression active\n• Fallback SMS/IVR sync enabled");
  } else {
    btn.style.color = '';
    btn.title = "Toggle Low-Bandwidth Mode";
  }
}

// ==========================================
// 3. MODULE 1: REAL-TIME IOT VITALS & ANIMATED ECG CANVAS
// ==========================================
let ecgAnimationId = null;
let ecgX = 0;
let ecgPoints = [];

function initEcgEngine() {
  const canvas = document.getElementById('ecgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 180;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  startEcgCanvas();
}

function startEcgCanvas() {
  const canvas = document.getElementById('ecgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  if (ecgAnimationId) cancelAnimationFrame(ecgAnimationId);
  
  const width = canvas.width;
  const height = canvas.height;
  const midY = height / 2;
  
  let step = 0;
  
  function draw() {
    if (MedTechState.isLowBandwidth) {
      // Keep static display in low data mode
      ctx.fillStyle = '#061121';
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = '#12B8AC';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(width, midY);
      ctx.stroke();
      return;
    }
    
    // Slight translucent wash for phosphor trace trail
    ctx.fillStyle = 'rgba(6, 17, 33, 0.16)';
    ctx.fillRect(0, 0, width, height);
    
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = MedTechState.ecgAnomaly ? '#E11D48' : '#12B8AC';
    ctx.shadowBlur = MedTechState.ecgAnomaly ? 10 : 8;
    ctx.shadowColor = MedTechState.ecgAnomaly ? '#E11D48' : '#12B8AC';
    
    ctx.beginPath();
    ctx.moveTo(ecgX, midY);
    
    // ECG Waveform logic (P-Q-R-S-T sequence)
    step = (step + 1) % 65;
    let dy = 0;
    
    if (step === 10) dy = -12; // P wave
    else if (step === 12) dy = 0;
    else if (step === 20) dy = 10;  // Q dip
    else if (step === 23) dy = MedTechState.ecgAnomaly ? -75 : -52; // R spike
    else if (step === 26) dy = 24;  // S dip
    else if (step === 34) dy = -18; // T wave
    else dy = (Math.random() - 0.5) * 3; // Baseline noise
    
    const targetY = midY + dy;
    const nextX = (ecgX + 3) % width;
    
    // Clear ahead
    ctx.clearRect(nextX, 0, 16, height);
    
    ctx.lineTo(nextX, targetY);
    ctx.stroke();
    
    ecgX = nextX;
    ecgAnimationId = requestAnimationFrame(draw);
  }
  
  draw();
}

function toggleAnomalySimulation() {
  MedTechState.ecgAnomaly = !MedTechState.ecgAnomaly;
  const btn = document.getElementById('anomalyBtn');
  const alertBanner = document.getElementById('vitalsAlertBanner');
  
  if (MedTechState.ecgAnomaly) {
    btn.classList.add('btn-red');
    btn.classList.remove('btn-secondary');
    btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Revert to Normal Vitals';
    
    // Spike vitals
    document.getElementById('vitalHr').innerHTML = '126 <small>BPM</small>';
    document.getElementById('vitalBp').innerHTML = '158/98 <small>mmHg</small>';
    document.getElementById('vitalSpo2').innerHTML = '91 <small>%</small>';
    
    document.getElementById('statusHr').className = 'vital-status status-danger';
    document.getElementById('statusHr').innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Tachycardia Detected';
    
    document.getElementById('statusSpo2').className = 'vital-status status-danger';
    document.getElementById('statusSpo2').innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Hypoxia Warning';
    
    if (alertBanner) {
      alertBanner.style.display = 'block';
      alertBanner.innerHTML = `
        <div style="background: rgba(225,29,72,0.15); border: 1px solid var(--red-500); padding: 12px 18px; border-radius: 12px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <i class="fa-solid fa-bell" style="font-size: 1.4rem; color: var(--red-500); animation: pulseBeacon 1.2s infinite;"></i>
            <div>
              <b style="color: var(--red-500); font-size: 0.92rem;">Critical Vitals Threshold Breached!</b>
              <p style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">Heart Rate: 126 BPM | SpO2: 91% | Automated Triage Escalation Flagged</p>
            </div>
          </div>
          <button class="btn btn-red" onclick="navigateTo('emergency')">🚨 Escalate to SOS</button>
        </div>
      `;
    }
  } else {
    btn.classList.remove('btn-red');
    btn.classList.add('btn-secondary');
    btn.innerHTML = '<i class="fa-solid fa-bolt"></i> Simulate Anomaly Spike';
    
    // Normal vitals
    document.getElementById('vitalHr').innerHTML = '74 <small>BPM</small>';
    document.getElementById('vitalBp').innerHTML = '122/82 <small>mmHg</small>';
    document.getElementById('vitalSpo2').innerHTML = '98 <small>%</small>';
    
    document.getElementById('statusHr').className = 'vital-status status-normal';
    document.getElementById('statusHr').innerHTML = '<i class="fa-solid fa-circle-check"></i> Normal Rhythm';
    
    document.getElementById('statusSpo2').className = 'vital-status status-normal';
    document.getElementById('statusSpo2').innerHTML = '<i class="fa-solid fa-circle-check"></i> Optimal Oxygenation';
    
    if (alertBanner) alertBanner.style.display = 'none';
  }
}

// Continuous subtle realistic vitals drift
setInterval(() => {
  if (MedTechState.ecgAnomaly) return;
  const hrBase = 72 + Math.floor(Math.random() * 5);
  const spo2Base = 97 + Math.floor(Math.random() * 3);
  const elHr = document.getElementById('vitalHr');
  const elSpo2 = document.getElementById('vitalSpo2');
  if (elHr) elHr.innerHTML = `${hrBase} <small>BPM</small>`;
  if (elSpo2) elSpo2.innerHTML = `${spo2Base} <small>%</small>`;
}, 3500);

// ==========================================
// 4. MODULE 2: MULTILINGUAL AI TRIAGE ENGINE
// ==========================================
function initTriageChips() {
  const container = document.getElementById('symptomChipsWrap');
  if (!container) return;
  container.innerHTML = '';
  
  SYMPTOMS_LIST.forEach(sym => {
    const chip = document.createElement('div');
    chip.className = 'symptom-chip';
    chip.textContent = sym;
    chip.onclick = () => chip.classList.toggle('selected');
    container.appendChild(chip);
  });
}

function runAiTriage() {
  const freeText = (document.getElementById('triageFreeText').value || '').toLowerCase();
  const selectedChips = Array.from(document.querySelectorAll('.symptom-chip.selected')).map(c => c.textContent.toLowerCase());
  const combinedInput = freeText + " " + selectedChips.join(" ");
  
  const age = parseInt(document.getElementById('triageAge').value) || 35;
  const duration = document.getElementById('triageDuration').value;
  const comorbidity = document.getElementById('triageComorbidity').value;
  
  if (combinedInput.trim().length < 3 && selectedChips.length === 0) {
    alert("Please describe your symptoms or click at least one symptom chip.");
    return;
  }
  
  // High Urgency / Red Flag Lexicon (English & Hinglish)
  const RED_FLAGS = [
    'chest pain', 'seene me dard', 'chhati me dard', 'heart attack',
    'breathless', 'saans lene me dikkat', 'saans phoolna', 'asthma attack',
    'unconscious', 'behosh', 'chakkr aake girna', 'seizure', 'daura',
    'heavy bleeding', 'khoon nikalna', 'paralysis', 'lakwa', 'poison', 'zehar'
  ];
  
  // Moderate Urgency / Amber Flags
  const AMBER_FLAGS = [
    'high fever', 'tez bukhar', 'pet dard', 'abdominal pain',
    'severe headache', 'tez sirdard', 'vomiting', 'ultiya',
    'fracture', 'haddi tootna', 'elderly', 'unable to walk', 'chakkar'
  ];
  
  let riskScore = 15;
  let isRedFlag = false;
  
  // Check red flags
  RED_FLAGS.forEach(kw => {
    if (combinedInput.includes(kw)) {
      riskScore += 55;
      isRedFlag = true;
    }
  });
  
  // Check amber flags
  AMBER_FLAGS.forEach(kw => {
    if (combinedInput.includes(kw)) riskScore += 22;
  });
  
  // Clinical modifiers
  if (age > 65 || age < 5) riskScore += 12;
  if (comorbidity !== 'none') riskScore += 14;
  if (duration === 'hours') riskScore += 10;
  if (MedTechState.ecgAnomaly) riskScore += 30;
  
  riskScore = Math.min(Math.max(riskScore, 10), 98);
  
  let carePathway = '';
  let badgeColor = '';
  let pathwayHead = '';
  let pathwayDesc = '';
  let targetView = '';
  let ctaText = '';
  
  if (riskScore >= 60 || isRedFlag) {
    carePathway = 'HIGH URGENCY';
    badgeColor = 'var(--red-500)';
    pathwayHead = '🚨 Immediate Emergency Assistance & Ambulance Escalation';
    pathwayDesc = 'High risk indicators detected. Immediate clinical physical intervention recommended. Live ambulance dispatch and hospital emergency team alert is prepared.';
    targetView = 'emergency';
    ctaText = 'Open Emergency SOS Panel';
  } else if (riskScore >= 32) {
    carePathway = 'MODERATE URGENCY';
    badgeColor = 'var(--amber-500)';
    pathwayHead = '🏠 Doctor Home Visit Recommended';
    pathwayDesc = 'Symptoms require hands-on physical assessment, especially for patients unable to travel to a clinic. Request a nearby verified doctor home visit.';
    targetView = 'homevisit';
    ctaText = 'Book Doctor Home Visit';
  } else {
    carePathway = 'LOW URGENCY';
    badgeColor = 'var(--green-500)';
    pathwayHead = '📱 Online Video / Audio Consultation';
    pathwayDesc = 'Symptoms are safe for virtual evaluation. Connect immediately with an available verified doctor for medical guidance and e-prescription.';
    targetView = 'doctors';
    ctaText = 'Consult Available Doctor Now';
  }
  
  // Update Result UI
  const resultCard = document.getElementById('triageResultCard');
  resultCard.className = 'triage-result-card active-result';
  resultCard.style.borderColor = badgeColor;
  
  resultCard.innerHTML = `
    <span class="live-pill" style="background: ${badgeColor}; color: #fff; margin-bottom: 10px;">${carePathway}</span>
    <h4 style="font-size: 1.15rem; color: var(--text-main); margin-bottom: 6px;">${pathwayHead}</h4>
    <div class="triage-meter">
      <div class="triage-meter-bar" style="width: ${riskScore}%; background: ${badgeColor};"></div>
    </div>
    <p style="font-size: 0.88rem; line-height: 1.6; margin-bottom: 14px;">${pathwayDesc}</p>
    
    <div class="risk-axes-grid">
      <div class="risk-axis"><span>Cardiac Risk</span><b style="color: ${riskScore > 50 ? 'var(--red-500)' : 'inherit'}">${Math.min(95, riskScore + 5)}%</b></div>
      <div class="risk-axis"><span>Respiratory</span><b style="color: ${riskScore > 40 ? 'var(--amber-500)' : 'inherit'}">${Math.min(90, riskScore - 5)}%</b></div>
      <div class="risk-axis"><span>Metabolic</span><b>${Math.min(80, riskScore - 15)}%</b></div>
      <div class="risk-axis"><span>Confidence</span><b style="color: var(--teal-500)">92.4%</b></div>
    </div>
    
    <button class="btn btn-primary" style="margin-top: 18px; width: 100%;" onclick="navigateTo('${targetView}')">
      ${ctaText} <i class="fa-solid fa-arrow-right"></i>
    </button>
  `;
  
  // Log into Recent Triage Audit Table
  const tbody = document.getElementById('triageLogTableBody');
  if (tbody) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const complaintSummary = selectedChips[0] || freeText.slice(0, 24) || "General Malaise";
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${timeStr}</td>
      <td><b>${complaintSummary}</b></td>
      <td><span class="status-badge" style="background: ${badgeColor}; color: #fff;">${carePathway.split(' ')[0]}</span></td>
      <td>${pathwayHead.split(' ')[1] || 'Routing'}</td>
      <td>${riskScore}/100</td>
    `;
    tbody.prepend(tr);
  }
}

// ==========================================
// 5. MODULE 3: DOCTOR MARKETPLACE & TELECONSULTATION
// ==========================================
function renderDoctorRoster() {
  const grid = document.getElementById('doctorGrid');
  if (!grid) return;
  
  const filterSpec = document.getElementById('filterSpec')?.value || 'All';
  const filterLang = document.getElementById('filterLang')?.value || 'All';
  const filterFee = parseInt(document.getElementById('filterFee')?.value || 9999);
  const filterMode = document.getElementById('filterMode')?.value || 'All';
  const filterAvail = document.getElementById('filterAvail')?.value || 'All';
  const query = (document.getElementById('globalSearch')?.value || '').toLowerCase();
  
  const filtered = DOCTOR_ROSTER.filter(doc => {
    const matchSpec = filterSpec === 'All' || doc.spec === filterSpec;
    const matchLang = filterLang === 'All' || doc.languages.includes(filterLang);
    const matchFee = doc.fee <= filterFee;
    const matchMode = filterMode === 'All' || doc.modes.includes(filterMode);
    const matchAvail = filterAvail === 'All' || doc.status === 'Available Now';
    const matchQuery = !query || (doc.name + doc.spec + doc.languages.join(' ') + doc.city).toLowerCase().includes(query);
    return matchSpec && matchLang && matchFee && matchMode && matchAvail && matchQuery;
  });
  
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
        <i class="fa-solid fa-user-doctor" style="font-size: 2.5rem; color: var(--text-muted); margin-bottom: 12px;"></i>
        <h4>No doctors matched your filter criteria</h4>
        <p>Try resetting the maximum fee slider or selecting "All Specialties".</p>
      </div>
    `;
    return;
  }
  
  grid.innerHTML = filtered.map(doc => `
    <div class="doctor-card">
      <div class="doctor-top">
        <div class="doctor-avatar">
          <i class="fa-solid fa-user-doctor"></i>
        </div>
        <div class="doctor-info">
          <h4>${doc.name} <i class="fa-solid fa-circle-check doc-verified-icon" title="Registration Verified: ${doc.regNo}"></i></h4>
          <div class="doctor-spec">${doc.spec}</div>
          <div class="doctor-meta"><i class="fa-solid fa-location-dot"></i> ${doc.city}</div>
        </div>
        <span class="status-badge ${doc.status === 'Available Now' ? 'badge-online' : (doc.status === 'In Consultation' ? 'badge-busy' : 'badge-offline')}">
          ${doc.status}
        </span>
      </div>
      
      <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 12px; line-height: 1.45;">
        ${doc.bio}
      </p>
      
      <div class="doctor-stats-row">
        <div><span>Exp</span><b>${doc.exp} yrs</b></div>
        <div><span>Rating</span><b style="color: var(--amber-500);"><i class="fa-solid fa-star"></i> ${doc.rating}</b></div>
        <div><span>Fee</span><b style="color: var(--teal-500);">₹${doc.fee}</b></div>
        <div><span>Languages</span><b>${doc.languages.join(', ')}</b></div>
      </div>
      
      <div class="doctor-actions">
        <button class="btn btn-primary" onclick="startTeleconsultation(${doc.id})">
          <i class="fa-solid fa-video"></i> Consult Now
        </button>
        <button class="btn btn-secondary" onclick="viewDoctorDetails(${doc.id})">
          Profile
        </button>
      </div>
    </div>
  `).join('');
}

function startTeleconsultation(docId) {
  const doc = DOCTOR_ROSTER.find(d => d.id === docId);
  if (!doc) return;
  
  MedTechState.callState.doctor = doc;
  MedTechState.callState.active = true;
  MedTechState.callState.timer = 0;
  
  document.getElementById('callDocName').textContent = doc.name;
  document.getElementById('callDocSpec').textContent = doc.spec + " • " + doc.hospital;
  
  const modal = document.getElementById('videoCallModal');
  modal.classList.add('active');
  
  // Start consultation timer
  if (MedTechState.callState.intervalId) clearInterval(MedTechState.callState.intervalId);
  MedTechState.callState.intervalId = setInterval(() => {
    MedTechState.callState.timer++;
    const m = String(Math.floor(MedTechState.callState.timer / 60)).padStart(2, '0');
    const s = String(MedTechState.callState.timer % 60).padStart(2, '0');
    document.getElementById('callTimerDisplay').textContent = `${m}:${s}`;
  }, 1000);
}

function endTeleconsultation() {
  if (MedTechState.callState.intervalId) clearInterval(MedTechState.callState.intervalId);
  MedTechState.callState.active = false;
  document.getElementById('videoCallModal').classList.remove('active');
  
  // Prompt to view prescription
  if (confirm("Consultation ended. Would you like to generate and download the E-Prescription issued by " + MedTechState.callState.doctor.name + "?")) {
    generatePrescriptionModal();
  }
}

function toggleCallMute() {
  MedTechState.callState.isMuted = !MedTechState.callState.isMuted;
  const btn = document.getElementById('muteBtn');
  btn.classList.toggle('off', MedTechState.callState.isMuted);
  btn.innerHTML = MedTechState.callState.isMuted ? '<i class="fa-solid fa-microphone-slash"></i>' : '<i class="fa-solid fa-microphone"></i>';
}

function toggleCallVideo() {
  MedTechState.callState.isVideoOff = !MedTechState.callState.isVideoOff;
  const btn = document.getElementById('videoBtn');
  btn.classList.toggle('off', MedTechState.callState.isVideoOff);
  btn.innerHTML = MedTechState.callState.isVideoOff ? '<i class="fa-solid fa-video-slash"></i>' : '<i class="fa-solid fa-video"></i>';
}

function sendCallChatMessage() {
  const input = document.getElementById('callChatInput');
  const text = input.value.trim();
  if (!text) return;
  
  const msgContainer = document.getElementById('callChatMessages');
  const pMsg = document.createElement('div');
  pMsg.className = 'chat-bubble patient';
  pMsg.textContent = text;
  msgContainer.appendChild(pMsg);
  input.value = '';
  
  // Simulated Doctor Response after 1.2s
  setTimeout(() => {
    const dMsg = document.createElement('div');
    dMsg.className = 'chat-bubble doctor';
    dMsg.textContent = "Understood. I am reviewing your live vitals stream. I will prescribe medication for symptom relief.";
    msgContainer.appendChild(dMsg);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }, 1200);
}

function viewDoctorDetails(docId) {
  const doc = DOCTOR_ROSTER.find(d => d.id === docId);
  if (!doc) return;
  alert(`Doctor Credentials:\n• Name: ${doc.name}\n• Medical Reg: ${doc.regNo}\n• Hospital: ${doc.hospital}\n• Experience: ${doc.exp} Years\n• Verified by Medical Council of India`);
}

// ==========================================
// 6. MODULE 4: DOCTOR HOME VISIT REQUEST
// ==========================================
function submitHomeVisitRequest(event) {
  event.preventDefault();
  const name = document.getElementById('hvName').value;
  const address = document.getElementById('hvAddress').value;
  const spec = document.getElementById('hvSpec').value;
  
  alert(`✅ Doctor Home Visit Confirmed!\n\nPatient: ${name}\nSpecialist: ${spec}\nLocation: ${address}\n\nNearby verified physician Dr. Anil Deshmukh has accepted the visit. Estimated Arrival: 25 Minutes.\nOTP for Verification: 8492`);
  navigateTo('dashboard');
}

// ==========================================
// 7. MODULE 5: EMERGENCY SOS & AMBULANCE LIVE TRACKER
// ==========================================
function triggerEmergencySos() {
  const confirmSos = confirm("🚨 CONFIRM EMERGENCY SOS DISPATCH?\n\nThis will alert the nearest authorized 108 ambulance service and share your GPS location.");
  if (!confirmSos) return;
  
  navigateTo('emergency');
  
  MedTechState.ambulanceState.active = true;
  MedTechState.ambulanceState.distanceKm = 4.2;
  MedTechState.ambulanceState.etaSeconds = 380;
  
  document.getElementById('ambulanceTrackerCard').style.display = 'block';
  document.getElementById('sosActiveBanner').style.display = 'flex';
  
  const marker = document.getElementById('ambulanceMarker');
  let progress = 0;
  
  if (MedTechState.ambulanceState.intervalId) clearInterval(MedTechState.ambulanceState.intervalId);
  
  MedTechState.ambulanceState.intervalId = setInterval(() => {
    progress += 0.05;
    MedTechState.ambulanceState.distanceKm = Math.max(0.2, (MedTechState.ambulanceState.distanceKm - 0.15)).toFixed(1);
    MedTechState.ambulanceState.etaSeconds = Math.max(30, MedTechState.ambulanceState.etaSeconds - 15);
    
    // Update marker on mock map
    if (marker) {
      const leftPos = Math.min(78, 22 + progress * 55);
      const topPos = Math.min(70, 30 + Math.sin(progress * 3) * 20 + progress * 20);
      marker.style.left = `${leftPos}%`;
      marker.style.top = `${topPos}%`;
    }
    
    document.getElementById('ambDistance').textContent = `${MedTechState.ambulanceState.distanceKm} km`;
    const mins = Math.floor(MedTechState.ambulanceState.etaSeconds / 60);
    const secs = MedTechState.ambulanceState.etaSeconds % 60;
    document.getElementById('ambEta').textContent = `${mins}m ${secs}s`;
    
    if (MedTechState.ambulanceState.distanceKm <= 0.3) {
      clearInterval(MedTechState.ambulanceState.intervalId);
      alert("🚑 Ambulance has arrived at your location!");
    }
  }, 1000);
}

function cancelEmergencySos() {
  if (confirm("Are you sure you want to cancel the active emergency request?")) {
    if (MedTechState.ambulanceState.intervalId) clearInterval(MedTechState.ambulanceState.intervalId);
    MedTechState.ambulanceState.active = false;
    document.getElementById('ambulanceTrackerCard').style.display = 'none';
    document.getElementById('sosActiveBanner').style.display = 'none';
    alert("Emergency SOS dispatch cancelled.");
  }
}

// ==========================================
// 8. MODULE 6: EHR & E-PRESCRIPTION GENERATOR
// ==========================================
function generatePrescriptionModal() {
  const doc = MedTechState.callState.doctor || DOCTOR_ROSTER[0];
  const dateStr = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  
  document.getElementById('rxDoctorName').textContent = doc.name;
  document.getElementById('rxDoctorReg').textContent = `Reg No: ${doc.regNo} | ${doc.hospital}`;
  document.getElementById('rxDate').textContent = dateStr;
  
  document.getElementById('rxModalOverlay').classList.add('active');
}

function closePrescriptionModal() {
  document.getElementById('rxModalOverlay').classList.remove('active');
}

function printPrescription() {
  window.print();
}

// ==========================================
// 9. MODULE 7: MEDICATION & SMART PILL REMINDERS
// ==========================================
function toggleMedicationItem(checkbox, adherenceChange) {
  const parent = checkbox.closest('.med-item-row');
  if (checkbox.checked) {
    parent.style.opacity = '0.5';
    parent.style.textDecoration = 'line-through';
    MedTechState.patientData.adherence = Math.min(100, MedTechState.patientData.adherence + adherenceChange);
  } else {
    parent.style.opacity = '1';
    parent.style.textDecoration = 'none';
    MedTechState.patientData.adherence = Math.max(70, MedTechState.patientData.adherence - adherenceChange);
  }
  document.getElementById('adherenceScore').textContent = `${MedTechState.patientData.adherence}%`;
}

function sendSmsReminderDemo() {
  const phone = document.getElementById('smsPhoneInput').value || "+91 98231 XXXXX";
  alert(`📲 Simulated SMS Sent to ${phone}:\n\n"[MedTechX Alert] Namaste Rameshwar ji, time for your Metformin 500mg (1 tablet after lunch). Please drink a glass of warm water. Stay healthy!"`);
}

// ==========================================
// 10. MODULE 8: SYSTEM ARCHITECTURE & DIAGRAMS (FROM IMAGE 3)
// ==========================================
function switchArchTab(tabIndex) {
  document.querySelectorAll('.arch-tab-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', idx === tabIndex);
  });
  
  document.querySelectorAll('.arch-content-panel').forEach((panel, idx) => {
    panel.classList.toggle('active', idx === tabIndex);
  });
}

// ==========================================
// 11. INITIALIZATION ON DOM CONTENT LOADED
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Init symptom chips
  initTriageChips();
  
  // Render Doctor Roster
  renderDoctorRoster();
  
  // Init ECG Canvas
  initEcgEngine();
  
  // Setup search listeners
  const searchInput = document.getElementById('globalSearch');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      if (MedTechState.currentView !== 'doctors') navigateTo('doctors');
      renderDoctorRoster();
    });
  }
  
  // Setup KPI Counter Animations
  function animateKpis() {
    const kpis = [
      { id: 'kpiDocs', target: 128 },
      { id: 'kpiConsults', target: 742 },
      { id: 'kpiSos', target: 36 },
      { id: 'kpiAccuracy', target: 92, suffix: '%' }
    ];
    
    kpis.forEach(item => {
      const el = document.getElementById(item.id);
      if (!el) return;
      let cur = 0;
      const step = item.target / 35;
      const timer = setInterval(() => {
        cur += step;
        if (cur >= item.target) {
          cur = item.target;
          clearInterval(timer);
        }
        el.textContent = Math.floor(cur) + (item.suffix || '');
      }, 30);
    });
  }
  
  animateKpis();
});
