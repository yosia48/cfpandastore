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

// Helper functions (implementasi lengkap diperlukan)
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
    'TW': '🇹🇼'
  };
  return flags[countryCode] || '🌍';
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Document class untuk generate HTML
class Document {
  constructor(request) {
    this.request = request;
    this.title = "";
    this.info = [];
    this.proxies = [];
    this.pageButtons = [];
  }

  setTitle(title) {
    this.title = title;
  }

  addInfo(info) {
    this.info.push(info);
  }

  registerProxies(proxy, configs) {
    this.proxies.push({ proxy, configs });
  }

  addPageButton(text, url, disabled = false) {
    this.pageButtons.push({ text, url, disabled });
  }

  build() {
    return `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panda Store - Premium Proxy Service</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .panda-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .proxy-item {
            transition: all 0.3s ease;
        }
        .proxy-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .copy-btn {
            transition: all 0.2s ease;
        }
        .copy-btn:hover {
            background: #4f46e5;
            transform: scale(1.05);
        }
        .panda-logo {
            font-size: 2rem;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
    </style>
</head>
<body class="gradient-bg min-h-screen">
    <!-- Header -->
    <header class="bg-white shadow-lg">
        <div class="container mx-auto px-4 py-6">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <div class="panda-logo">🐼</div>
                    <div>
                        <h1 class="text-3xl font-bold text-gray-800">Panda Store</h1>
                        <p class="text-gray-600">Premium Proxy Service</p>
                    </div>
                </div>
                <div class="hidden md:flex items-center space-x-4">
                    <div class="text-right">
                        <p class="text-sm text-gray-600">${this.info.join(' | ')}</p>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
        <!-- Welcome Section -->
        <div class="panda-card rounded-2xl p-8 mb-8 text-center">
            <h2 class="text-4xl font-bold text-gray-800 mb-4">
                Selamat Datang di <span class="text-purple-600">Panda Store</span>
            </h2>
            <p class="text-gray-600 text-lg mb-6">
                Layanan proxy premium dengan kualitas terbaik dan kecepatan tinggi
            </p>
            <div class="flex flex-wrap justify-center gap-4">
                <div class="bg-green-100 text-green-800 px-4 py-2 rounded-full">
                    <i class="fas fa-shield-alt mr-2"></i>Aman & Terpercaya
                </div>
                <div class="bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                    <i class="fas fa-rocket mr-2"></i>Kecepatan Tinggi
                </div>
                <div class="bg-purple-100 text-purple-800 px-4 py-2 rounded-full">
                    <i class="fas fa-globe mr-2"></i>Server Global
                </div>
            </div>
        </div>

        <!-- Proxy List -->
        <div class="grid gap-6">
            ${this.proxies.map((item, index) => `
                <div class="panda-card rounded-xl p-6 proxy-item">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center space-x-3">
                            <div class="text-2xl">${getFlagEmoji(item.proxy.country)}</div>
                            <div>
                                <h3 class="text-xl font-semibold text-gray-800">
                                    ${item.proxy.org}
                                </h3>
                                <p class="text-gray-600">
                                    ${item.proxy.proxyIP}:${item.proxy.proxyPort} • ${item.proxy.country}
                                </p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                <i class="fas fa-circle text-green-500 mr-1"></i>Online
                            </span>
                        </div>
                    </div>
                    
                    <div class="grid gap-3">
                        ${item.configs.map((config, configIndex) => `
                            <div class="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                                <div class="flex-1 mr-4">
                                    <code class="text-sm text-gray-700 break-all">${config}</code>
                                </div>
                                <button onclick="copyToClipboard('${config.replace(/'/g, "\\'")}', this)" 
                                        class="copy-btn bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2">
                                    <i class="fas fa-copy"></i>
                                    <span>Copy</span>
                                </button>
                            </div>
                        `).join('')}
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
                       : 'bg-purple-600 text-white hover:bg-purple-700 hover:transform hover:scale-105'
                   }">
                    ${button.text}
                </a>
            `).join('')}
        </div>
        ` : ''}

        <!-- Features Section -->
        <div class="grid md:grid-cols-3 gap-6 mt-12">
            <div class="panda-card rounded-xl p-6 text-center">
                <div class="text-4xl mb-4">🚀</div>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">Kecepatan Tinggi</h3>
                <p class="text-gray-600">Server premium dengan bandwidth unlimited untuk pengalaman browsing terbaik</p>
            </div>
            <div class="panda-card rounded-xl p-6 text-center">
                <div class="text-4xl mb-4">🔒</div>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">Keamanan Terjamin</h3>
                <p class="text-gray-600">Enkripsi tingkat militer melindungi data dan privasi Anda</p>
            </div>
            <div class="panda-card rounded-xl p-6 text-center">
                <div class="text-4xl mb-4">🌍</div>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">Server Global</h3>
                <p class="text-gray-600">Akses server di berbagai negara untuk konten global tanpa batas</p>
            </div>
        </div>

        <!-- Telegram Bot Section -->
        <div class="panda-card rounded-xl p-8 mt-8 text-center">
            <div class="text-5xl mb-4">🤖</div>
            <h3 class="text-2xl font-bold text-gray-800 mb-4">Bot Telegram Panda Store</h3>
            <p class="text-gray-600 mb-6">
                Dapatkan konfigurasi proxy langsung melalui Telegram Bot kami! 
                Mudah, cepat, dan tersedia 24/7.
            </p>
            <a href="https://t.me/pandastore_bot" target="_blank" 
               class="inline-flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all hover:transform hover:scale-105">
                <i class="fab fa-telegram-plane"></i>
                <span>Buka Bot Telegram</span>
            </a>
        </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-8 mt-12">
        <div class="container mx-auto px-4 text-center">
            <div class="flex items-center justify-center space-x-2 mb-4">
                <div class="text-2xl">🐼</div>
                <span class="text-xl font-bold">Panda Store</span>
            </div>
            <p class="text-gray-400 mb-4">Premium Proxy Service - Terpercaya sejak 2024</p>
            <div class="flex justify-center space-x-6">
                <a href="#" class="text-gray-400 hover:text-white transition-colors">
                    <i class="fab fa-telegram-plane"></i> Telegram
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

    <script>
        function copyToClipboard(text, button) {
            navigator.clipboard.writeText(text).then(function() {
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i> <span>Copied!</span>';
                button.classList.add('bg-green-600');
                button.classList.remove('bg-purple-600');
                
                setTimeout(function() {
                    button.innerHTML = originalText;
                    button.classList.remove('bg-green-600');
                    button.classList.add('bg-purple-600');
                }, 2000);
            }).catch(function(err) {
                console.error('Could not copy text: ', err);
                alert('Gagal menyalin ke clipboard');
            });
        }

        // Add smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Add loading animation
        window.addEventListener('load', function() {
            document.querySelectorAll('.proxy-item').forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    item.style.transition = 'all 0.5s ease';
                    
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                }, index * 100);
            });
        });
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

