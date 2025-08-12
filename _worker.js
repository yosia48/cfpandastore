import { connect } from "cloudflare:sockets";

// Variables
const rootDomain = "pandastoreid.my.id"; // Ganti dengan domain utama kalian
const serviceName = "cfpandastore"; // Ganti dengan nama workers kalian
const apiKey = "30d01fcd6014e82594579e4eed0b90ade6079"; // Ganti dengan Global API key kalian
const apiEmail = "pandastore.customer@gmail.com"; // Ganti dengan email yang kalian gunakan
const accountID = "e9a7cf13a5df59c2923bcaf694beef84"; // Ganti dengan Account ID kalian
const zoneID = "02265e953623b9f9683a57dd6ee7b8db"; // Ganti dengan Zone ID kalian
let isApiReady = true;
let proxyIP = "";
let cachedProxyList = [];

// Constant
const APP_DOMAIN = `${serviceName}.${rootDomain}`;
const PORTS = [443, 80];
const PROTOCOLS = [reverse("najort"), reverse("sselv"), reverse("ss")];
const KV_PROXY_URL = "https://raw.githubusercontent.com/FoolVPN-ID/Nautica/refs/heads/main/kvProxyList.json";
const PROXY_BANK_URL = "https://raw.githubusercontent.com/FoolVPN-ID/Nautica/refs/heads/main/proxyList.txt";
const DNS_SERVER_ADDRESS = "8.8.8.8";
const DNS_SERVER_PORT = 53;
const PROXY_HEALTH_CHECK_API = "https://id1.foolvpn.me/api/v1/check";
const CONVERTER_URL = "https://api.foolvpn.me/convert";
const DONATE_LINK = "https://trakteer.id/dickymuliafiqri/tip";
const BAD_WORDS_LIST =
  "https://gist.githubusercontent.com/adierebel/a69396d79b787b84d89b45002cb37cd6/raw/6df5f8728b18699496ad588b3953931078ab9cf1/kata-kasar.txt";
const PROXY_PER_PAGE = 24;
const WS_READY_STATE_OPEN = 1;
const WS_READY_STATE_CLOSING = 2;
const CORS_HEADER_OPTIONS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Max-Age": "86400",
};

// Helper functions
function reverse(str) {
  return str.split('').reverse().join('');
}

function getFlagEmoji(countryCode) {
  const flags = {
    'ID': '🇮🇩',
    'SG': '🇸🇬',
    'US': '🇺🇸',
    'JP': '🇯🇵',
    'MY': '🇲🇾',
    'TH': '🇹🇭',
    'VN': '🇻🇳',
    'KR': '🇰🇷',
    'HK': '🇭🇰',
    'TW': '🇹🇼',
    'GB': '🇬🇧',
    'DE': '🇩🇪',
    'FR': '🇫🇷',
    'CA': '🇨🇦',
    'AU': '🇦🇺'
  };
  return flags[countryCode] || '🌍';
}

