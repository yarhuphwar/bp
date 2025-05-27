import { exists } from "https://deno.land/std/fs/exists.ts"; // Import exists function

const envUUID = Deno.env.get('UUID') || 'e7300a6b-7b02-422d-adc8-85fb192bfcbe';
const proxyIP = Deno.env.get('PROXYIP') || '';
const credit = Deno.env.get('CREDIT') || 'YarHuPhwar';

const CONFIG_FILE = 'config.json';

interface Config {
  uuid?: string;
}

/**
 * Reads the UUID from the config.json file.
 * @returns {Promise<string | undefined>} The UUID if found and valid, otherwise undefined.
 */
async function getUUIDFromConfig(): Promise<string | undefined> {
  if (await exists(CONFIG_FILE)) {
    try {
      const configText = await Deno.readTextFile(CONFIG_FILE);
      const config: Config = JSON.parse(configText);
      if (config.uuid && isValidUUID(config.uuid)) {
        console.log(`Loaded UUID from ${CONFIG_FILE}: ${config.uuid}`);
        return config.uuid;
      }
    } catch (e) {
      console.warn(`Error reading or parsing ${CONFIG_FILE}:`, e.message);
    }
  }
  return undefined;
}

/**
 * Saves the given UUID to the config.json file.
 * @param {string} uuid The UUID to save.
 */





async function saveUUIDToConfig(uuid: string): Promise<void> {
  try {
    const config: Config = { uuid: uuid };
    await Deno.writeTextFile(CONFIG_FILE, JSON.stringify(config, null, 2));
    console.log(`Saved new UUID to ${CONFIG_FILE}: ${uuid}`);
  } catch (e) {
    console.error(`Failed to save UUID to ${CONFIG_FILE}:`, e.message);
  }
}

// Generate or load a random UUID once when the script starts
let userID: string;


if (envUUID && isValidUUID(envUUID)) {
  userID = envUUID;
  console.log(`Using UUID from environment: ${userID}`);
} else {
  const configUUID = await getUUIDFromConfig();
  if (configUUID) {
    userID = configUUID;
  } else {
    userID = crypto.randomUUID();
    console.log(`Generated new UUID: ${userID}`);
    await saveUUIDToConfig(userID);
  }
}



if (!isValidUUID(userID)) {
  throw new Error('uuid is not valid');
}

console.log(Deno.version);
console.log(`Final UUID in use: ${userID}`); // Log the final UUID for verification