function getAllConfig(request, hostName, proxyList, page = 0) {
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
    document.setTitle("Selamat Datang di <span class='text-purple-600 font-semibold'>Panda Store</span>");
    document.addInfo(`Total: ${proxyList.length}`);
    document.addInfo(`Halaman: ${page + 1}/${Math.ceil(proxyList.length / PROXY_PER_PAGE)}`);

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
      document.addPageButton("← Sebelumnya", `/?page=${page > 0 ? page - 1 : 0}`, page <= 0);
      document.addPageButton("Selanjutnya →", `/?page=${page + 1}`, page >= totalPages - 1);
    }

    return document.build();
  } catch (error) {
    return `Terjadi kesalahan saat membuat konfigurasi. ${error}`;
  }
}

// Placeholder functions yang perlu diimplementasi lengkap
async function websocketHandler(request) {
  // Implementation needed
  return new Response("WebSocket handler not implemented", { status: 501 });
}

async function checkProxyHealth(ip, port) {
  // Implementation needed
  return { status: "unknown" };
}

class CloudflareApi {
  async getDomainList() {
    // Implementation needed
    return [];
  }
  
  async registerDomain(domain) {
    // Implementation needed
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
        const proxyBankUrl = url.searchParams.get("proxy-list") || env.PROXY_BANK_URL;
        let proxyList = (await getProxyList(proxyBankUrl)).filter((proxy) => {
          // Filter proxies by Country
          if (countrySelect) {
            return countrySelect.includes(proxy.country);
          }
          return true;
        });

        const result = getAllConfig(request, hostname, proxyList, page);
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
        const proxyBankUrl = url.searchParams.get("proxy-list") || env.PROXY_BANK_URL;
        let proxyList = (await getProxyList(proxyBankUrl)).filter((proxy) => {
          if (countrySelect) {
            return countrySelect.includes(proxy.country);
          }
          return true;
        });

        const result = getAllConfig(request, hostname, proxyList, pageIndex);
        return new Response(result, {
          status: 200,
          headers: { "Content-Type": "text/html;charset=utf-8" },
        });
      } 
      
      // Handle other API endpoints
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