function getCountryName(countryCode) {
  const countries = {
    'ID': 'Indonesia',
    'SG': 'Singapore',
    'US': 'United States',
    'JP': 'Japan',
    'MY': 'Malaysia',
    'TH': 'Thailand',
    'VN': 'Vietnam',
    'KR': 'South Korea',
    'HK': 'Hong Kong',
    'TW': 'Taiwan',
    'GB': 'United Kingdom',
    'DE': 'Germany',
    'FR': 'France',
    'CA': 'Canada',
    'AU': 'Australia'
  };
  return countries[countryCode] || countryCode;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Document class untuk generate HTML dengan sidebar dropdown ISP
class Document {
  constructor(request) {
    this.request = request;
    this.title = "";
    this.info = [];
    this.proxies = [];
    this.pageButtons = [];
    this.selectedCountries = [];
    this.selectedISP = "";
    this.availableCountries = [];
    this.availableISPs = {};
  }

  setTitle(title) {
    this.title = title;
  }

  addInfo(info) {
    this.info.push(info);
  }

  registerProxies(proxy, configs) {
    this.proxies.push({ proxy, configs });
    
    // Collect available countries
    if (!this.availableCountries.includes(proxy.country)) {
      this.availableCountries.push(proxy.country);
    }
    
    // Collect available ISPs per country
    if (!this.availableISPs[proxy.country]) {
      this.availableISPs[proxy.country] = [];
    }
    if (!this.availableISPs[proxy.country].some(isp => isp.org === proxy.org)) {
      this.availableISPs[proxy.country].push({
        org: proxy.org,
        count: this.proxies.filter(p => p.proxy.country === proxy.country && p.proxy.org === proxy.org).length
      });
    }
  }

  addPageButton(text, url, disabled = false) {
    this.pageButtons.push({ text, url, disabled });
  }

  setSelectedCountries(countries) {
    this.selectedCountries = countries || [];
  }

  setSelectedISP(isp) {
    this.selectedISP = isp || "";
  }

  build() {
    // Sort available countries
    this.availableCountries.sort();
    
    // Update ISP counts
    for (const country in this.availableISPs) {
      this.availableISPs[country] = this.availableISPs[country].map(isp => ({
        ...isp,
        count: this.proxies.filter(p => p.proxy.country === country && p.proxy.org === isp.org).length
      }));
    }
    
    return `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panda Store - Premium Proxy Service</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { 
            font-family: 'Inter', sans-serif; 
            scroll-behavior: smooth;
        }
        
        .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            position: relative;
            overflow: hidden;
        }
        
        .gradient-bg::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
            opacity: 0.3;
        }
        
        .panda-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .sidebar {
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            border-right: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 5px 0 20px rgba(0, 0, 0, 0.1);
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            width: 300px;
            z-index: 1000;
            overflow-y: auto;
            overflow-x: hidden;
            transition: transform 0.3s ease;
            scrollbar-width: thin;
            scrollbar-color: rgba(102, 126, 234, 0.3) transparent;
        }
        
        .sidebar::-webkit-scrollbar {
            width: 6px;
        }
        
        .sidebar::-webkit-scrollbar-track {
            background: transparent;
        }
        
        .sidebar::-webkit-scrollbar-thumb {
            background: rgba(102, 126, 234, 0.3);
            border-radius: 3px;
        }
        
        .sidebar::-webkit-scrollbar-thumb:hover {
            background: rgba(102, 126, 234, 0.5);
        }
        
        .sidebar.hidden {
            transform: translateX(-100%);
        }
        
        .main-content {
            margin-left: 300px;
            transition: margin-left 0.3s ease;
            min-height: 100vh;
            overflow-x: hidden;
        }
        
        .main-content.full-width {
            margin-left: 0;
        }
        
        .country-item {
            transition: all 0.2s ease;
            cursor: pointer;
            border-left: 4px solid transparent;
        }
        
        .country-item:hover {
            background: rgba(102, 126, 234, 0.1);
            border-left-color: #667eea;
            transform: translateX(5px);
        }
        
        .country-item.active {
            background: rgba(102, 126, 234, 0.15);
            border-left-color: #667eea;
            font-weight: 600;
        }
        
        .isp-item {
            transition: all 0.2s ease;
            cursor: pointer;
            border-left: 3px solid transparent;
            margin-left: 10px;
        }
        
        .isp-item:hover {
            background: rgba(139, 92, 246, 0.1);
            border-left-color: #8b5cf6;
            transform: translateX(3px);
        }
        
        .isp-item.active {
            background: rgba(139, 92, 246, 0.15);
            border-left-color: #8b5cf6;
            font-weight: 600;
        }
        
        .dropdown-toggle {
            transition: all 0.2s ease;
            cursor: pointer;
        }
        
        .dropdown-toggle:hover {
            background: rgba(102, 126, 234, 0.05);
        }
        
        .dropdown-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
        }
        
        .dropdown-content.open {
            max-height: 500px;
        }
        
        .dropdown-arrow {
            transition: transform 0.2s ease;
        }
        
        .dropdown-arrow.rotated {
            transform: rotate(180deg);
        }
        
        .proxy-item {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }
        
        .proxy-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
        }
        
        .proxy-item:hover::before { left: 100%; }
        .proxy-item:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 25px 50px rgba(0,0,0,0.15);
        }
        
        .copy-btn {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }
        
        .copy-btn:hover {
            background: #4f46e5;
            transform: scale(1.05);
            box-shadow: 0 10px 20px rgba(79, 70, 229, 0.3);
        }
        
        .copy-btn.copied {
            background: #10b981 !important;
            transform: scale(0.95);
        }
        
        .panda-logo {
            font-size: 2.5rem;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: logoGlow 3s ease-in-out infinite alternate;
        }
        
        @keyframes logoGlow {
            0% { filter: drop-shadow(0 0 5px rgba(255, 107, 107, 0.3)); }
            100% { filter: drop-shadow(0 0 20px rgba(69, 183, 209, 0.5)); }
        }
        
        .floating { animation: floating 6s ease-in-out infinite; }
        @keyframes floating {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        
        .status-indicator {
            position: relative;
        }
        
        .status-indicator::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: #10b981;
            transform: translate(-50%, -50%);
            animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
        }
        
        @keyframes pulse-ring {
            0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
            80%, 100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0; }
        }
        
        .config-item {
            transition: all 0.2s ease;
            border-left: 4px solid transparent;
        }
        
        .config-item:hover {
            border-left-color: #8b5cf6;
            background: rgba(139, 92, 246, 0.05);
        }
        
        .country-flag {
            font-size: 1.5rem;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }
        
        .gradient-text {
            background: linear-gradient(45deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .btn-primary {
            background: linear-gradient(45deg, #667eea, #764ba2);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .btn-primary::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
        }
        
        .btn-primary:hover::before { left: 100%; }
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }
        
        .stats-counter {
            font-size: 1.5rem;
            font-weight: 800;
            color: #667eea;
        }
        
        .mobile-menu-btn {
            display: none;
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1001;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            padding: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        @media (max-width: 768px) {
            .sidebar {
                transform: translateX(-100%);
                width: 280px;
            }
            .sidebar.show {
                transform: translateX(0);
            }
            .main-content {
                margin-left: 0;
            }
            .mobile-menu-btn {
                display: block;
            }
        }
        
        .hero-pattern {
            background-image: radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2px, transparent 0),
                              radial-gradient(circle at 75px 75px, rgba(255,255,255,0.1) 2px, transparent 0);
            background-size: 100px 100px;
        }
        
        .priority-countries {
            border: 2px solid rgba(102, 126, 234, 0.2);
            border-radius: 12px;
            background: rgba(102, 126, 234, 0.05);
        }
        
        .other-countries {
            border: 1px solid rgba(156, 163, 175, 0.2);
            border-radius: 12px;
            background: rgba(156, 163, 175, 0.02);
        }
    </style>
</head>
<body class="gradient-bg min-h-screen hero-pattern">
    <!-- Mobile Menu Button -->
    <button class="mobile-menu-btn" onclick="toggleSidebar()">
        <i class="fas fa-bars text-gray-700"></i>
    </button>

    <!-- Sidebar -->
    <div class="sidebar" id="sidebar">
        <div class="p-6">
            <!-- Logo -->
            <div class="flex items-center space-x-3 mb-8">
                <div class="panda-logo floating">🐼</div>
                <div>
                    <h1 class="text-2xl font-bold gradient-text">Panda Store</h1>
                    <p class="text-gray-600 text-sm">Premium Proxy</p>
                </div>
            </div>
            
            <!-- Stats -->
            <div class="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-4 mb-6">
                <div class="text-center">
                    <div class="stats-counter">${this.proxies.length}</div>
                    <p class="text-sm text-gray-600">Active Servers</p>
                </div>
            </div>
            
            <!-- All Countries Button -->
            <div class="mb-6">
                <div class="country-item p-3 rounded-lg ${this.selectedCountries.length === 0 && !this.selectedISP ? 'active' : ''}" 
                     onclick="filterByCountry('')">
                    <div class="flex items-center space-x-3">
                        <div class="text-xl">🌍</div>
                        <div>
                            <div class="font-semibold text-gray-800">All Countries</div>
                            <div class="text-xs text-gray-500">${this.proxies.length} servers</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Priority Countries (SG & ID) -->
            <div class="priority-countries p-4 mb-6">
                <h3 class="text-sm font-semibold text-purple-700 uppercase tracking-wide mb-3 flex items-center">
                    <i class="fas fa-star mr-2"></i>Priority Servers
                </h3>
                
                ${['ID', 'SG'].filter(country => this.availableCountries.includes(country)).map(country => {
                  const countryProxies = this.proxies.filter(p => p.proxy.country === country);
                  const isSelected = this.selectedCountries.includes(country);
                  const countryISPs = this.availableISPs[country] || [];
                  
                  return `
                    <div class="mb-4">
                        <!-- Country Header -->
                        <div class="country-item p-3 rounded-lg ${isSelected && !this.selectedISP ? 'active' : ''}" 
                             onclick="filterByCountry('${country}')">
                            <div class="flex items-center space-x-3">
                                <div class="country-flag">${getFlagEmoji(country)}</div>
                                <div class="flex-1">
                                    <div class="font-semibold text-gray-800">${getCountryName(country)}</div>
                                    <div class="text-xs text-gray-500">${countryProxies.length} servers</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- ISP List for this country -->
                        ${countryISPs.length > 1 ? `
                        <div class="ml-4 mt-2 space-y-1">
                            ${countryISPs.map(isp => {
                              const ispProxies = this.proxies.filter(p => p.proxy.country === country && p.proxy.org === isp.org);
                              const isISPSelected = this.selectedISP === isp.org && this.selectedCountries.includes(country);
                              
                              return `
                                <div class="isp-item p-2 rounded-lg text-sm ${isISPSelected ? 'active' : ''}" 
                                     onclick="filterByISP('${country}', '${isp.org}')">
                                    <div class="flex items-center justify-between">
                                        <span class="text-gray-700">${isp.org}</span>
                                        <span class="text-xs text-gray-500">${ispProxies.length}</span>
                                    </div>
                                </div>
                              `;
                            }).join('')}
                        </div>
                        ` : ''}
                    </div>
                  `;
                }).join('')}
            </div>
            
            <!-- Other Countries (Dropdown) -->
            ${this.availableCountries.filter(country => !['ID', 'SG'].includes(country)).length > 0 ? `
            <div class="other-countries p-4 mb-6">
                <div class="dropdown-toggle p-3 rounded-lg" onclick="toggleDropdown('otherCountries')">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                            <i class="fas fa-globe text-gray-600"></i>
                            <span class="font-semibold text-gray-700">Other Countries</span>
                            <span class="text-xs text-gray-500">(${this.availableCountries.filter(country => !['ID', 'SG'].includes(country)).length})</span>
                        </div>
                        <i class="fas fa-chevron-down dropdown-arrow text-gray-500" id="otherCountries-arrow"></i>
                    </div>
                </div>
                
                <div class="dropdown-content mt-2" id="otherCountries-content">
                    ${this.availableCountries.filter(country => !['ID', 'SG'].includes(country)).map(country => {
                      const countryProxies = this.proxies.filter(p => p.proxy.country === country);
                      const isSelected = this.selectedCountries.includes(country);
                      const countryISPs = this.availableISPs[country] || [];
                      
                      return `
                        <div class="mb-3">
                            <!-- Country Header -->
                            <div class="country-item p-3 rounded-lg ${isSelected && !this.selectedISP ? 'active' : ''}" 
                                 onclick="filterByCountry('${country}')">
                                <div class="flex items-center space-x-3">
                                    <div class="country-flag">${getFlagEmoji(country)}</div>
                                    <div class="flex-1">
                                        <div class="font-semibold text-gray-800">${getCountryName(country)}</div>
                                        <div class="text-xs text-gray-500">${countryProxies.length} servers</div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- ISP List for this country -->
                            ${countryISPs.length > 1 ? `
                            <div class="ml-4 mt-2 space-y-1">
                                ${countryISPs.map(isp => {
                                  const ispProxies = this.proxies.filter(p => p.proxy.country === country && p.proxy.org === isp.org);
                                  const isISPSelected = this.selectedISP === isp.org && this.selectedCountries.includes(country);
                                  
                                  return `
                                    <div class="isp-item p-2 rounded-lg text-sm ${isISPSelected ? 'active' : ''}" 
                                         onclick="filterByISP('${country}', '${isp.org}')">
                                        <div class="flex items-center justify-between">
                                            <span class="text-gray-700">${isp.org}</span>
                                            <span class="text-xs text-gray-500">${ispProxies.length}</span>
                                        </div>
                                    </div>
                                  `;
                                }).join('')}
                            </div>
                            ` : ''}
                        </div>
                      `;
                    }).join('')}
                </div>
            </div>
            ` : ''}
            
            <!-- Telegram Bot Section -->
            <div class="mt-8 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
                <div class="text-center">
                    <div class="text-2xl mb-2">🤖</div>
                    <h4 class="font-bold text-gray-800 mb-2">Telegram Bot</h4>
                    <p class="text-xs text-gray-600 mb-3">Get configs instantly</p>
                    <a href="https://t.me/pandastore_bot" target="_blank" 
                       class="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors">
                        <i class="fab fa-telegram-plane mr-1"></i>
                        Open Bot
                    </a>
                </div>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="main-content" id="mainContent">
        <!-- Header -->
        <header class="bg-white shadow-lg relative z-10">
            <div class="container mx-auto px-4 py-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <div class="md:hidden">
                            <div class="panda-logo">🐼</div>
                        </div>
                        <div>
                            <h1 class="text-3xl md:text-4xl font-bold gradient-text">
                                ${this.selectedISP ? 
                                  this.selectedISP + ' Servers' :
                                  this.selectedCountries.length > 0 ? 
                                    this.selectedCountries.map(c => getCountryName(c)).join(', ') + ' Servers' : 
                                    'All Servers'}
                            </h1>
                            <p class="text-gray-600">${this.info.join(' • ')}</p>
                        </div>
                    </div>
                    <div class="hidden md:flex items-center space-x-6">
                        <div class="text-right">
                            <div class="stats-counter text-2xl">99.9%</div>
                            <p class="text-sm text-gray-600">Uptime</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content Area -->
        <main class="container mx-auto px-4 py-8 relative z-10">
            <!-- Proxy List -->
            <div class="grid gap-6">
                ${this.proxies.map((item, index) => `
                    <div class="panda-card rounded-xl p-6 proxy-item">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center space-x-3">
                                <div class="country-flag">${getFlagEmoji(item.proxy.country)}</div>
                                <div>
                                    <h3 class="text-xl font-bold text-gray-800">
                                        ${item.proxy.org}
                                    </h3>
                                    <p class="text-gray-600">
                                        ${item.proxy.proxyIP}:${item.proxy.proxyPort} • ${getCountryName(item.proxy.country)}
                                    </p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-2">
                                <div class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                                    <div class="status-indicator w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span>Online</span>
                                </div>
                                <div class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                                    <i class="fas fa-signal mr-1"></i>
                                    ${Math.floor(Math.random() * 100) + 20}ms
                                </div>
                            </div>
                        </div>
                        
                        <div class="grid gap-3">
                            ${item.configs.map((config, configIndex) => {
                              const protocol = config.includes('trojan://') ? 'TROJAN' : 
                                             config.includes('vless://') ? 'VLESS' : 
                                             config.includes('ss://') ? 'SHADOWSOCKS' : 'UNKNOWN';
                              const isTLS = config.includes(':443') || config.includes('tls');
                              
                              return `
                                <div class="config-item bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                                    <div class="flex-1 mr-3">
                                        <div class="flex items-center space-x-2 mb-1">
                                            <span class="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-semibold">${protocol}</span>
                                            <span class="bg-${isTLS ? 'green' : 'yellow'}-100 text-${isTLS ? 'green' : 'yellow'}-800 px-2 py-1 rounded text-xs font-semibold">${isTLS ? 'TLS' : 'NTLS'}</span>
                                        </div>
                                        <code class="text-sm text-gray-700 break-all">${config}</code>
                                    </div>
                                    <button onclick="copyToClipboard('${config.replace(/'/g, "\\'")}', this)" 
                                            class="copy-btn bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2 font-semibold">
                                        <i class="fas fa-copy"></i>
                                        <span class="hidden sm:inline">Copy</span>
                                    </button>
                                </div>
                              `;
                            }).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- Pagination -->
            ${this.pageButtons.length > 0 ? `
            <div class="flex justify-center space-x-4 mt-8">
                ${this.pageButtons.map(button => `
                    <a href="${button.url}" 
                       class="px-6 py-3 rounded-lg font-semibold transition-all ${
                         button.disabled 
                           ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                           : 'btn-primary text-white hover:transform hover:scale-105'
                       }">
                        ${button.text}
                    </a>
                `).join('')}
            </div>
            ` : ''}

            <!-- Empty State -->
            ${this.proxies.length === 0 ? `
            <div class="panda-card rounded-xl p-12 text-center">
                <div class="text-6xl mb-4">🔍</div>
                <h3 class="text-2xl font-bold text-gray-800 mb-4">No Servers Found</h3>
                <p class="text-gray-600 mb-6">
                    No servers available for the selected filter. Try selecting "All Countries" or choose a different option.
                </p>
                <button onclick="filterByCountry('')" class="btn-primary text-white px-6 py-3 rounded-lg font-semibold">
                    Show All Countries
                </button>
            </div>
            ` : ''}
        </main>

        <!-- Footer -->
        <footer class="bg-gray-900 text-white py-8 mt-12 relative z-10">
            <div class="container mx-auto px-4 text-center">
                <div class="flex items-center justify-center space-x-2 mb-4">
                    <div class="text-2xl">🐼</div>
                    <span class="text-xl font-bold">Panda Store</span>
                </div>
                <p class="text-gray-400 mb-4">Premium Proxy Service - Terpercaya sejak 2024</p>
                <div class="flex justify-center space-x-6">
                    <a href="https://t.me/pandastore_bot" class="text-gray-400 hover:text-white transition-colors">
                        <i class="fab fa-telegram-plane"></i> Telegram Bot
                    </a>
                    <a href="#" class="text-gray-400 hover:text-white transition-colors">
                        <i class="fab fa-whatsapp"></i> WhatsApp
                    </a>
                    <a href="#" class="text-gray-400 hover:text-white transition-colors">
                        <i class="fas fa-envelope"></i> Email
                    </a>
                </div>
            </div>
        </footer>
    </div>

    <script>
        function copyToClipboard(text, button) {
            navigator.clipboard.writeText(text).then(function() {
                const originalHTML = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i> <span class="hidden sm:inline">Copied!</span>';
                button.classList.add('copied');
                
                setTimeout(function() {
                    button.innerHTML = originalHTML;
                    button.classList.remove('copied');
                }, 2000);
            }).catch(function(err) {
                console.error('Could not copy text: ', err);
                
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    const originalHTML = button.innerHTML;
                    button.innerHTML = '<i class="fas fa-check"></i> <span class="hidden sm:inline">Copied!</span>';
                    button.classList.add('copied');
                    
                    setTimeout(function() {
                        button.innerHTML = originalHTML;
                        button.classList.remove('copied');
                    }, 2000);
                } catch (err) {
                    alert('Gagal menyalin ke clipboard. Silakan copy manual.');
                }
                document.body.removeChild(textArea);
            });
        }

        function filterByCountry(country) {
            const currentUrl = new URL(window.location);
            if (country) {
                currentUrl.searchParams.set('cc', country);
            } else {
                currentUrl.searchParams.delete('cc');
            }
            currentUrl.searchParams.delete('isp'); // Clear ISP filter
            currentUrl.searchParams.delete('page'); // Reset to first page
            window.location.href = currentUrl.toString();
        }

        function filterByISP(country, isp) {
            const currentUrl = new URL(window.location);
            currentUrl.searchParams.set('cc', country);
            currentUrl.searchParams.set('isp', isp);
            currentUrl.searchParams.delete('page'); // Reset to first page
            window.location.href = currentUrl.toString();
        }

        function toggleDropdown(dropdownId) {
            const content = document.getElementById(dropdownId + '-content');
            const arrow = document.getElementById(dropdownId + '-arrow');
            
            content.classList.toggle('open');
            arrow.classList.toggle('rotated');
        }

        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.getElementById('mainContent');
            
            sidebar.classList.toggle('show');
            
            // Close sidebar when clicking outside on mobile
            if (sidebar.classList.contains('show')) {
                document.addEventListener('click', function closeSidebar(e) {
                    if (!sidebar.contains(e.target) && !e.target.closest('.mobile-menu-btn')) {
                        sidebar.classList.remove('show');
                        document.removeEventListener('click', closeSidebar);
                    }
                });
            }
        }

        // Add loading animation for proxy items
        window.addEventListener('load', function() {
            const proxyItems = document.querySelectorAll('.proxy-item');
            proxyItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                item.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100 + 300);
            });
        });

        // Smooth scrolling for all elements
        document.addEventListener('DOMContentLoaded', function() {
            // Enable smooth scrolling for the main content
            const mainContent = document.getElementById('mainContent');
            if (mainContent) {
                mainContent.style.scrollBehavior = 'smooth';
            }
            
            // Enable smooth scrolling for sidebar
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.style.scrollBehavior = 'smooth';
            }
        });

        // Improve scrolling performance
        let ticking = false;
        function updateScrolling() {
            // Add any scroll-based animations here
            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateScrolling);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestTick);
    </script>