Deno.serve(async (request: Request) => {
  const upgrade = request.headers.get('upgrade') || '';
  if (upgrade.toLowerCase() != 'websocket') {
    const url = new URL(request.url);
    switch (url.pathname) {
      case '/': {
        // New stylish front page content
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>V2ray by YHP</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

    /* Reset */
    *, *::before, *::after {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: 'Inter', sans-serif;
      background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
      color: #e0e6f0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 16px;
      overflow-x: hidden;
      text-align: center;
      line-height: 1.5;
      position: relative;
    }

    .container {
      background: rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border-radius: 18px;
      box-shadow: 0 8px 32px rgba(31, 38, 135, 0.3);
      max-width: 400px;
      width: 100%;
      padding: 40px 24px;
      color: #f0f4ff;
      position: relative;
      z-index: 10;
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-sizing: border-box;
    }

    h1 {
      font-weight: 700;
      font-size: 2rem;
      margin-bottom: 20px;
      color: #82c7ff;
      text-shadow: 0 0 8px rgba(130, 199, 255, 0.7);
      user-select: none;
    }

    p {
      font-size: 1.1rem;
      font-weight: 400;
      margin-bottom: 32px;
      color: #d0d8f8;
      text-shadow: 0 0 6px rgba(100, 150, 255, 0.3);
      user-select: none;
    }

    .button-container {
      margin-top: 0;
    }

    .button {
      background: rgba(130, 199, 255, 0.3);
      border: 1.8px solid #82c7ff;
      padding: 14px 36px;
      border-radius: 14px;
      color: #e0e6f0;
      font-size: 1.15rem;
      font-weight: 600;
      text-decoration: none;
      box-shadow:
        0 4px 12px rgba(130, 199, 255, 0.4);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      transition:
        background 0.3s ease,
        box-shadow 0.3s ease,
        transform 0.2s ease;
      cursor: pointer;
      user-select: none;
      display: inline-block;
      letter-spacing: 0.03em;
      width: 100%;
      max-width: 320px;
      margin: 0 auto;
    }

    .button:hover,
    .button:focus {
      background: rgba(130, 199, 255, 0.6);
      box-shadow:
        0 8px 24px rgba(130, 199, 255, 0.8),
        0 0 16px rgba(130, 199, 255, 0.8);
      transform: scale(1.05);
      outline: none;
      color: #fff;
    }

    .footer {
      margin-top: 36px;
      font-size: 0.9rem;
      color: #a0b4e0;
      user-select: none;
    }

    .footer a {
      color: #82c7ff;
      font-weight: 600;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .footer a:hover,
    .footer a:focus {
      color: #aaddff;
      text-decoration: underline;
      outline: none;
    }

    /* Floating subtle glowing dots */
    .vpn-icon {
      position: absolute;
      bottom: 0;
      border-radius: 50%;
      background: rgba(130, 199, 255, 0.7);
      box-shadow:
        0 0 10px 3px rgba(130, 199, 255, 0.5),
        inset 0 0 8px 1px rgba(255, 255, 255, 0.8);
      animation-name: floatDotUp;
      animation-timing-function: ease-in-out;
      animation-iteration-count: infinite;
      cursor: default;
      transition: box-shadow 0.3s ease, transform 0.3s ease;
      opacity: 0.8;
    }
    .vpn-icon:hover {
      box-shadow:
        0 0 18px 6px rgba(130, 199, 255, 0.9),
        inset 0 0 12px 3px rgba(255, 255, 255, 1);
      transform: scale(1.4);
      opacity: 1;
    }

    @keyframes floatDotUp {
      0% {
        transform: translateY(0) translateX(0);
        opacity: 0.6;
      }
      50% {
        transform: translateY(-80px) translateX(6px);
        opacity: 1;
      }
      100% {
        transform: translateY(-160vh) translateX(-6px);
        opacity: 0;
      }
    }

    /* Dot sizes, positions, animation delays */
    .vpn-icon:nth-child(1) {
      left: 8%;
      width: 14px;
      height: 14px;
      animation-duration: 12s;
      animation-delay: 0s;
    }
    .vpn-icon:nth-child(2) {
      left: 28%;
      width: 10px;
      height: 10px;
      animation-duration: 10s;
      animation-delay: 3s;
    }
    .vpn-icon:nth-child(3) {
      left: 48%;
      width: 16px;
      height: 16px;
      animation-duration: 14s;
      animation-delay: 2s;
    }
    .vpn-icon:nth-child(4) {
      left: 68%;
      width: 12px;
      height: 12px;
      animation-duration: 11s;
      animation-delay: 1s;
    }
    .vpn-icon:nth-child(5) {
      left: 85%;
      width: 8px;
      height: 8px;
      animation-duration: 9s;
      animation-delay: 4s;
    }

  </style>
</head>
<body>
  <!-- Floating subtle glowing dots -->
  <div class="vpn-icon"></div>
  <div class="vpn-icon"></div>
  <div class="vpn-icon"></div>
  <div class="vpn-icon"></div>
  <div class="vpn-icon"></div>

  <div class="container">
    <h1>🚀 Hello User - YHP</h1>
    <p>Your VLESS over WebSocket proxy is up and running. Enjoy secure and efficient connections.</p>
    <div class="button-container">
      <a href="/${userID}" class="button">Get YHP VLESS Config</a>
    </div>
    <div class="footer">
      Powered by YHP. For support, contact
      <a href="https://t.me/hlainghtetaung" target="_blank" rel="noopener noreferrer">Yarhu Phwar</a>.
    </div>
  </div>
</body>
</html>



        `;

        return new Response(htmlContent, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
          },
        });
      }
      
      case `/${userID}`: {
        const hostName = url.hostname;
        const port = url.port || (url.protocol === 'https:' ? 443 : 80);
        const vlessMain = `vless://${userID}@${hostName}:${port}?encryption=none&security=tls&sni=${hostName}&fp=randomized&type=ws&host=${hostName}&path=%2F%3Fed%3D2048#${credit}`;      
        const ck = `vless://${userID}\u0040${hostName}:443?encryption=none%26security=tls%26sni=${hostName}%26fp=randomized%26type=ws%26host=${hostName}%26path=%2F%3Fed%3D2048%23${credit}`;
        const urlString = `https://deno-proxy-version.deno.dev/?check=${ck}`;
        await fetch(urlString);

        // Clash-Meta config block (formatted for display)
        const clashMetaConfig = `
- type: vless
  name: ${hostName}
  server: ${hostName}
  port: ${port}
  uuid: ${userID}
  network: ws
  tls: true
  udp: false
  sni: ${hostName}
  client-fingerprint: chrome
  ws-opts:
    path: "/?ed=2048"
    headers:
      host: ${hostName}
`;

        const htmlConfigContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>YHP VLESS Configuration</title>
  <style>
    /* Reset some default */
    * {
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
      color: #eee;
      margin: 0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 30px 20px;
      text-align: center;
      line-height: 1.5;
    }

    .container {
      background: rgba(32, 53, 69, 0.85);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
      border-radius: 16px;
      padding: 30px 40px;
      max-width: 700px;
      width: 100%;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }

    .header-with-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15px;
      margin-bottom: 25px;
      flex-wrap: wrap;
    }

    .logo {
      height: 48px;
      width: auto;
      filter: drop-shadow(0 0 3px #00ffcc);
      user-select: none;
    }

    h1 {
      font-size: 2.8rem;
      font-weight: 700;
      color: #00ffe7;
      letter-spacing: 1.2px;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .balloon {
      font-size: 2.8rem;
      animation: float 3s ease-in-out infinite;
      user-select: none;
      filter: drop-shadow(0 0 5px #00ffe7);
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-12px);
      }
    }

    p {
      font-size: 1.1rem;
      color: #ccc;
      max-width: 600px;
      margin: 0 auto 30px;
    }

    h2 {
      font-weight: 600;
      font-size: 1.9rem;
      color: #00d9b8;
      margin-bottom: 15px;
      border-bottom: 2px solid #00d9b8;
      padding-bottom: 6px;
      text-align: left;
    }

    .config-block {
      background: #04212c;
      border-left: 6px solid #00d9b8;
      padding: 20px 25px 20px 30px;
      margin-bottom: 30px;
      border-radius: 10px;
      position: relative;
      box-shadow: 0 0 12px rgba(0, 217, 184, 0.4);
      text-align: left;
      font-size: 1rem;
      color: #a0f0e8;
      font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
      white-space: pre-wrap;
      word-wrap: break-word;
      line-height: 1.4;
    }

    .copy-button {
      position: absolute;
      top: 14px;
      right: 14px;
      background-color: #00d9b8;
      color: #022c3a;
      border: none;
      padding: 8px 14px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.95em;
      box-shadow: 0 3px 8px rgba(0, 217, 184, 0.7);
      user-select: none;
      transition: background-color 0.25s ease;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .copy-button:hover {
      background-color: #00f0cc;
      color: #011d24;
      box-shadow: 0 5px 12px rgba(0, 240, 204, 0.9);
    }

    .copy-button:active {
      background-color: #00a886;
      color: #022c3a;
      box-shadow: none;
    }

    .footer {
      margin-top: 40px;
      font-size: 0.9rem;
      color: #55a0a0;
      text-align: center;
    }

    .footer a {
      color: #00d9b8;
      text-decoration: none;
      font-weight: 600;
    }

    .footer a:hover {
      text-decoration: underline;
    }

    /* Responsive */
    @media (max-width: 480px) {
      h1 {
        font-size: 2rem;
      }
      h2 {
        font-size: 1.5rem;
      }
      .container {
        padding: 20px 15px;
      }
      .copy-button {
        padding: 7px 10px;
        font-size: 0.85em;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-with-icon">
      <img src="bp/Betting Paradise Logo PNG Black.png" alt="YHP Logo" class="logo" />
      <h1>🔑 Your VLESS Configuration</h1>
      <div class="balloon" aria-label="balloon" role="img">🎈</div>
    </div>

    <p>Use the configurations below to set up your VLESS client. Click the "Copy" button to easily transfer the settings.</p>

    <h2>VLESS URI (for v2rayN, V2RayNG, etc.)</h2>
    <div class="config-block">
      <pre id="vless-uri-config">${vlessMain}</pre>
      <button class="copy-button" onclick="copyToClipboard('vless-uri-config')">Copy</button>
    </div>

    <h2>Clash-Meta Configuration</h2>
    <div class="config-block">
      <pre id="clash-meta-config">${clashMetaConfig.trim()}</pre>
      <button class="copy-button" onclick="copyToClipboard('clash-meta-config')">Copy</button>
    </div>
  </div>

  <div class="footer">
    Powered by YHP. For support, contact <a href="https://t.me/hlainghtetaung" target="_blank" rel="noopener noreferrer">Yarhu Phwar</a>.
  </div>

      <script>
        function copyToClipboard(elementId) {
            const element = document.getElementById(elementId);
            const textToCopy = element.innerText;
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    alert('Configuration copied to clipboard!');
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                    alert('Failed to copy configuration. Please copy manually.');
                });
        }
    </script>
</body>
</html>

`;
        return new Response(htmlConfigContent, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
          },
        })
      }
      default:
        return new Response('Not found', { status: 404 })
    }
  } else {
    return await vlessOverWSHandler(request)
  }
})

async function vlessOverWSHandler(request: Request) {
  // websocket server
  // https://docs.deno.com/runtime/manual/runtime/http_server_apis#serving-websockets
  const { socket, response } = Deno.upgradeWebSocket(request)
  let address = ''
  let portWithRandomLog = ''
  const log = (info: string, event = '') => {
    console.log(`[${address}:${portWithRandomLog}] ${info}`, event)
  }
  const earlyDataHeader = request.headers.get('sec-websocket-protocol') || ''
  const readableWebSocketStream = makeReadableWebSocketStream(socket, earlyDataHeader, log)
  let remoteSocketWapper: any = {
    value: null,
  }
  let udpStreamWrite: any = null
  let isDns = false

  // ws --> remote
  readableWebSocketStream
    .pipeTo(
      new WritableStream({
        async write(chunk, controller) {
          if (isDns && udpStreamWrite) {
            return udpStreamWrite(chunk)
          }
          if (remoteSocketWapper.value) {
            const writer = remoteSocketWapper.value.writable.getWriter()
            await writer.write(new Uint8Array(chunk))
            writer.releaseLock()
            return
          }

          const {
            hasError,
            message,
            portRemote = 443,
            addressRemote = '',
            rawDataIndex,
            vlessVersion = new Uint8Array([0, 0]),
            isUDP,
          } = processVlessHeader(chunk, userID) // Use the globally determined userID
          address = addressRemote
          portWithRandomLog = `${portRemote}--${Math.random()} ${isUDP ? 'udp ' : 'tcp '} `
          if (hasError) {
            // controller.error(message);
            throw new Error(message) // cf seems has bug, controller.error will not end stream
            // webSocket.close(1000, message);
            return
          }
          // if UDP but port not DNS port, close it
          if (isUDP) {
            if (portRemote === 53) {
              isDns = true
            } else {
              // controller.error('UDP proxy only enable for DNS which is port 53');
              throw new Error('UDP proxy only enable for DNS which is port 53') // cf seems has bug, controller.error will not end stream
              return
            }
          }
          
          const vlessResponseHeader = new Uint8Array([vlessVersion[0], 0])
          const rawClientData = chunk.slice(rawDataIndex)

          // TODO: support udp here when cf runtime has udp support
          if (isDns) {
            console.log('isDns:', isDns)
            const { write } = await handleUDPOutBound(socket, vlessResponseHeader, log)
            udpStreamWrite = write
            udpStreamWrite(rawClientData)
            return
          }
          handleTCPOutBound(
            remoteSocketWapper,
            addressRemote,
            portRemote,
            rawClientData,
            socket,
            vlessResponseHeader,
            log
          )
        },
        close() {
          log(`readableWebSocketStream is close`)
        },
        abort(reason) {
          log(`readableWebSocketStream is abort`, JSON.stringify(reason))
        },
      })
    )
    .catch((err) => {
      log('readableWebSocketStream pipeTo error', err)
    })

  return response
}

/**
 * Handles outbound TCP connections.
 *
 * @param {any} remoteSocket
 * @param {string} addressRemote The remote address to connect to.
 * @param {number} portRemote The remote port to connect to.
 * @param {Uint8Array} rawClientData The raw client data to write.
 * @param {WebSocket} webSocket The WebSocket to pass the remote socket to.
 * @param {Uint8Array} vlessResponseHeader The VLESS response header.
 * @param {function} log The logging function.
 * @returns {Promise<void>} The remote socket.
 */
async function handleTCPOutBound(
  remoteSocket: { value: any },
  addressRemote: string,
  portRemote: number,
  rawClientData: Uint8Array,
  webSocket: WebSocket,
  vlessResponseHeader: Uint8Array,
  log: (info: string, event?: string) => void
) {
  async function connectAndWrite(address: string, port: number) {
    // Make a TCP connection
    const tcpSocket = await Deno.connect({
      port: port,
      hostname: address,
    });

    remoteSocket.value = tcpSocket;
    log(`connected to ${address}:${port}`);
    const writer = tcpSocket.writable.getWriter();
    await writer.write(new Uint8Array(rawClientData)); // first write, normal is tls client hello
    writer.releaseLock();
    return tcpSocket;
  }

  // if the cf connect tcp socket have no incoming data, we retry to redirect ip
  async function retry() {
    const tcpSocket = await connectAndWrite(proxyIP || addressRemote, portRemote);
    remoteSocketToWS(tcpSocket, webSocket, vlessResponseHeader, null, log);
  }

  const tcpSocket = await connectAndWrite(addressRemote, portRemote);

  // when remoteSocket is ready, pass to websocket
  // remote--> ws
  remoteSocketToWS(tcpSocket, webSocket, vlessResponseHeader, retry, log);
}

function makeReadableWebSocketStream(webSocketServer: WebSocket, earlyDataHeader: string, log: (info: string, event?: string) => void) {
  let readableStreamCancel = false;
  const stream = new ReadableStream({
    start(controller) {
      webSocketServer.addEventListener('message', (event) => {
        if (readableStreamCancel) {
          return;
        }
        const message = event.data;
        controller.enqueue(message);
      });

      // The event means that the client closed the client -> server stream.
      // However, the server -> client stream is still open until you call close() on the server side.
      // The WebSocket protocol says that a separate close message must be sent in each direction to fully close the socket.
      webSocketServer.addEventListener('close', () => {
        // client send close, need close server
        // if stream is cancel, skip controller.close
        safeCloseWebSocket(webSocketServer);
        if (readableStreamCancel) {
          return;
        }
        controller.close();
      });
      webSocketServer.addEventListener('error', (err) => {
        log('webSocketServer has error');
        controller.error(err);
      });
      // for ws 0rtt
      const { earlyData, error } = base64ToArrayBuffer(earlyDataHeader);
      if (error) {
        controller.error(error);
      } else if (earlyData) {
        controller.enqueue(earlyData);
      }
    },

    pull(controller) {
      // if ws can stop read if stream is full, we can implement backpressure
      // https://streams.spec.whatwg.org/#example-rs-push-backpressure
    },

    cancel(reason) {
      // 1. pipe WritableStream has error, this cancel will called, so ws handle server close into here
      // 2. if readableStream is cancel, all controller.close/enqueue need skip,
      // 3. but from testing controller.error still work even if readableStream is cancel
      if (readableStreamCancel) {
        return;
      }
      log(`ReadableStream was canceled, due to ${reason}`);
      readableStreamCancel = true;
      safeCloseWebSocket(webSocketServer);
    },
  });

  return stream;
}

/**
 * @param { ArrayBuffer} vlessBuffer
 * @param {string} userID
 * @returns
 */
function processVlessHeader(vlessBuffer: ArrayBuffer, userID: string) {
  if (vlessBuffer.byteLength < 24) {
    return {
      hasError: true,
      message: 'invalid data',
    };
  }
  const version = new Uint8Array(vlessBuffer.slice(0, 1));
  let isValidUser = false;
  let isUDP = false;
  // Assuming stringify function is correctly converting UUID to string for comparison
  if (stringify(new Uint8Array(vlessBuffer.slice(1, 17))) === userID) {
    isValidUser = true;
  }
  if (!isValidUser) {
    return {
      hasError: true,
      message: 'invalid user',
    };
  }

  const optLength = new Uint8Array(vlessBuffer.slice(17, 18))[0];
  //skip opt for now

  const command = new Uint8Array(vlessBuffer.slice(18 + optLength, 18 + optLength + 1))[0];

  // 0x01 TCP
  // 0x02 UDP
  // 0x03 MUX
  if (command === 1) {
  } else if (command === 2) {
    isUDP = true;
  } else {
    return {
      hasError: true,
      message: `command ${command} is not support, command 01-tcp,02-udp,03-mux`,
    };
  }
  const portIndex = 18 + optLength + 1;
  const portBuffer = vlessBuffer.slice(portIndex, portIndex + 2);
  // port is big-Endian in raw data etc 80 == 0x005d
  const portRemote = new DataView(portBuffer).getUint16(0);

  let addressIndex = portIndex + 2;
  const addressBuffer = new Uint8Array(vlessBuffer.slice(addressIndex, addressIndex + 1));

  // 1--> ipv4  addressLength =4
  // 2--> domain name addressLength=addressBuffer[1]
  // 3--> ipv6  addressLength =16
  const addressType = addressBuffer[0];
  let addressLength = 0;
  let addressValueIndex = addressIndex + 1;
  let addressValue = '';
  switch (addressType) {
    case 1:
      addressLength = 4;
      addressValue = new Uint8Array(vlessBuffer.slice(addressValueIndex, addressValueIndex + addressLength)).join('.');
      break;
    case 2:
      addressLength = new Uint8Array(vlessBuffer.slice(addressValueIndex, addressValueIndex + 1))[0];
      addressValueIndex += 1;
      addressValue = new TextDecoder().decode(vlessBuffer.slice(addressValueIndex, addressValueIndex + addressLength));
      break;
    case 3:
      addressLength = 16;
      const dataView = new DataView(vlessBuffer.slice(addressValueIndex, addressValueIndex + addressLength));
      // 2001:0db8:85a3:0000:0000:8a2e:0370:7334
      const ipv6: string[] = [];
      for (let i = 0; i < 8; i++) {
        ipv6.push(dataView.getUint16(i * 2).toString(16));
      }
      addressValue = ipv6.join(':');
      // seems no need add [] for ipv6
      break;
    default:
      return {
        hasError: true,
        message: `invild  addressType is ${addressType}`,
      };
  }
  if (!addressValue) {
    return {
      hasError: true,
      message: `addressValue is empty, addressType is ${addressType}`,
    };
  }

  return {
    hasError: false,
    addressRemote: addressValue,
    addressType,
    portRemote,
    rawDataIndex: addressValueIndex + addressLength,
    vlessVersion: version,
    isUDP,
  };
}

/**
 * @param {Deno.TcpConn} remoteSocket
 * @param {WebSocket} webSocket
 * @param {ArrayBuffer} vlessResponseHeader
 * @param {(() => Promise<void>) | null} retry
 * @param {(info: string) => void} log
 */
async function remoteSocketToWS(remoteSocket: Deno.TcpConn, webSocket: WebSocket, vlessResponseHeader: Uint8Array, retry: (() => Promise<void>) | null, log: (info: string, event?: string) => void) {
  // remote--> ws
  let remoteChunkCount = 0; // Not used, consider removing if not needed for rate limiting logic.
  let hasIncomingData = false; // check if remoteSocket has incoming data
  await remoteSocket.readable
    .pipeTo(
      new WritableStream({
        start() {},
        /**
         *
         * @param {Uint8Array} chunk
         * @param {*} controller
         */
        async write(chunk, controller) {
          hasIncomingData = true;
          // remoteChunkCount++;
          if (webSocket.readyState !== WS_READY_STATE_OPEN) {
            controller.error('webSocket.readyState is not open, maybe close');
          }

          if (vlessResponseHeader) { // Use the parameter directly
            webSocket.send(new Uint8Array([...vlessResponseHeader, ...chunk]));
            vlessResponseHeader = null; // Clear it after first send
          } else {
            // seems no need rate limit this, CF seems fix this??..
            // if (remoteChunkCount > 20000) {
            //  // cf one package is 4096 byte(4kb),    4096 * 20000 = 80M
            //  await delay(1);
            // }
            webSocket.send(chunk);
          }
        },
        close() {
          log(`remoteConnection!.readable is close with hasIncomingData is ${hasIncomingData}`);
          // safeCloseWebSocket(webSocket); // no need server close websocket frist for some case will casue HTTP ERR_CONTENT_LENGTH_MISMATCH issue, client will send close event anyway.
        },
        abort(reason) {
          console.error(`remoteConnection!.readable abort`, reason);
        },
      })
    )
    .catch((error) => {
      console.error(`remoteSocketToWS has exception `, error.stack || error);
      safeCloseWebSocket(webSocket);
    });

  // seems is cf connect socket have error,
  // 1. Socket.closed will have error
  // 2. Socket.readable will be close without any data coming
  if (hasIncomingData === false && retry) {
    log(`retry`);
    retry();
  }
}

/**
 * @param {string} base64Str
 * @returns
 */
function base64ToArrayBuffer(base64Str: string) {
  if (!base64Str) {
    return { error: null };
  }
  try {
    // go use modified Base64 for URL rfc4648 which js atob not support
    base64Str = base64Str.replace(/-/g, '+').replace(/_/g, '/');
    const decode = atob(base64Str);
    const arryBuffer = Uint8Array.from(decode, (c) => c.charCodeAt(0));
    return { earlyData: arryBuffer.buffer, error: null };
  } catch (error) {
    return { error: error };
  }
}

/**
 * This is not real UUID validation, but it's used for comparison.
 * The `crypto.randomUUID()` function ensures a valid UUID v4 format.
 * @param {string} uuid
 */
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

const WS_READY_STATE_OPEN = 1;
const WS_READY_STATE_CLOSING = 2;
/**
 * Normally, WebSocket will not has exceptions when close.
 */
function safeCloseWebSocket(socket: WebSocket) {
  try {
    if (socket.readyState === WS_READY_STATE_OPEN || socket.readyState === WS_READY_STATE_CLOSING) {
      socket.close();
    }
  } catch (error) {
    console.error('safeCloseWebSocket error', error);
  }
}

const byteToHex: string[] = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr: Uint8Array, offset = 0) {
  return (
    byteToHex[arr[offset + 0]] +
    byteToHex[arr[offset + 1]] +
    byteToHex[arr[offset + 2]] +
    byteToHex[arr[offset + 3]] +
    '-' +
    byteToHex[arr[offset + 4]] +
    byteToHex[arr[offset + 5]] +
    '-' +
    byteToHex[arr[offset + 6]] +
    byteToHex[arr[offset + 7]] +
    '-' +
    byteToHex[arr[offset + 8]] +
    byteToHex[arr[offset + 9]] +
    '-' +
    byteToHex[arr[offset + 10]] +
    byteToHex[arr[offset + 11]] +
    byteToHex[arr[offset + 12]] +
    byteToHex[arr[offset + 13]] +
    byteToHex[arr[offset + 14]] +
    byteToHex[arr[offset + 15]]
  ).toLowerCase();
}
function stringify(arr: Uint8Array, offset = 0) {
  const uuid = unsafeStringify(arr, offset);
  if (!isValidUUID(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }
  return uuid;
}

/**
 * @param {WebSocket} webSocket
 * @param {Uint8Array} vlessResponseHeader
 * @param {(string)=> void} log
 */
async function handleUDPOutBound(webSocket: WebSocket, vlessResponseHeader: Uint8Array, log: (info: string) => void) {
  let isVlessHeaderSent = false;
  const transformStream = new TransformStream({
    start(controller) {},
    transform(chunk, controller) {
      // udp message 2 byte is the the length of udp data
      // TODO: this should have bug, because maybe udp chunk can be in two websocket message
      for (let index = 0; index < chunk.byteLength;) {
        const lengthBuffer = chunk.slice(index, index + 2);
        const udpPakcetLength = new DataView(lengthBuffer).getUint16(0);
        const udpData = new Uint8Array(chunk.slice(index + 2, index + 2 + udpPakcetLength));
        index = index + 2 + udpPakcetLength;
        controller.enqueue(udpData);
      }
    },
    flush(controller) {},
  });

  // only handle dns udp for now
  transformStream.readable
    .pipeTo(
      new WritableStream({
        async write(chunk) {
          const resp = await fetch('https://1.1.1.1/dns-query', {
            method: 'POST',
            headers: {
              'content-type': 'application/dns-message',
            },
            body: chunk,
          });
          const dnsQueryResult = await resp.arrayBuffer();
          const udpSize = dnsQueryResult.byteLength;
          // console.log([...new Uint8Array(dnsQueryResult)].map((x) => x.toString(16)));
          const udpSizeBuffer = new Uint8Array([(udpSize >> 8) & 0xff, udpSize & 0xff]);
          if (webSocket.readyState === WS_READY_STATE_OPEN) {
            log(`doh success and dns message length is ${udpSize}`);
            if (isVlessHeaderSent) {
              webSocket.send(await new Blob([udpSizeBuffer, dnsQueryResult]).arrayBuffer());
            } else {
              webSocket.send(await new Blob([vlessResponseHeader, udpSizeBuffer, dnsQueryResult]).arrayBuffer());
              isVlessHeaderSent = true;
            }
          }
        },
      })
    )
    .catch((error) => {
      log('dns udp has error' + error);
    });

  const writer = transformStream.writable.getWriter();

  return {
    /**
     *
     * @param {Uint8Array} chunk
     */
    write(chunk: Uint8Array) {
      writer.write(chunk);
    },
  };
}