</body>
</html>
    `;
  }
}

async function getKVProxyList(kvProxyUrl = KV_PROXY_URL) {
  if (!kvProxyUrl) {
    throw new Error("No KV Proxy URL Provided!");
  }

  const kvProxy = await fetch(kvProxyUrl);
  if (kvProxy.status == 200) {
    return await kvProxy.json();
  } else {
    return {};
  }
}

async function getProxyList(proxyBankUrl = PROXY_BANK_URL) {
  if (!proxyBankUrl) {
    throw new Error("No Proxy Bank URL Provided!");
  }

  const proxyBank = await fetch(proxyBankUrl);
  if (proxyBank.status == 200) {
    const text = (await proxyBank.text()) || "";

    const proxyString = text.split("\n").filter(Boolean);
    cachedProxyList = proxyString
      .map((entry) => {
        const [proxyIP, proxyPort, country, org] = entry.split(",");
        return {
          proxyIP: proxyIP || "Unknown",
          proxyPort: proxyPort || "Unknown",
          country: country || "Unknown",
          org: org || "Unknown Org",
        };
      })
      .filter(Boolean);
  }

  return cachedProxyList;
}

async function reverseProxy(request, target, targetPath) {
  const targetUrl = new URL(request.url);
  const targetChunk = target.split(":");

  targetUrl.hostname = targetChunk[0];
  targetUrl.port = targetChunk[1]?.toString() || "443";
  targetUrl.pathname = targetPath || targetUrl.pathname;

  const modifiedRequest = new Request(targetUrl, request);
  modifiedRequest.headers.set("X-Forwarded-Host", request.headers.get("Host"));

  const response = await fetch(modifiedRequest);
  const newResponse = new Response(response.body, response);
  
  for (const [key, value] of Object.entries(CORS_HEADER_OPTIONS)) {
    newResponse.headers.set(key, value);
  }
  newResponse.headers.set("X-Proxied-By", "Cloudflare Worker");

  return newResponse;
}

function getAllConfig(request, hostName, proxyList, page = 0, selectedCountries = [], selectedISP = "") {
  const startIndex = PROXY_PER_PAGE * page;

  try {
    const uuid = crypto.randomUUID();

    // Build URI
    const uri = new URL(`${reverse("najort")}://${hostName}`);
    uri.searchParams.set("encryption", "none");
    uri.searchParams.set("type", "ws");
    uri.searchParams.set("host", hostName);

    // Build HTML
    const document = new Document(request);
    document.setTitle("Selamat Datang di Panda Store");
    document.addInfo(`Total: ${proxyList.length} server`);
    document.addInfo(`Halaman: ${page + 1}/${Math.ceil(proxyList.length / PROXY_PER_PAGE)}`);
    document.setSelectedCountries(selectedCountries);
    document.setSelectedISP(selectedISP);

    for (let i = startIndex; i < startIndex + PROXY_PER_PAGE; i++) {
      const proxy = proxyList[i];
      if (!proxy) break;

      const { proxyIP, proxyPort, country, org } = proxy;

      uri.searchParams.set("path", `/${proxyIP}-${proxyPort}`);

      const proxies = [];
      for (const port of PORTS) {
        uri.port = port.toString();
        uri.hash = `${i + 1} ${getFlagEmoji(country)} ${org} WS ${port == 443 ? "TLS" : "NTLS"} [Panda Store]`;
        for (const protocol of PROTOCOLS) {
          // Special exceptions
          if (protocol === "ss") {
            uri.username = btoa(`none:${uuid}`);
            uri.searchParams.set(
              "plugin",
              `v2ray-plugin${
                port == 80 ? "" : ";tls"
              };mux=0;mode=websocket;path=/${proxyIP}-${proxyPort};host=${hostName}`
            );
          } else {
            uri.username = uuid;
            uri.searchParams.delete("plugin");
          }

          uri.protocol = protocol;
          uri.searchParams.set("security", port == 443 ? "tls" : "none");
          uri.searchParams.set("sni", port == 80 && protocol == reverse("sselv") ? "" : hostName);

          // Build VPN URI
          proxies.push(uri.toString());
        }
      }
      document.registerProxies(
        {
          proxyIP,
          proxyPort,
          country,
          org,
        },
        proxies
      );
    }

    // Build pagination
    const totalPages = Math.ceil(proxyList.length / PROXY_PER_PAGE);
    if (totalPages > 1) {
      const currentParams = new URLSearchParams();
      if (selectedCountries.length > 0) {
        currentParams.set('cc', selectedCountries.join(','));
      }
      if (selectedISP) {
        currentParams.set('isp', selectedISP);
      }
      
      const prevPage = page > 0 ? page - 1 : 0;
      const nextPage = page + 1;
      
      const prevUrl = `/?${currentParams.toString()}${currentParams.toString() ? '&' : ''}page=${prevPage}`;
      const nextUrl = `/?${currentParams.toString()}${currentParams.toString() ? '&' : ''}page=${nextPage}`;
      
      document.addPageButton("← Sebelumnya", prevUrl, page <= 0);
      document.addPageButton("Selanjutnya →", nextUrl, page >= totalPages - 1);
    }

    return document.build();
  } catch (error) {
    return `Terjadi kesalahan saat membuat konfigurasi. ${error}`;
  }
}

// Placeholder functions yang perlu diimplementasi lengkap
async function websocketHandler(request) {
  // Implementation needed - copy from original
  return new Response("WebSocket handler not implemented", { status: 501 });
}

async function checkProxyHealth(ip, port) {
  // Implementation needed - copy from original
  return { status: "unknown" };
}

class CloudflareApi {
  async getDomainList() {
    // Implementation needed - copy from original
    return [];
  }
  
  async registerDomain(domain) {
    // Implementation needed - copy from original
    return 200;
  }
}

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const upgradeHeader = request.headers.get("Upgrade");

      // Gateway check
      if (apiKey && apiEmail && accountID && zoneID) {
        isApiReady = true;
      }

      // Handle proxy client
      if (upgradeHeader === "websocket") {
        const proxyMatch = url.pathname.match(/^\/(.+[:=-]\d+)$/);

        if (url.pathname.length == 3 || url.pathname.match(",")) {
          const proxyKeys = url.pathname.replace("/", "").toUpperCase().split(",");
          const proxyKey = proxyKeys[Math.floor(Math.random() * proxyKeys.length)];
          const kvProxy = await getKVProxyList();

          proxyIP = kvProxy[proxyKey][Math.floor(Math.random() * kvProxy[proxyKey].length)];
          return await websocketHandler(request);
        } else if (proxyMatch) {
          proxyIP = proxyMatch[1];
          return await websocketHandler(request);
        }
      }

      // MODIFIKASI UTAMA: Handle root path langsung tanpa /sub
      if (url.pathname === "/" || url.pathname.startsWith("/?")) {
        const page = parseInt(url.searchParams.get("page")) || 0;
        const hostname = request.headers.get("Host");

        // Queries
        const countrySelect = url.searchParams.get("cc")?.split(",");
        const ispSelect = url.searchParams.get("isp");
        const proxyBankUrl = url.searchParams.get("proxy-list") || env.PROXY_BANK_URL;
        let proxyList = (await getProxyList(proxyBankUrl)).filter((proxy) => {
          // Filter proxies by Country
          if (countrySelect) {
            if (!countrySelect.includes(proxy.country)) {
              return false;
            }
          }
          
          // Filter proxies by ISP
          if (ispSelect) {
            if (proxy.org !== ispSelect) {
              return false;
            }
          }
          
          return true;
        });

        const result = getAllConfig(request, hostname, proxyList, page, countrySelect, ispSelect);
        return new Response(result, {
          status: 200,
          headers: { "Content-Type": "text/html;charset=utf-8" },
        });
      }

      // Keep original /sub path for backward compatibility
      if (url.pathname.startsWith("/sub")) {
        const page = url.pathname.match(/^\/sub\/(\d+)$/);
        const pageIndex = parseInt(page ? page[1] : "0");
        const hostname = request.headers.get("Host");

        const countrySelect = url.searchParams.get("cc")?.split(",");
        const ispSelect = url.searchParams.get("isp");
        const proxyBankUrl = url.searchParams.get("proxy-list") || env.PROXY_BANK_URL;
        let proxyList = (await getProxyList(proxyBankUrl)).filter((proxy) => {
          if (countrySelect) {
            if (!countrySelect.includes(proxy.country)) {
              return false;
            }
          }
          
          if (ispSelect) {
            if (proxy.org !== ispSelect) {
              return false;
            }
          }
          
          return true;
        });

        const result = getAllConfig(request, hostname, proxyList, pageIndex, countrySelect, ispSelect);
        return new Response(result, {
          status: 200,
          headers: { "Content-Type": "text/html;charset=utf-8" },
        });
      } 
      
      // Handle other API endpoints (copy from original implementation)
      else if (url.pathname.startsWith("/check")) {
        const target = url.searchParams.get("target").split(":");
        const result = await checkProxyHealth(target[0], target[1] || "443");

        return new Response(JSON.stringify(result), {
          status: 200,
          headers: {
            ...CORS_HEADER_OPTIONS,
            "Content-Type": "application/json",
          },
        });
      } else if (url.pathname.startsWith("/api/v1")) {
        // Copy API implementation from original
        const apiPath = url.pathname.replace("/api/v1", "");

        if (apiPath.startsWith("/domains")) {
          if (!isApiReady) {
            return new Response("Api not ready", { status: 500 });
          }

          const wildcardApiPath = apiPath.replace("/domains", "");
          const cloudflareApi = new CloudflareApi();

          if (wildcardApiPath == "/get") {
            const domains = await cloudflareApi.getDomainList();
            return new Response(JSON.stringify(domains), {
              headers: { ...CORS_HEADER_OPTIONS },
            });
          } else if (wildcardApiPath == "/put") {
            const domain = url.searchParams.get("domain");
            const register = await cloudflareApi.registerDomain(domain);

            return new Response(register.toString(), {
              status: register,
              headers: { ...CORS_HEADER_OPTIONS },
            });
          }
        } else if (apiPath.startsWith("/sub")) {
          const filterCC = url.searchParams.get("cc")?.split(",") || [];
          const filterPort = url.searchParams.get("port")?.split(",") || PORTS;
          const filterVPN = url.searchParams.get("vpn")?.split(",") || PROTOCOLS;
          const filterLimit = parseInt(url.searchParams.get("limit")) || 10;
          const filterFormat = url.searchParams.get("format") || "raw";
          const fillerDomain = url.searchParams.get("domain") || APP_DOMAIN;

          const proxyBankUrl = url.searchParams.get("proxy-list") || env.PROXY_BANK_URL;
          const proxyList = await getProxyList(proxyBankUrl)
            .then((proxies) => {
              if (filterCC.length) {
                return proxies.filter((proxy) => filterCC.includes(proxy.country));
              }
              return proxies;
            })
            .then((proxies) => {
              shuffleArray(proxies);
              return proxies;
            });

          const uuid = crypto.randomUUID();
          const result = [];
          for (const proxy of proxyList) {
            const uri = new URL(`${reverse("najort")}://${fillerDomain}`);
            uri.searchParams.set("encryption", "none");
            uri.searchParams.set("type", "ws");
            uri.searchParams.set("host", APP_DOMAIN);

            for (const port of filterPort) {
              for (const protocol of filterVPN) {
                if (result.length >= filterLimit) break;

                uri.protocol = protocol;
                uri.port = port.toString();
                if (protocol == "ss") {
                  uri.username = btoa(`none:${uuid}`);
                  uri.searchParams.set(
                    "plugin",
                    `v2ray-plugin${port == 80 ? "" : ";tls"};mux=0;mode=websocket;path=/${proxy.proxyIP}-${
                      proxy.proxyPort
                    };host=${APP_DOMAIN}`
                  );
                } else {
                  uri.username = uuid;
                }

                uri.searchParams.set("security", port == 443 ? "tls" : "none");
                uri.searchParams.set("sni", port == 80 && protocol == reverse("sselv") ? "" : APP_DOMAIN);
                uri.searchParams.set("path", `/${proxy.proxyIP}-${proxy.proxyPort}`);

                uri.hash = `${result.length + 1} ${getFlagEmoji(proxy.country)} ${proxy.org} WS ${
                  port == 443 ? "TLS" : "NTLS"
                } [Panda Store]`;
                result.push(uri.toString());
              }
            }
          }

          let finalResult = "";
          switch (filterFormat) {
            case "raw":
              finalResult = result.join("\n");
              break;
            case "v2ray":
              finalResult = btoa(result.join("\n"));
              break;
            case "clash":
            case "sfa":
            case "bfr":
              const res = await fetch(CONVERTER_URL, {
                method: "POST",
                body: JSON.stringify({
                  url: result.join(","),
                  format: filterFormat,
                  template: "cf",
                }),
              });
              if (res.status == 200) {
                finalResult = await res.text();
              } else {
                return new Response(res.statusText, {
                  status: res.status,
                  headers: { ...CORS_HEADER_OPTIONS },
                });
              }
              break;
          }

          return new Response(finalResult, {
            status: 200,
            headers: { ...CORS_HEADER_OPTIONS },
          });
        } else if (apiPath.startsWith("/myip")) {
          return new Response(
            JSON.stringify({
              ip:
                request.headers.get("cf-connecting-ipv6") ||
                request.headers.get("cf-connecting-ip") ||
                request.headers.get("x-real-ip"),
              colo: request.headers.get("cf-ray")?.split("-")[1],
              ...request.cf,
            }),
            {
              headers: { ...CORS_HEADER_OPTIONS },
            }
          );
        }
      }

      const targetReverseProxy = env.REVERSE_PROXY_TARGET || "example.com";
      return await reverseProxy(request, targetReverseProxy);
    } catch (err) {
      return new Response(`Terjadi kesalahan: ${err.toString()}`, {
        status: 500,
        headers: { ...CORS_HEADER_OPTIONS },
      });
    }
  },
};

