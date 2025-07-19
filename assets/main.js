// prevent right click menu from appearing and annoying people - awdev1
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});
const canvas = document.getElementById('map');
const ctx = canvas.getContext('2d');

let devMode = false;
if (window.location.href.startsWith('https://tiaguinho2009.github.io')) devMode = false;

let offsetX = 0,
    offsetY = 0;

let scale = 1;
let lastMouseX = 0;
let lastMouseY = 0;
let isDragging = false;
let startX, startY;
let onlineATC = 0;
let dataIsFrom = 'ATC24';
let flightRoute = [];
let onlineATCs = {};
let fplgeneratorrange = 5.5;

const positionMapping = {
    center: 'CTR',
    control: 'CTR',
    approach: 'APP',
    departure: 'APP',
    director: 'APP',
    final: 'APP',
    tower: 'TWR',
    afis: 'TWR',
    ground: 'GND',
    delivery: 'DEL',
    atis: 'ATS',
    ats: 'ATS'
};

const sortedAirports = controlAreas
    .filter(area => area.type === "Airport")
    .map(area => area.name)
    .sort();

const sortedWaypoints = Waypoints
    .map(wp => wp.name)
    .sort();

function showLoading() {
    const loading = document.getElementById('loading');
    loading.style.display = 'flex';
    setTimeout(() => {
        loading.style.opacity = 1;
    }, 10);
}

function hideLoading() {
    const loading = document.getElementById('loading');
    loading.style.opacity = 0;
    setTimeout(() => {
        loading.style.display = 'none';
    }, 500);
}

showLoading();
setTimeout(hideLoading, 1000);

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
    });
}

const tiles1 = [];
const tiles2 = [];
const tiles3 = [];
const tiles4 = [];
const tilePromises = [];

for (let i = 1; i <= 25; i++) {
    tilePromises.push(loadImage(`tiles/tiles1/${i}.png`).then(img => tiles1.push(img)));
    tilePromises.push(loadImage(`tiles/tiles2/${i}.png`).then(img => tiles2.push(img)));
}

Promise.all(tilePromises).then(() => {
    console.log('Images loaded successfully!');
    resizeCanvas();
    loadFromLocalStorage();
    setInterval(fetchATCDataAndUpdate, 30000);
    fetchATCDataAndUpdate();
}).catch(error => {
    console.error('Error loading images:', error);
});

for (let i = 1; i <= 25; i++) {
    const img1 = new Image();
    img1.src = `tiles/tiles1/${i}.png`;
    tiles1.push(img1);

    const img2 = new Image();
    img2.src = `tiles/tiles2/${i}.png`;
    tiles2.push(img2);

    const img3 = new Image();
    img3.src = `tiles/tiles3/${i}.png`;
    tiles3.push(img3);

    const img4 = new Image();
    img4.src = `tiles/tilesOP/${i}.png`;
    tiles4.push(img4);

    if (i === 25) {
        img1.onload = () => {
            resizeCanvas();
        };
    };
};

const messageQueue = [];
let isMessageVisible = false;

function showMessage(title, message, button, button2) {
    return new Promise((resolve) => {
        messageQueue.push({ title, message, button, button2, resolve });
        if (!isMessageVisible) {
            processQueue();
        }
    });
}

function processQueue() {
    if (messageQueue.length === 0) {
        isMessageVisible = false;
        return;
    }

    isMessageVisible = true;
    const { title, message, button, button2, resolve } = messageQueue.shift();
    
    const menu = document.getElementById("MessageMenu");
    const overlay = document.getElementById("overlay");
    const titleElement = menu.querySelector(".title");
    const contentElement = menu.querySelector(".content p");
    const closeButton1 = document.getElementById("message-button1");
    const closeButton2 = document.getElementById("message-button2");

    titleElement.textContent = title;
    contentElement.textContent = message;
    closeButton1.textContent = button || "Close";

    if (button2) {
        closeButton2.textContent = button2;
        closeButton2.style.display = "flex";
        closeButton1.classList.add("button-half");
        closeButton2.classList.add("button-half");
    } else {
        closeButton2.style.display = "none";
        closeButton1.classList.remove("button-half");
        closeButton2.classList.remove("button-half");
    }

    menu.style.display = "flex";
    overlay.style.display = "block";
    setTimeout(() => {
        overlay.style.opacity = 1;
    }, 10);

    function closeMenu(result) {
        menu.style.display = "none";
        overlay.style.opacity = 0;
        setTimeout(() => {
            overlay.style.display = "none";
            resolve(result);
            processQueue(); // Mostrar a próxima mensagem da fila
        }, 500);
    }

    closeButton1.onclick = () => closeMenu(1);
    closeButton2.onclick = () => closeMenu(2);
}

function getTiles() {
    if (scale >= 12) {
        return tiles4;
    } else if (scale >= 6) {
        return tiles3;
    } else if (scale >= 3) {
        return tiles2;
    } else {
        return tiles1;
    }
}

function getViewBox() {
    const topLeftX = -offsetX / scale;
    const topLeftY = -offsetY / scale;
    const bottomRightX = (canvas.width - offsetX) / scale;
    const bottomRightY = (canvas.height - offsetY) / scale;

    return {
        topLeft: { x: topLeftX, y: topLeftY },
        bottomRight: { x: bottomRightX, y: bottomRightY }
    };
}

function getVisibleTiles() {
    const viewBox = getViewBox();
    const tileSize = 240; // Tamanho de cada tile em pixels
    const tilesPerColumn = 5; // Número de tiles por coluna

    const visibleTiles = [];

    for (let i = 1; i <= 25; i++) {
        const col = Math.floor((i - 1) / tilesPerColumn);
        const row = (i - 1) % tilesPerColumn;

        const tileTopLeftX = col * tileSize;
        const tileTopLeftY = row * tileSize;
        const tileBottomRightX = tileTopLeftX + tileSize;
        const tileBottomRightY = tileTopLeftY + tileSize;

        const isTileVisible = !(tileBottomRightX < viewBox.topLeft.x || tileTopLeftX > viewBox.bottomRight.x ||
                                tileBottomRightY < viewBox.topLeft.y || tileTopLeftY > viewBox.bottomRight.y);

        if (isTileVisible) {
            visibleTiles.push(i);
        }
    }

    return visibleTiles;
}

// Configuração do tamanho do canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 50;
    centerMap();
}
window.addEventListener('resize', resizeCanvas);

// Função para centralizar o mapa
function centerMap() {
    const mapWidth = 1200 * scale;
    const mapHeight = 1200 * scale;
    offsetX = (canvas.width - mapWidth) / 2;
    offsetY = (canvas.height - mapHeight) / 2;
    draw();
}

// Função de transformação das coordenadas
function transformCoordinates(coord) {
    return [
        coord[0] * scale + offsetX,
        coord[1] * scale + offsetY
    ];
}

function transformAtisInfoToText(atisInfo) {
    const {
        airport,
        position,
        uptime,
        onlineSince,
        ident,
        pressure,
        arwy,
        drwy,
        pdc
    } = atisInfo;

    if (position !== "atis") {
        console.error("Invalid position for ATIS information.");
        return "";
    }

    const airportEntry = airportsTable.find(entry => entry.icaoCode === airport);
    const airportName = airportEntry ? airportEntry.name.toUpperCase() : airport.toUpperCase();

    const informationIdent = ATIScodeTable[ident.toUpperCase()] || ident.toUpperCase();
    const departureRunways = Array.isArray(drwy) && drwy.length > 0 ? drwy.join(", ") : "UNKNOWN";
    const arrivalRunways = Array.isArray(arwy) && arwy.length > 0 ? arwy.join(", ") : "UNKNOWN";
    const visibility = "VISIBILITY 10 KILOMETERS OR MORE";
    const qnh = pressure ? `QNH ${pressure}` : "UNKNOWN";
    const datalinkClearances = pdc ? "DATALINK CLEARANCES ARE AVAILABLE .." : "";
    const date = new Date(onlineSince);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const time = onlineSince ? `${hours}${minutes}Z` : "UNKNOWN";

    const text = `${airportName} INFORMATION ${informationIdent} .. TIME ${time} .. DEPARTURE RUNWAY ${departureRunways} .. ARRIVAL RUNWAY ${arrivalRunways} .. ${visibility} .. ${qnh} .. ${datalinkClearances} ACKNOWLEDGE RECIEPT OF INFORMATION ${informationIdent} ON FIRST CONTACT`.trim();
    return text
}

function OceanicOnlineATC() {
    const SkopelosATIS = getOnlineATCs("Skopelos").ATS[0];
    const SaintBarthATIS = getOnlineATCs("Saint Barthélemy").ATS[0];
    if (
        SkopelosATIS && SkopelosATIS.oceanic &&
        SaintBarthATIS && SaintBarthATIS.oceanic
    ) {
        controlAreas.forEach(area => {
            if (area.type === 'polyline' && area.name === 'ISKP FIR') {
                area.active = false;
            } else if (area.type === 'polyline' && area.name === 'ISKP FIR2') {
                area.active = true;
            } else if (area.type === 'Airport' && area.real_name === 'Skopelos') {
                area.ctr = 'ISKP CTR2';
            } else if (area.type === 'polyline' && area.name === 'IBTH FIR') {
                area.active = false;
            } else if (area.type === 'polyline' && area.name === 'IBTH FIR2') {
                area.active = true;
            } else if (area.type === 'Airport' && area.real_name === 'Saint Barthélemy') {
                area.ctr = 'IBTH CTR2';
            }
        })
    } else {
        controlAreas.forEach(area => {
            if (area.type === 'polyline' && area.name === 'ISKP FIR') {
                area.active = true;
            } else if (area.type === 'polyline' && area.name === 'ISKP FIR2') {
                area.active = false;
            } else if (area.type === 'Airport' && area.real_name === 'Skopelos') {
                area.ctr = 'ISKP CTR';
            } else if (area.type === 'polyline' && area.name === 'IBTH FIR') {
                area.active = true;
            } else if (area.type === 'polyline' && area.name === 'IBTH FIR2') {
                area.active = false;
            } else if (area.type === 'Airport' && area.real_name === 'Saint Barthélemy') {
                area.ctr = 'IBTH CTR';
            }
        })
    }
}

function updateOnlineATCs(atcList) {
    onlineATCs = {};

    atcList.forEach(atcData => {
        const { holder, claimable, airport, position, code, uptime, frequency: initialFrequency, chartPack, oceanic, queue, ...otherInfo } = atcData;

        if (claimable) return;

        if (position === "atis") {
            const atisInfo = { airport, position, uptime, ...otherInfo };
            const text = transformAtisInfoToText(atisInfo);
            if (!onlineATCs[airport]) {
                onlineATCs[airport] = { CTR: [], APP: [], TWR: [], GND: [], DEL: [], ATS: [] };
            }
            onlineATCs[airport].ATS.push({
                uptime: atisInfo.uptime,
                ident: atisInfo.ident,
                pressure: atisInfo.pressure,
                chartPack,
                oceanic,
                text
            });
            return;
        }

        let frequency = initialFrequency;

        if (!frequency) {
            controlAreas.forEach(area => {
                if (area.type === 'Airport' && area.real_name === airport) {
                    const position2 = positionMapping[position];
                    if (position2 === 'CTR' || position2 === 'APP' || position2 === 'TWR') {
                        frequency = area.towerfreq;
                    } else {
                        frequency = area.groundfreq;
                    }
                }
            });
        }

        const mappedPosition = positionMapping[position];
        if (!mappedPosition) {
            console.error(`Invalid position: ${position} for airport: ${airport}`);
            return;
        }

        if (!onlineATCs[airport]) {
            onlineATCs[airport] = { CTR: [], APP: [], TWR: [], GND: [], DEL: [], ATS: [] };
        }

        onlineATCs[airport][mappedPosition].push({ holder, uptime, frequency, code });
        if (Array.isArray(queue) && queue.length > 0) {
            onlineATCs[airport][mappedPosition].push({
                type: "queue",
                queue: queue
            });
        }
    });
    OceanicOnlineATC();
}

// Função para verificar se um ATC está online
function isATCOnline(airport, position) {
    return onlineATCs[airport] && onlineATCs[airport][position].length > 0;
}

// Função para obter a lista de ATCs online em um aeroporto
function getOnlineATCs(airport) {
    return onlineATCs[airport] || { TWR: [], GND: [], APP: [], CTR: [], DEL: [], ATS: [] };
}

function isSpecialUser(atcName) {
    if (!atcName) return false;
    const baseName = atcName.split(' | ')[0];
    return Object.keys(specialUsers).includes(baseName);
}

let aircraftSVGImage;

function loadSVG(url) {
    return fetch(url)
        .then(response => response.text())
        .then(svgText => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(svgText, 'image/svg+xml');
            const svgElement = doc.documentElement;

            // Cria um novo elemento de imagem para o SVG
            const img = new Image();
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            img.onload = () => {
                aircraftSVGImage = img;
                URL.revokeObjectURL(url);
                draw(); // Redesenha o canvas após carregar o SVG
            };

            img.src = url;
        });
}

document.addEventListener('DOMContentLoaded', () => {
    //loadSVG('assets/Icons/plane-svgrepo-com.svg');
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha os tiles visíveis
    const visibleTiles = getVisibleTiles();
    const tiles = getTiles();
    visibleTiles.forEach(tileIndex => {
        const tile = tiles[tileIndex - 1];
        const col = Math.floor((tileIndex - 1) / 5);
        const row = (tileIndex - 1) % 5;
        const tileX = col * 240 * scale + offsetX;
        const tileY = row * 240 * scale + offsetY;
        ctx.drawImage(tile, tileX, tileY, 240 * scale, 240 * scale);
    });

    drawControlAreas();
    drawFlightPlan(flightRoute);
    resetChartsMenu();
    drawNavaids();
    updateAllAirportsUI();
    //drawAircraft();
}

function drawAircraft() {
    if (!aircraftSVGImage) return;

    Object.values(aircraftData).forEach(aircraft => {
        const { position, heading, isOnGround } = aircraft;
        const [x, y] = transformCoordinates([Math.sqrt(position.x ** 2) / 40, Math.sqrt(position.y ** 2) / 40]);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((heading * Math.PI) / 180);
        ctx.drawImage(aircraftSVGImage, -15, -15, 30, 30); // Ajuste o tamanho conforme necessário
        ctx.restore();
    });
}

function drawControlAreas() {
    // Desenho das polylines
    controlAreas.forEach(area => {
        if (area.active && area.type === 'polyline') {
            let drawLine = false;

            if (area.name.includes('TMA') && settingsValues.showAPPlines) {
                drawLine = true;
            }
            if (area.name.includes('FIR') && settingsValues.showFIRlines) {
                drawLine = true;
            }

            const coordinates = area.coordinates.map(transformCoordinates);
            ctx.beginPath();
            ctx.strokeStyle = area.color;
            ctx.lineWidth = 0.5;

            if (drawLine) {
                coordinates.forEach((point, index) => {
                    if (index === 0) {
                        ctx.moveTo(point[0], point[1]);
                    } else {
                        ctx.lineTo(point[0], point[1]);
                    }
                });
                ctx.stroke();
            }
        }
    });

    // Desenho dos polygons (TMAs e CTRs)
    controlAreas.forEach(area => {
        if (area.type === 'polygon') {
            let drawCTR = false;
            let drawAPP = false;

            if (!area.originalFillColor) area.originalFillColor = area.fillColor;

            // Verifica se algum aeroporto possui o valor "ctr" ou "app" igual ao nome da área e "tower" ativo
            controlAreas.forEach(airport => {
                if (airport.type === 'Airport') {
                    const atcs = getOnlineATCs(airport.real_name);

                    if (atcs.CTR.length > 0 && airport.ctr === area.name) {
                        drawCTR = true;
                        
                    }
                    if (atcs.APP.length > 0 && airport.app === area.name) {
                        drawAPP = true;
                    }
                    if (atcs.CTR.length > 0 && airport.app === area.name && dataIsFrom === 'ATC24') {
                        drawAPP = true;
                    }
                }
            });

            // Desenha o CTR se existir
            if (drawCTR) {
                const coordinates = area.coordinates.map(transformCoordinates);
                ctx.beginPath();
                ctx.strokeStyle = area.color;
                ctx.fillStyle = area.fillColor;
                ctx.lineWidth = 0.5;

                coordinates.forEach((point, index) => {
                    if (index === 0) {
                        ctx.moveTo(point[0], point[1]);
                    } else {
                        ctx.lineTo(point[0], point[1]);
                    }
                });
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }

            // Desenha o APP se existir
            if (drawAPP) {
                const coordinates = area.coordinates.map(transformCoordinates);
                ctx.beginPath();
                ctx.strokeStyle = area.color;
                ctx.fillStyle = area.fillColor;
                ctx.lineWidth = 0.5;

                coordinates.forEach((point, index) => {
                    if (index === 0) {
                        ctx.moveTo(point[0], point[1]);
                    } else {
                        ctx.lineTo(point[0], point[1]);
                    }
                });
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
        }
    });
}

function updateATCUI() {
    controlAreas.forEach(area => {
        if (area.type === 'Airport') {
            const atcs = getOnlineATCs(area.real_name);

            area.tower = atcs.TWR.length > 0;
            area.ground = atcs.GND.length > 0;
            area.towerAtc = atcs.TWR.length > 0 ? atcs.TWR[0].holder : '';
            area.groundAtc = atcs.GND.length > 0 ? atcs.GND[0].holder : '';
            area.uptime = atcs.TWR.length > 0 ? atcs.TWR[0].uptime : (atcs.GND.length > 0 ? atcs.GND[0].uptime : '');
            area.scale = atcs.TWR.length > 0 || atcs.GND.length > 0 ? 0 : area.originalscale;

            // Ativa a TMA correspondente, se aplicável
            if (atcs.TWR.length > 0) {
                controlAreas.forEach(tmaArea => {
                    if (tmaArea.type === 'polygon' && tmaArea.name === area.tma) {
                        tmaArea.active = true;
                    }
                });
            }

            // Ativa a CTR correspondente, se aplicável
            if (area.ctr && atcs.CTR.length > 0) {
                controlAreas.forEach(ctrArea => {
                    if (ctrArea.type === 'polygon' && ctrArea.name === area.ctr) {
                        ctrArea.active = true;
                    }
                });
            }
        }
    });

    updateATCCount();
    refreshUI();
}

function calculateDistance(point1, point2) {
    const referenceDistanceEuclidean = Math.sqrt((534.22 - 512.13) ** 2 + (243.11 - 225.89) ** 2);
    const referenceDistanceNM = 1478 / 1852; // 1478 meters in NM (1 NM = 1852 meters)
    const scaleFactor = referenceDistanceNM / referenceDistanceEuclidean;

    const distanceEuclidean = Math.sqrt((point1.coordinates[0] - point2.coordinates[0]) ** 2 + (point1.coordinates[1] - point2.coordinates[1]) ** 2);
    const distanceNM = (distanceEuclidean * scaleFactor);
    return distanceNM;
}

function drawFlightPlan(points) {
    if (points.length < 2) {
        return;
    }

    ctx.strokeStyle = "#cc4265";
    ctx.lineWidth = 2;

    // Fator de escala calculado a partir da referência dada
    const referenceDistanceEuclidean = Math.sqrt((534.22 - 512.13) ** 2 + (243.11 - 225.89) ** 2);
    const referenceDistanceNM = 1478 / 1852; // 1478 metros em NM (1 NM = 1852 metros)
    const scaleFactor = referenceDistanceNM / referenceDistanceEuclidean;

    const transformedPoints = points.map(point => ({
        ...point,
        transformedCoordinates: transformCoordinates(point.coordinates),
    }));

    ctx.beginPath();
    ctx.moveTo(
        transformedPoints[0].transformedCoordinates[0],
        transformedPoints[0].transformedCoordinates[1]
    );

    for (let i = 1; i < transformedPoints.length; i++) {
        const current = transformedPoints[i - 1];
        const next = transformedPoints[i];

        const currentTrans = current.transformedCoordinates;
        const nextTrans = next.transformedCoordinates;

        // Desenha a linha
        ctx.lineTo(nextTrans[0], nextTrans[1]);

        // Calcula o HDG
        const dx = nextTrans[0] - currentTrans[0];
        const dy = nextTrans[1] - currentTrans[1];
        const hdg = Math.round((Math.atan2(dx, -dy) * (180 / Math.PI) + 360) % 360);

        const distanceNM = calculateDistance(current, next).toFixed(2);

        // Chama a função para desenhar as labels secundárias se o zoom for maior que 1
        if (scale > 0.5) {
            drawSecondaryLabels(currentTrans, nextTrans, hdg, distanceNM);
        }
    }
    ctx.stroke();

    // Desenha os pontos transformados
    transformedPoints.forEach((point, index) => {
        const [x, y] = point.transformedCoordinates;

        let pointColor;
        if (index === 0) {
            pointColor = "#00FF00"; // Verde para o primeiro ponto
        } else if (index === transformedPoints.length - 1) {
            pointColor = "#FF0000"; // Vermelho para o último ponto
        } else {
            pointColor = point.type === "VOR" ? "#66B2FF" : "#FFFF66";
        }

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = pointColor;
        ctx.fill();

        if ((index === 0 || index === transformedPoints.length - 1) && point.type === "Airport") {
            return;
        }

        if (settingsValues.showNavaidsLabels) {
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "14px Arial";
            ctx.fillText(point.name, x + 5, y - 5);
        }
    });
}

function drawSecondaryLabels(currentTrans, nextTrans, hdg, distanceNM) {
    // Calcula a posição para exibir as labels (meio do segmento)
    const midX = (currentTrans[0] + nextTrans[0]) / 2;
    const midY = (currentTrans[1] + nextTrans[1]) / 2;

    // Rotaciona o contexto para alinhar com o ângulo da rota
    ctx.save();
    ctx.translate(midX, midY);
    let angle = Math.atan2(nextTrans[1] - currentTrans[1], nextTrans[0] - currentTrans[0]);
    if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
        angle += Math.PI; // Inverte para evitar que fique de cabeça para baixo
    }
    ctx.rotate(angle);

    // Desenha o HDG
    ctx.fillStyle = "#bbbbbb";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${hdg}°`, 0, -5);

    // Desenha a Distância em NM
    ctx.fillStyle = "#bbbbbb";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${distanceNM} NM`, 0, 15);

    // Restaura o contexto
    ctx.restore();
}

function drawNavaids() {
    if (!settingsValues.showNavaids) {
        return;
    }
    const navaids = [
        ...Waypoints,
        //...CustomWaypoints
    ];

    navaids.forEach(navaid => {
        // Filtra apenas os tipos VOR e Waypoint
        if (navaid.type !== "VOR" && navaid.type !== "Waypoint") {
            return;
        }

        // Verifica se o navaid está na flightRoute
        const isInFlightRoute = flightRoute.some(routePoint => routePoint.name === navaid.name);
        if (isInFlightRoute) {
            return; // Não desenha se estiver na rota
        }

        // Transforma as coordenadas
        const [x, y] = transformCoordinates(navaid.coordinates);

        // Define a cor baseada no tipo
        const color = navaid.type === "VOR" ? "#477bb3" : "#BDBD4C"; // VOR azul claro, Waypoint amarelo claro

        // Desenha a bolinha
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();

        if (!settingsValues.showNavaidsLabels) {
            return;
        }
        // Adiciona a label
        ctx.fillStyle = "#bbbbbb";
        ctx.font = "14px Arial";
        ctx.fillText(navaid.name, x + 5, y - 5);
    });
}

function updatePosition(airportUI, airport) {
    const atcs = getOnlineATCs(airport.real_name);
    const hasATCOnline = atcs.CTR.length > 0 || atcs.APP.length > 0 || atcs.TWR.length > 0 || atcs.GND.length > 0;

    if (scale < airport.scale && !hasATCOnline) {
        airportUI.style.display = 'none';
        return;
    } else {
        airportUI.style.display = 'block';
    }

    const [x, y] = transformCoordinates(airport.coordinates);
    const uiWidth = airportUI.offsetWidth;
    const uiHeight = airportUI.offsetHeight;

    // Determina a referência com base em hasATCOnline
    if (hasATCOnline) {
        // Centraliza a UI em relação ao aeroporto
        airportUI.style.left = `${x - uiWidth / 2}px`;
        airportUI.style.top = `${y + uiHeight / 2}px`;
    } else {
        // Centraliza a div .icao-code em relação ao aeroporto
        const icaoCode = airportUI.querySelector('.icao-code');
        if (icaoCode) {
            const icaoWidth = icaoCode.offsetWidth;
            const icaoHeight = icaoCode.offsetHeight;
            airportUI.style.left = `${x - icaoWidth / 2}px`;
            airportUI.style.top = `${y + icaoHeight * 2}px`;
        }
    }
}

function updateAllAirportsUI() {
    controlAreas.forEach(area => {
        if (area.type === 'Airport') {
            const airportUI = document.querySelector(`.airport-ui[id="${area.name}"]`);
            if (airportUI) {
                updatePosition(airportUI, area);
            }
        }
    });
}

const icaoMenuCount = 0;

function highlightCTR(airport) {
    controlAreas.forEach(area => {
        if (area.type === 'polygon' && area.name === airport.ctr) {
            area.fillColor = area.hightlightcolor || 'rgba(0, 255, 125, 0.075)';
            draw();
        }
    });
}

function resetCTRHighlight(airport) {
    controlAreas.forEach(area => {
        if (area.type === 'polygon' && area.name === airport.ctr) {
            area.fillColor = area.originalFillColor;
            draw();
        }
    });
}

function highlightAPP(airport) {
    controlAreas.forEach(area => {
        if (area.type === 'polygon' && area.name === airport.app) {
            area.fillColor = area.hightlightcolor || 'rgba(255, 122, 0, 0.1)';
            draw();
        }
    });
}

function resetAPPHighlight(airport) {
    controlAreas.forEach(area => {
        if (area.type === 'polygon' && area.name === airport.app) {
            area.fillColor = area.originalFillColor;
            draw();
        }
    });
}

function createAirportUI(airport) {
    if (!settingsValues.showAirportUI) return;

    const airportUI = createAirportElement(airport);
    const airportInfoMenu = createAirportInfoMenu();
    document.body.append(airportUI, airportInfoMenu);

    if (icaoMenuCount < 1) {
        createIcaoMenu(airport, airportUI);
    }

    addBadgeEventListeners(airport, airportUI, airportInfoMenu);
    updatePosition(airportUI, airport);
}

function createAirportElement(airport) {
    const airportUI = document.createElement('div');
    airportUI.className = 'airport-ui';
    airportUI.id = airport.name;
    airportUI.style.zIndex = 10 + (3 - airport.originalscale);
    airportUI.innerHTML = `
        <button class="icao-code">${airport.name}</button>
        <div class="badges-container">
            ${generateBadges(airport)}
        </div>
    `;

    if (airportUI.querySelector('.badge')) {
        airportUI.style.backgroundColor = "rgba(40, 40, 55, 0.3)";
        airportUI.style.color = "#ffffff";
        
        const icaoButton = airportUI.querySelector('.icao-code');
        if (icaoButton) {
            icaoButton.classList.add('active');
        }
    }

    return airportUI;
}

function generateBadges(airport) {
    const atcs = getOnlineATCs(airport.real_name);

    function isPositionSpecial(position) {
        return atcs[position].some(atc => isSpecialUser(atc.holder));
    }

    // Verifica se a condição específica da função OceanicOnlineATC está ativa
    const isOceanic = (airport.real_name === 'Skopelos' && airport.ctr === 'ISKP CTR2') ||
                      (airport.real_name === 'Saint Barthélemy' && airport.ctr === 'IBTH CTR2');

    return `
        ${isOceanic && atcs.CTR.length > 0 ? `<div class="badge O ${isPositionSpecial('CTR') ? 'special' : ''}" data-type="Oceanic">O</div>` : ''}
        ${!isOceanic && atcs.CTR.length > 0 ? `<div class="badge C ${isPositionSpecial('CTR') ? 'special' : ''}" data-type="Control">C</div>` : ''}
        ${atcs.APP.length > 0 ? `<div class="badge A ${isPositionSpecial('APP') ? 'special' : ''}" data-type="Approach">A</div>` : ''}
        ${atcs.TWR.length > 0 ? `<div class="badge T ${isPositionSpecial('TWR') ? 'special' : ''}" data-type="Tower">T</div>` : ''}
        ${atcs.GND.length > 0 ? `<div class="badge G ${isPositionSpecial('GND') ? 'special' : ''}" data-type="Ground">G</div>` : ''}
        ${atcs.DEL.length > 0 ? `<div class="badge D ${isPositionSpecial('DEL') ? 'special' : ''}" data-type="Delivery">D</div>` : ''}
        ${atcs.ATS.length > 0 ? `<div class="badge S ${isPositionSpecial('ATS') ? 'special' : ''}" data-type="ATIS">A</div>` : ''}
    `;
}

function createAirportInfoMenu() {
    const menu = document.createElement('div');
    menu.className = 'airport-info-menu';
    return menu;
}

function createIcaoMenu(airport, airportUI) {
    const icaoMenu = document.createElement('div');
    icaoMenu.className = 'icao-menu';
    icaoMenu.innerHTML = `
        <div class="title">Charts for ${airport.name}</div>
        <hr class="menu-divider">
        <div class="charts-buttons"></div>
    `;
    document.body.appendChild(icaoMenu);

    populateChartsMenu(airport, icaoMenu);
    airportUI.querySelector('.icao-code').addEventListener('click', () => toggleIcaoMenu(icaoMenu, airport));
}

function populateChartsMenu(airport, menu) {
    const chartsButtonsContainer = menu.querySelector('.charts-buttons');
    chartsButtonsContainer.innerHTML = ''; // Limpa os botões existentes

    let atisChartAdded = false;

    // Função para criar um botão de chart
    function createChartButton(chartName, chartLink, isSpecial = false) {
        const chartButton = document.createElement('button');
        chartButton.className = isSpecial ? 'chart-button special' : 'chart-button';
        chartButton.textContent = chartName;
        chartButton.onclick = () => {
            window.open(chartLink, '_blank');
            toggleIcaoMenu(menu, airport);
        };

        // Adiciona o ícone ao botão especial
        if (isSpecial) {
            const radarIcon = document.createElement('img');
            radarIcon.src = 'assets/Icons/radar-2-svgrepo-com.svg'; // Caminho para a imagem
            radarIcon.alt = 'Radar Icon';
            radarIcon.className = 'radar-icon';
            chartButton.appendChild(radarIcon);
        }

        chartsButtonsContainer.appendChild(chartButton);
    }

    // Função para popular os charts normais
    function populateNormalCharts() {
        if (airport.charts) {
            airport.charts.forEach(([chartName, chartLink]) => {
                createChartButton(chartName, chartLink);
            });
        } else {
            chartsButtonsContainer.innerHTML = `<div class="no-charts">No charts available</div>`;
        }
    }

    // Verifica se o aeroporto possui ATIS online
    if (isATCOnline(airport.real_name, "ATS")) {
        const atisInfo = getOnlineATCs(airport.real_name).ATS[0]; // Obtém a primeira informação ATIS disponível

        if (atisInfo && atisInfo.chartPack) {
            const { author: atisAuthor, url: atisUrl } = atisInfo.chartPack;

            // Verifica se algum chart coincide com o ATIS
            if (airport.charts) {
                airport.charts.forEach(([chartName, chartLink]) => {
                    const isSpecial = chartName === atisAuthor;
                    if (isSpecial) atisChartAdded = true;
                    createChartButton(chartName, chartLink, isSpecial);
                });
            }

            // Caso nenhum chart coincida com o ATIS, cria um botão especial
            if (!atisChartAdded) {
                createChartButton(atisAuthor, atisUrl, true);
            }
        } else {
            populateNormalCharts();
        }
    } else {
        populateNormalCharts();
    }
}

function toggleIcaoMenu(menu, airport) {
    if (!menu.classList.contains('open')) {
        // Abrir o menu com animação
        resetChartsMenu();
        menu.style.display = 'block';

        const [x, y] = transformCoordinates(airport.coordinates);
        const uiWidth = menu.offsetWidth;
        const uiHeight = menu.offsetHeight;

        // Obtém a referência da div .icao-code
        const airportUI = document.querySelector(`.airport-ui[id="${airport.name}"]`);
        const icaoCode = airportUI.querySelector('.icao-code');
        const icaoRect = icaoCode.getBoundingClientRect();

        // Calcula a posição do menu acima do .icao-code
        const referenceX = icaoRect.left + icaoRect.width / 2 + window.scrollX;
        const referenceY = icaoRect.top + window.scrollY;

        // Ajusta a posição do menu
        menu.style.left = `${referenceX - uiWidth / 2}px`;
        menu.style.top = `${referenceY - uiHeight - 10}px`; // Posiciona acima com um deslocamento de 10px

        setTimeout(() => {
            menu.classList.add('open');
            menu.classList.remove('closed');
        }, 10); // Pequeno atraso para garantir que a transição ocorra
    } else {
        // Fechar o menu com animação
        menu.classList.remove('open');
        menu.classList.add('closed');
        setTimeout(() => {
            menu.style.display = 'none';
        }, 300); // Tempo da animação
    }
}

function resetChartsMenu() {
    const menus = document.querySelectorAll(`.icao-menu`);
    menus.forEach(menu => {
        menu.classList.remove('open', 'closed'); // Remove as classes de animação
        menu.style.display = 'none'; // Garante que o menu seja escondido
    });
}

function calculateBoundingArea(div1, div2, indication) {
    const rect1 = div1.getBoundingClientRect();
    const rect2 = div2.getBoundingClientRect();
    let vertices = []

    if (indication === 'top') {
        vertices = [
            { x: rect1.left, y: rect1.bottom },
            { x: rect1.left, y: rect1.top },
            { x: rect1.right, y: rect1.top },
            { x: rect1.right, y: rect1.bottom },
            { x: rect2.right, y: rect2.top },
            { x: rect2.right, y: rect2.bottom },
            { x: rect2.left, y: rect2.bottom },
            { x: rect2.left, y: rect2.top },
        ];
    } else if (indication === 'bottom') {
        vertices = [
            { x: rect2.right, y: rect2.top },
            { x: rect2.right, y: rect2.bottom },
            { x: rect1.right, y: rect1.top },
            { x: rect1.right, y: rect1.bottom },
            { x: rect1.left, y: rect1.bottom },
            { x: rect1.left, y: rect1.top },
            { x: rect2.left, y: rect2.bottom },
            { x: rect2.left, y: rect2.top }
        ];
    } else if (indication === 'right') {
        vertices = [
            { x: rect1.left, y: rect1.top },
            { x: rect1.right, y: rect1.top },
            { x: rect2.left, y: rect2.top },
            { x: rect2.right, y: rect2.top },
            { x: rect2.right, y: rect2.bottom },
            { x: rect2.left, y: rect2.bottom },
            { x: rect1.right, y: rect1.bottom },
            { x: rect1.left, y: rect1.bottom },
        ];
    }
    
    return vertices;
}

function isMouseOutsideArea(event, vertices, badge) {
    const { clientX: x, clientY: y } = event;

    // Verifica se o mouse está sobre a badge
    if (badge.classList.contains('hover')) {
        return false;
    }

    function isPointInPolygon(point, polygon) {
        let isInside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i].x, yi = polygon[i].y;
            const xj = polygon[j].x, yj = polygon[j].y;

            const intersect = ((yi > point.y) !== (yj > point.y)) &&
                (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
            if (intersect) isInside = !isInside;
        }
        return !isInside;
    }

    return isPointInPolygon({ x, y }, vertices);
}

function addMouseLeaveListener(div1, div2, callback) {
    const vertices = calculateBoundingArea(div1, div2, 'top');

    function onMouseMove(event) {
        if (isMouseOutsideArea(event, vertices, div1)) {
            callback();
            document.removeEventListener('mousemove', onMouseMove);
        }
    }

    document.addEventListener('mousemove', onMouseMove);
    return onMouseMove;
}

function resetMenuAndListeners(currentMouseMoveListener) {
    if (currentMouseMoveListener) {
        document.removeEventListener('mousemove', currentMouseMoveListener);
    }
    hideInfoMenu(document.querySelector('.airport-info-menu'));
}

function addBadgeEventListeners(airport, airportUI, infoMenu) {
    const atcs = getOnlineATCs(airport.real_name);
    const badges = {
        O: { condition: atcs.CTR.length > 0, highlight: highlightCTR, reset: resetCTRHighlight },
        C: { condition: atcs.CTR.length > 0, highlight: highlightCTR, reset: resetCTRHighlight },
        A: { condition: atcs.APP.length > 0, highlight: highlightAPP, reset: resetAPPHighlight },
        T: { condition: atcs.TWR.length > 0 },
        G: { condition: atcs.GND.length > 0 },
        D: { condition: atcs.DEL.length > 0 },
        S: { condition: atcs.ATS.length > 0 }
    };

    let currentMouseMoveListener = null;

    Object.entries(badges).forEach(([key, { condition, highlight, reset }]) => {
        const badge = airportUI.querySelector(`.badge.${key}`);
        if (badge && condition) {
            badge.addEventListener('mouseenter', () => {
                if (isDragging) return;
                badge.classList.add('hover');
                resetMenuAndListeners(currentMouseMoveListener);
                showInfoMenu(badge, airport, infoMenu, airportUI);
                resetHighlights();
                if (highlight) highlight(airport);
                if (dataIsFrom === 'ATC24' && key === 'C') {
                    highlightAPP(airport);
                }

                currentMouseMoveListener = addMouseLeaveListener(badge, infoMenu, () => {
                    hideInfoMenu(infoMenu);
                    if (reset) reset(airport);
                    if (dataIsFrom === 'ATC24' && key === 'C') {
                        resetAPPHighlight(airport);
                    }
                    resetMenuAndListeners(currentMouseMoveListener);
                });
            });

            badge.addEventListener('mouseleave', () => {
                badge.classList.remove('hover');
            });
        }
    });
}

function showInfoMenu(badge, airport, menu, airportUI) {
    const positions = { O: 'Control', C: 'Control', A: 'Approach', T: 'Tower', G: 'Ground', D: 'Delivery', S: 'ATIS' };
    const position = positions[badge.classList[1]] || 'Unknown';
    const ATCs = getOnlineATCs(airport.real_name);
    const atcList = ATCs[positionMapping[position.toLowerCase()]] || [];

    let infoSections = '';

    // Define o título do menu
    const title = badge.classList.contains('O') ? 'Oceanic' : position;

    if (position === 'ATIS') {
        menu.style.maxWidth = '400px'; // Limita a largura do menu para ATIS
        atcList.forEach(atc => {
            const { ident, uptime, text, chartPack } = atc;
            let atisChart = '';
            if (chartPack) {
                if (chartPack.author.includes('Nikita39Gamer')) chartPack.author = 'Nikita39Gamer';
                atisChart = `<div class="separator">|</div><a class="atis-chart" href="${chartPack.url}" target="_blank">${chartPack.author}</a>`;
            }
            infoSections += `
                <div class="atis-info-section">
                    <div class="atis-header" style="text-align: right;">
                        <span class="atis-ident">Info ${ident}</span>
                        <div class="separator">|</div>
                        <span class="atis-uptime">Time Online: ${uptime}</span>
                        ${atisChart}
                        <div class="separator">|</div>
                        <span class="atis-tooltip">
                            <img src="assets/Icons/question-mark-circle-svgrepo-com.svg" class="atis-icon">
                            <span class="atis-tooltip-text">ATIS Info provided by 24Scope</span>
                        </span>
                    </div>
                    <div class="atis-text">${text}</div>
                </div>
            `;
        });
    } else {
        atcList.forEach(atc => {
            menu.style.maxWidth = 'none';
            if (atc.type === "queue") {
                infoSections += `
                    <div class="controller-info-section queue">
                        <p><strong>${atc.queue.length}</strong> in queue</p>
                    </div>
                `;
                return;
            }
            const atcName = atc.holder || 'N/A';
            const frequency = atc.frequency || 'N/A';
            const uptime = atc.uptime || 'N/A';
            const atcCode = atc.code || '';

            const baseName = atcName.split(' | ')[0];
            const specialUser = isSpecialUser(baseName);
            const specialTag = specialUser 
                ? `<span class="special-tag" style="background-color: ${specialUsers[baseName].TagColor};">${specialUsers[baseName].Role}</span>` 
                : '';

            infoSections += `
                <div class="controller-info-section">
                    <p><strong>${atcCode}</strong></p>
                    <p><strong>Controller:</strong> ${atcName}${specialTag}</p>
                    <p><strong>Frequency:</strong> ${frequency}</p>
                    <p><strong>Online:</strong> ${uptime}</p>
                </div>
            `;
        });
    }

    menu.style.display = 'block';
    menu.innerHTML = `
        <div class="title">${airport.real_name} ${title}</div>
        <hr class="menu-divider">
        <div class="info-sections">
            ${infoSections}
        </div>
    `;
    positionInfoMenu(menu, airportUI);

    badge.classList.add('active');
}

function positionInfoMenu(menu, airportUI) {
    const rect = airportUI.getBoundingClientRect();
    const menuWidth = menu.offsetWidth;
    const menuHeight = menu.offsetHeight;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let left = rect.left + window.scrollX;
    let top = rect.bottom + window.scrollY + 10;

    if (left + menuWidth > windowWidth) {
        left = windowWidth - menuWidth - 10;
    }

    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
}

function hideInfoMenu(menu) {
    menu.style.display = 'none';

    document.querySelectorAll('.badge.active').forEach(badge => {
        badge.classList.remove('active');
    });
}

function resetAllAirportsUI() {
    document.querySelectorAll('.airport-ui, .airport-info-menu, .icao-menu').forEach(el => el.remove());
    window.removeEventListener('resize', updatePosition);
    canvas.removeEventListener('mousemove', updatePosition);
    canvas.removeEventListener('wheel', updatePosition);
}

function displayAirports() {
    resetAllAirportsUI();
    controlAreas.filter(area => area.type === 'Airport').forEach(createAirportUI);
}
displayAirports();

let velocityX = 0, velocityY = 0;
let friction = 0.85;
let isZooming = false;
const MIN_VELOCITY_THRESHOLD = 0.1;

function disablePointerEvents() {
    canvas.classList.add('disable-pointer-events');
}

function enablePointerEvents() {
    canvas.classList.remove('disable-pointer-events');
}

canvas.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    velocityX = 0;
    velocityY = 0;
    disablePointerEvents();
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const currentY = e.clientY;

    const dx = currentX - startX;
    const dy = currentY - startY;

    offsetX += dx;
    offsetY += dy;

    if (Math.abs(dx) > MIN_VELOCITY_THRESHOLD || Math.abs(dy) > MIN_VELOCITY_THRESHOLD) {
        velocityX = dx;
        velocityY = dy;
    } else {
        velocityX = 0;
        velocityY = 0;
    }

    startX = currentX;
    startY = currentY;

    draw();
});

document.addEventListener('mouseup', (e) => {
    if (e.button !== 0) return;
    isDragging = false;
    enablePointerEvents();

    if (Math.abs(velocityX) > MIN_VELOCITY_THRESHOLD || Math.abs(velocityY) > MIN_VELOCITY_THRESHOLD) {
        applyInertia();
    }
});

document.addEventListener('mouseleave', (e) => {
    if (e.button !== 0) return;
    isDragging = false;
    enablePointerEvents();
});

function applyInertia() {
    if (Math.abs(velocityX) > MIN_VELOCITY_THRESHOLD || Math.abs(velocityY) > MIN_VELOCITY_THRESHOLD) {
        offsetX += velocityX;
        offsetY += velocityY;

        velocityX *= friction;
        velocityY *= friction;

        draw();

        requestAnimationFrame(applyInertia);
    } else {
        velocityX = 0;
        velocityY = 0;
        enablePointerEvents();
    }
}

function roundScale(value) {
    return Math.round(value * 2) / 2;
}

function animateZoom(startScale, endScale, startX, endX, startY, endY, duration) {
    const startTime = performance.now();

    function animationStep(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        scale = startScale + (endScale - startScale) * progress;
        offsetX = startX + (endX - startX) * progress;
        offsetY = startY + (endY - startY) * progress;

        draw();

        if (progress < 1) {
            requestAnimationFrame(animationStep);
        } else {
            isZooming = false;
            console.log(scale);
        }
    }

    requestAnimationFrame(animationStep);
}

canvas.addEventListener('wheel', (e) => {
    e.preventDefault();

    if (!isZooming) {
        isZooming = true;

        requestAnimationFrame(() => {
            const mouseX = (e.clientX - canvas.getBoundingClientRect().left - offsetX) / scale;
            const mouseY = (e.clientY - canvas.getBoundingClientRect().top - offsetY) / scale;

            const baseZoomRate = 0.005;
            const zoomRate = baseZoomRate * scale;
            const zoomFactor = e.deltaY * -zoomRate;

            const minScale = 0.5;
            const maxScale = 20;

            let newScale = Math.min(Math.max(minScale, scale + zoomFactor), maxScale);
            newScale = roundScale(newScale);

            if (newScale !== scale) {
                const newOffsetX = mouseX * (scale - newScale) + offsetX;
                const newOffsetY = mouseY * (scale - newScale) + offsetY;

                animateZoom(scale, newScale, offsetX, newOffsetX, offsetY, newOffsetY, 200);
            } else {
                isZooming = false;
            }
        });
    }
});

canvas.addEventListener('mousemove', (e) => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
});

function toggleSettingsMenu() {
    const settingsMenu = document.getElementById('settingsMenu');
    const settingsButton = document.querySelector('.settings-button');

    if (settingsMenu.style.display === 'none' || settingsMenu.style.display === '') {
        settingsMenu.style.display = 'block';
        settingsButton.classList.add('on'); // Adiciona a classe "on" ao botão
    } else {
        settingsMenu.style.display = 'none';
        settingsButton.classList.remove('on'); // Remove a classe "on" do botão
    }
}

function toggleChangeLogMenu() {
    const Changelogmenu = document.getElementById('ChangelogMenu');
    Changelogmenu.style.display = Changelogmenu.style.display === 'none' || Changelogmenu.style.display === '' ? 'flex' : 'none';
}

let isAnimating = false;

function toggleFlpMenu() {
    if (isAnimating) return; // Se a animação estiver em andamento, não faz nada

    const flpMenu = document.getElementById('FlpMenu');
    const flpButton = document.getElementById('FlpButton');
    const flpIcon = document.getElementById('FlpIcon');

    isAnimating = true; // Define a variável de bloqueio

    // Alterna o menu entre visível e escondido com animação
    if (flpMenu.classList.contains('open')) {
        flpMenu.classList.remove('open');
        flpMenu.classList.add('closed');
        setTimeout(() => {
            flpMenu.style.display = 'none';
            isAnimating = false; // Libera a variável de bloqueio após a animação
        }, 500); // Tempo da animação
        flpButton.classList.remove('on'); // Remove a classe "on" do botão
        flpIcon.style.filter = 'brightness(0.8)';
    } else {
        flpMenu.style.display = 'flex';
        setTimeout(() => {
            flpMenu.classList.remove('closed');
            flpMenu.classList.add('open');
            isAnimating = false; // Libera a variável de bloqueio após a animação
        }, 10); // Pequeno atraso para garantir que a transição ocorra
        flpButton.classList.add('on'); // Adiciona a classe "on" ao botão
        flpIcon.style.filter = 'brightness(1)';
    }
}

function toggleMiniSlider(value) {
    const miniSlider = document.getElementById('MiniSlider');
    if (!value) {
        miniSlider.classList.remove('open');
        miniSlider.style.display = 'none';
    } else {
        miniSlider.style.display = 'block';
        miniSlider.classList.add('open');
    }
}

function updateSliderValue(value) {
    document.getElementById('sliderValue').textContent = value;
    if (fplgeneratorrange !== value) {
        fplgeneratorrange = value;
        generateFPL();
    }

    const slider = document.getElementById('slider');
    const percentage = (value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.background = `linear-gradient(to right, #3b6cec ${percentage}%, #202024 ${percentage}%)`;
    document.getElementById('sliderValue').textContent = parseFloat(value).toFixed(1);
}
updateSliderValue(fplgeneratorrange);

function calculateMiniSliderPosition(button) {
    const rect = button.getBoundingClientRect();
    const miniSlider = document.getElementById('MiniSlider');
    miniSlider.style.left = `${rect.right + window.scrollX + 20}px`;
    miniSlider.style.top = `${rect.top + window.scrollY}px`;
}

document.addEventListener('DOMContentLoaded', () => {
    const flpMenu = document.getElementById('FlpMenu');
    if (flpMenu.style.display === 'flex') {
        flpMenu.classList.add('open');
    } else {
        flpMenu.classList.add('closed');
    }
    //
    const generateButton = document.querySelector('.generate');
    generateButton.addEventListener('mouseenter', () => {
        const departureAirport = document.getElementById('departure').value.trim().toUpperCase();
        const depairport = controlAreas.find(area => area.name === departureAirport && area.type === "Airport");
        const arrivalAirport = document.getElementById('arrival').value.trim().toUpperCase();
        const arrairport = controlAreas.find(area => area.name === arrivalAirport && area.type === "Airport");
        if (depairport && arrairport) {
            calculateMiniSliderPosition(generateButton);
            toggleMiniSlider(true);
        }
    });

    generateButton.addEventListener('mouseleave', (event) => {
        const miniSlider = document.getElementById('MiniSlider');
        const vertices = calculateBoundingArea(generateButton, miniSlider, 'right');
        if (isMouseOutsideArea(event, vertices, generateButton)) {
            toggleMiniSlider(false);
        }
    });

    document.addEventListener('mousemove', (event) => {
        const miniSlider = document.getElementById('MiniSlider');
        const generateButton = document.querySelector('.generate');
        const vertices = calculateBoundingArea(generateButton, miniSlider, 'right');
        if (isMouseOutsideArea(event, vertices, generateButton)) {
            toggleMiniSlider(false);
        }
    });
});

function generateFPL() {
    const getValue = id => document.getElementById(id).value.trim().toUpperCase();
    const [departure, departureRwy, arrival, arrivalRwy, waypoints, sid, deptrans, star, arrtrans, app] = 
        ['departure', 'departureRwy', 'arrival', 'arrivalRwy', 'waypoints', 'sid', 'deptrans', 'star', 'arrtrans', 'app'].map(getValue);
    const allPoints = [...controlAreas.filter(a => a.type === "Airport" && (a.name === departure || a.name === arrival)), ...Waypoints];

    const departureAirport = allPoints.find(point => point.name === departure && point.type === "Airport");
    const arrivalAirport = allPoints.find(point => point.name === arrival && point.type === "Airport");

    if (!departureAirport || !arrivalAirport) {
        showMessage('Flight Plan Error', `Airport not found!`);
        return;
    }

    function getNeighbors(point, range) {
        return allPoints.filter(p => calculateDistance(point, p) <= range && p !== point);
    }

    function getPath(start, goal) {
        const startNode = { point: start, g: 0, h: calculateDistance(start, goal), f: 0, parent: null };
        startNode.f = startNode.g + startNode.h;
        const openList = new MinHeap((a, b) => a.f - b.f);
        openList.push(startNode);
        const closedList = new Set();
        const openSet = new Map();
        openSet.set(startNode.point, startNode);
    
        while (!openList.isEmpty()) {
            const currentNode = openList.pop();
            openSet.delete(currentNode.point);
            closedList.add(currentNode.point);
    
            if (currentNode.point === goal) {
                const path = [];
                let current = currentNode;
                while (current) {
                    path.push(current.point);
                    current = current.parent;
                }
                return path.reverse();
            }
    
            const neighbors = getNeighbors(currentNode.point, fplgeneratorrange);
            for (const neighbor of neighbors) {
                if (closedList.has(neighbor)) {
                    continue;
                }
    
                const g = currentNode.g + calculateDistance(currentNode.point, neighbor);
                const h = calculateDistance(neighbor, goal);
                const f = g + h;
    
                if (openSet.has(neighbor)) {
                    const openNode = openSet.get(neighbor);
                    if (g < openNode.g) {
                        openNode.g = g;
                        openNode.f = f;
                        openNode.parent = currentNode;
                        openList.update(openNode);
                    }
                } else {
                    const neighborNode = { point: neighbor, g, h, f, parent: currentNode };
                    openList.push(neighborNode);
                    openSet.set(neighbor, neighborNode);
                }
            }
        }
    
        return null;
    }
    
    // MinHeap implementation for the open list
    class MinHeap {
        constructor(compare) {
            this.compare = compare;
            this.heap = [];
        }
    
        push(node) {
            this.heap.push(node);
            this.bubbleUp(this.heap.length - 1);
        }
    
        pop() {
            if (this.heap.length === 1) return this.heap.pop();
            const top = this.heap[0];
            this.heap[0] = this.heap.pop();
            this.bubbleDown(0);
            return top;
        }
    
        find(predicate) {
            return this.heap.find(predicate);
        }
    
        update(node) {
            const index = this.heap.indexOf(node);
            if (index !== -1) {
                this.bubbleUp(index);
                this.bubbleDown(index);
            }
        }
    
        isEmpty() {
            return this.heap.length === 0;
        }
    
        bubbleUp(index) {
            while (index > 0) {
                const parentIndex = Math.floor((index - 1) / 2);
                if (this.compare(this.heap[index], this.heap[parentIndex]) < 0) {
                    [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
                    index = parentIndex;
                } else {
                    break;
                }
            }
        }
    
        bubbleDown(index) {
            const length = this.heap.length;
            while (true) {
                const leftChildIndex = 2 * index + 1;
                const rightChildIndex = 2 * index + 2;
                let smallest = index;
    
                if (leftChildIndex < length && this.compare(this.heap[leftChildIndex], this.heap[smallest]) < 0) {
                    smallest = leftChildIndex;
                }
    
                if (rightChildIndex < length && this.compare(this.heap[rightChildIndex], this.heap[smallest]) < 0) {
                    smallest = rightChildIndex;
                }
    
                if (smallest !== index) {
                    [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
                    index = smallest;
                } else {
                    break;
                }
            }
        }
    }

    const path = getPath(departureAirport, arrivalAirport);
    if (!path) {
        //showMessage('Flight Plan Error', `No path found between ${departure} and ${arrival}!`);
        flightRoute = [];
        draw();
        return;
    }

    const filteredPath = path.filter(point => point.type !== "Airport");

    flightRoute = path;
    draw();

    const waypointsInput = document.getElementById('waypoints');
    waypointsInput.value = filteredPath.map(point => point.name).join(' ');
}

const ORIGEM_LAT = 54.07; // Latitude da origem do mapa em graus
const ORIGEM_LON = 29.69; // Longitude da origem do mapa em graus
const SCALE = 24.45; // px por grau

function grausParaXY(lat, lon) {
    // Verifica se a latitude e longitude são strings com as direções N/S e E/W
    if (typeof lat === 'string' && typeof lon === 'string') {
        const latDir = lat.slice(-1); // Último caractere indica N ou S
        const lonDir = lon.slice(-1); // Último caractere indica E ou W

        // Remove as direções para converter para número
        lat = parseFloat(lat.slice(0, -1));
        lon = parseFloat(lon.slice(0, -1));

        // Ajusta os valores com base nas direções
        if (latDir === 'S') lat = -lat;
        if (lonDir === 'E') lon = -lon;
    }

    const deltaLat = ORIGEM_LAT - lat; // mais N = Y menor
    const deltaLon = ORIGEM_LON - lon; // mais W = X menor

    const y = deltaLat * SCALE;
    const x = deltaLon * SCALE;

    return [x, y];
}


function parseCoordenadas(coordenadas) {
    // Atualiza o regex para aceitar 0 ou mais casas decimais
    const regex = /^(\d{2}(?:\.\d+)?)([NS])(\d{2}(?:\.\d+)?)([EW])$/;
    const match = coordenadas.match(regex);

    if (!match) {
        throw new Error("Formato inválido de coordenadas. Use o formato DD.ddNDD.ddW.");
    }

    const [, latStr, latDir, lonStr, lonDir] = match;

    let lat = parseFloat(latStr);
    let lon = parseFloat(lonStr);

    if (latDir === "S") lat = -lat;
    if (lonDir === "E") lon = -lon;

    return [lat, lon];
}

function processWaypointInput(input, allPoints, flightPlanPoints) {
    try {
        // Tenta encontrar o waypoint normalmente
        const matchedPoint = allPoints.find(point => point.name === input);
        if (matchedPoint) {
            flightPlanPoints.push(matchedPoint);
        } else {
            // Caso não encontre, tenta processar como coordenadas no formato DD.ddNDD.ddW
            if (/^\d{2}(?:\.\d+)?[NS]\d{2}(?:\.\d+)?[EW]$/.test(input)) {
                const [lat, lon] = parseCoordenadas(input);
                const [x, y] = grausParaXY(lat, lon);
                flightPlanPoints.push({ name: input, coordinates: [x, y], type: "Waypoint" });
            } else {
                // Verifica se é uma Airway
                const matchedAirway = airways.find(airway => airway.name === input);
                if (matchedAirway) {
                    matchedAirway.points.forEach(waypointName => {
                        // Verifica se o waypoint é um nome ou coordenadas
                        if (/^\d{2}(?:\.\d+)?[NS]\d{2}(?:\.\d+)?[EW]$/.test(waypointName)) {
                            // Processa como coordenadas
                            const [lat, lon] = parseCoordenadas(waypointName);
                            const [x, y] = grausParaXY(lat, lon);
                            flightPlanPoints.push({ name: waypointName, coordinates: [x, y], type: "Waypoint" });
                        } else {
                            // Processa como um waypoint normal
                            const waypoint = allPoints.find(point => point.name === waypointName);
                            if (waypoint) {
                                flightPlanPoints.push(waypoint);
                            } else {
                                // Caso o waypoint da Airway não seja encontrado, exibe um erro
                                showMessage('Flight Plan Error', `Waypoint "${waypointName}" in Airway "${input}" not found!`);
                            }
                        }
                    });
                } else if (input !== "") {
                    // Se não for um waypoint válido nem coordenadas nem uma Airway, exibe o erro
                    showMessage('Flight Plan Error', `Waypoint or Airway "${input}" not found!`);
                }
            }
        }
    } catch (error) {
        showMessage('Flight Plan Error', error.message);
    }
}

function saveFlp() {
    const getValue = id => document.getElementById(id).value.trim().toUpperCase();
    const [departure, departureRwy, arrival, arrivalRwy, waypoints, sid, deptrans, star, arrtrans, app] = 
        ['departure', 'departureRwy', 'arrival', 'arrivalRwy', 'waypoints', 'sid', 'deptrans', 'star', 'arrtrans', 'app'].map(getValue);
    
    const inputPoints = waypoints.split(' ').map(wp => wp.trim()).filter(wp => wp); // Remove entradas vazias
    const allPoints = [...controlAreas.filter(a => a.type === "Airport"), ...CustomWaypoints, ...Waypoints];
    const flightPlanPoints = [];

    const scaleFactor = (1478 / 1852) / Math.sqrt((534.22 - 512.13) ** 2 + (243.11 - 225.89) ** 2);

    function findAirport(name) {
        return allPoints.find(point => point.name === name && point.type === "Airport");
    }

    function calculateAlignmentPoint(airport, runwayNumber, rotate) {
        const runway = airport.runways.find(rwy => rwy.number === runwayNumber);
        if (!runway) return null;

        const hdgRad = (runway.hdg - (rotate ? 180 : 0)) * (Math.PI / 180);
        const distanceEuclidean = (1.5 / scaleFactor);
        const baseCoordinates = runway.coordinates || airport.coordinates;

        return {
            name: runwayNumber,
            coordinates: [
                baseCoordinates[0] + distanceEuclidean * Math.sin(hdgRad),
                baseCoordinates[1] - distanceEuclidean * Math.cos(hdgRad)
            ],
            type: "Waypoint"
        };
    }

    function addRunway(airport, runwayNumber, align) {
        const runway = airport.runways.find(rwy => rwy.number === runwayNumber);
        if (!runway || !runway.coordinates) {
            showMessage('Flight Plan Error', `Runway "${runwayNumber}" not found at "${airport.name}"!`);
            return false;
        }
        if (align === 'departure') {
            flightPlanPoints.push({ name: "", coordinates: runway.coordinates, type: "Runway" });
            const alignmentPoint = calculateAlignmentPoint(airport, runwayNumber, false);
            if (alignmentPoint) flightPlanPoints.push(alignmentPoint);
        } else if (align === 'arrival') {
            const alignmentPoint = calculateAlignmentPoint(airport, runwayNumber, true);
            if (alignmentPoint) flightPlanPoints.push(alignmentPoint);
            flightPlanPoints.push({ name: "", coordinates: runway.coordinates, type: "Runway" });
        } else {
            flightPlanPoints.push({ name: "", coordinates: runway.coordinates, type: "Runway" });
        }
        return true;
    }
    
    function addProcedure(airport, type, name, transition, runway) {
        if (!name) return false;
    
        let procedure;
        if (type === 'APPs') {
            // O APP não tem transition, então encontramos apenas pelo nome
            procedure = airport[type]?.find(proc => proc.name === name && proc.rwy.includes(runway));
        } else {
            // Para SIDs e STARs, mantém-se a lógica original
            procedure = airport[type]?.find(proc => proc.name === name && proc.transition === transition && proc.rwy.includes(runway));
        }
    
        if (!procedure) {
            showMessage('Flight Plan Error', `${type.toUpperCase()} "${name}" ${type === 'APPs' ? '' : `with transition "${transition}" `}not found at "${airport.name}"!`);
            return false;
        }
    
        procedure.waypoints.forEach(wp => {
            const matchedPoint = allPoints.find(point => point.name === wp);
            if (matchedPoint) flightPlanPoints.push(matchedPoint);
        });
    
        return true;
    }

    const departureAirport = findAirport(departure);
    const arrivalAirport = findAirport(arrival);

    // Adiciona o aeroporto de partida, se existir
    if (departureAirport) {
        if (departureRwy) {
            addRunway(departureAirport, departureRwy, 'departure');
            addProcedure(departureAirport, 'SIDs', sid, deptrans, departureRwy);
        } else {
            flightPlanPoints.push({ name: departure, coordinates: departureAirport.coordinates, type: "Airport" });
        }
    }

    // Processa os waypoints intermediários
    inputPoints.forEach(input => {
        processWaypointInput(input, allPoints, flightPlanPoints);
    });

    // Adiciona o aeroporto de chegada, se existir
    if (arrivalAirport) {
        if (arrivalRwy) {
            addProcedure(arrivalAirport, 'STARs', star, arrtrans, arrivalRwy);
            if (addProcedure(arrivalAirport, 'APPs', app, '', arrivalRwy)) {
                addRunway(arrivalAirport, arrivalRwy, app ? false : 'arrival')
            }
        } else {
            flightPlanPoints.push({ name: arrival, coordinates: arrivalAirport.coordinates, type: "Airport" });
        }
    }

    // Verifica se há pelo menos dois pontos no plano de voo
    if (flightPlanPoints.length < 2) {
        showMessage('Flight Plan Error', 'A flight plan requires at least two points!');
        return;
    }

    flightRoute = flightPlanPoints;
    draw();
}

function resetFlp() {
    // Limpa os valores das text areas pelos seus IDs
    document.getElementById('departure').value = '';
    document.getElementById('departureRwy').value = '';
    document.getElementById('arrival').value = '';
    document.getElementById('arrivalRwy').value = '';
    document.getElementById('waypoints').value = '';
    document.getElementById('sid').value = '';
    document.getElementById('deptrans').value = '';
    document.getElementById('star').value = '';
    document.getElementById('arrtrans').value = '';
    document.getElementById('app').value = '';
    

    // Reseta a rota de voo
    flightRoute = [];
    draw();
}

function getProcedures(airport, runway, type) {
    if (!airport || !runway) return [];

    const procedures = airport[type];
    if (!procedures) return [];

    return procedures.filter(proc => proc.rwy.includes(runway)).map(proc => proc.name);
}

function createList(type, items) {
    const textarea = document.getElementById(type);
    if (!textarea) {
        console.error(`Textarea with ID "${type}" not found!`);
        return;
    }

    // Remove duplicatas usando um Set
    const uniqueOptions = [...new Set(items)];

    // Ordena as opções alfabeticamente
    uniqueOptions.sort();

    // Cria o container da lista
    const listContainer = document.createElement('div');
    listContainer.className = 'list-container';
    listContainer.style.width = `${textarea.offsetWidth}px`;

    // Posiciona o container da lista abaixo da textarea
    const rect = textarea.getBoundingClientRect();
    listContainer.style.left = `${rect.left + window.scrollX}px`;
    listContainer.style.top = `${rect.bottom + window.scrollY}px`;

    // Função para atualizar a lista com base no filtro
    function updateList(filter) {
        listContainer.innerHTML = ''; // Limpa a lista atual

        const filteredOptions = uniqueOptions
            .filter(option => option.toLowerCase().includes(filter.toLowerCase()))
            .sort();

        filteredOptions.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;

            // Evento de clique para preencher a textarea com a opção selecionada
            button.addEventListener('click', () => {
                if (type === 'waypoints') {
                    // Adiciona o valor selecionado ao valor existente na textarea de waypoints
                    const words = textarea.value.split(' ');
                    words[words.length - 1] = option;
                    textarea.value = words.join(' ') + ' ';
                } else {
                    // Substitui o valor da textarea com o valor selecionado
                    textarea.value = option;
                }
                if (document.body.contains(listContainer)) {
                    document.body.removeChild(listContainer); // Remove a lista após a seleção
                }
            });

            listContainer.appendChild(button);
        });
    }

    // Adiciona os botões de opções à lista inicialmente
    updateList('');

    // Adiciona o container da lista ao corpo do documento
    document.body.appendChild(listContainer);

    // Adiciona evento de input para filtrar a lista
    textarea.addEventListener('input', () => {
        const filter = type === 'waypoints' ? textarea.value.split(' ').pop() : textarea.value;
        updateList(filter);
    });

    // Remove a lista se clicar fora dela
    document.addEventListener('click', function handleClickOutside(event) {
        if (!listContainer.contains(event.target) && event.target !== textarea) {
            if (document.body.contains(listContainer)) {
                document.body.removeChild(listContainer);
            }
            document.removeEventListener('click', handleClickOutside);
        }
    });
}

document.getElementById('departure').addEventListener('focus', () => {
    createList('departure', sortedAirports);
});

document.getElementById('arrival').addEventListener('focus', () => {
    createList('arrival', sortedAirports);
});

document.getElementById('departureRwy').addEventListener('focus', () => {
    const departureAirport = document.getElementById('departure').value.trim().toUpperCase();
    const airport = controlAreas.find(area => area.name === departureAirport && area.type === "Airport");
    const departureInput = document.getElementById('departure');
    if (!airport) {
        departureInput.style.borderColor = 'red';
    } else {
        const runways = airport.runways.map(rwy => rwy.number);
        createList('departureRwy', runways);
    }
});

document.getElementById('departureRwy').addEventListener('blur', () => {
    document.getElementById('departure').style.borderColor = ''; // Reseta a cor da borda
});

document.getElementById('arrivalRwy').addEventListener('focus', () => {
    const arrivalAirport = document.getElementById('arrival').value.trim().toUpperCase();
    const airport = controlAreas.find(area => area.name === arrivalAirport && area.type === "Airport");
    const arrivalInput = document.getElementById('arrival');
    if (!airport) {
        arrivalInput.style.borderColor = 'red';
    } else {
        const runways = airport.runways.map(rwy => rwy.number);
        createList('arrivalRwy', runways);
    }
});

document.getElementById('arrivalRwy').addEventListener('blur', () => {
    document.getElementById('arrival').style.borderColor = ''; // Reseta a cor da borda
});

document.getElementById('waypoints').addEventListener('focus', () => {
    createList('waypoints', [...sortedWaypoints]); //, ...airways.map(airway => airway.name)
});

document.getElementById('sid').addEventListener('focus', () => {
    const departureAirportName = document.getElementById('departure').value.trim().toUpperCase();
    const departureRwy = document.getElementById('departureRwy').value.trim().toUpperCase();
    const airport = controlAreas.find(area => area.name === departureAirportName && area.type === "Airport");

    if (airport) {
        const sids = getProcedures(airport, departureRwy, 'SIDs');
        createList('sid', sids);
    }
});

document.getElementById('deptrans').addEventListener('focus', () => {
    const departureAirportName = document.getElementById('departure').value.trim().toUpperCase();
    const departureRwy = document.getElementById('departureRwy').value.trim().toUpperCase();
    const sidName = document.getElementById('sid').value.trim();
    const airport = controlAreas.find(area => area.name === departureAirportName && area.type === "Airport");

    if (airport) {
        const sidProcedures = airport.SIDs.filter(proc => proc.name === sidName);
        const transitions = sidProcedures
            .filter(proc => proc.rwy.includes(departureRwy)) // Filtro por RWY
            .map(proc => proc.transition)
            .filter(Boolean);

        createList('deptrans', transitions);
    }
});

document.getElementById('star').addEventListener('focus', () => {
    const arrivalAirportName = document.getElementById('arrival').value.trim().toUpperCase();
    const arrivalRwy = document.getElementById('arrivalRwy').value.trim().toUpperCase();
    const airport = controlAreas.find(area => area.name === arrivalAirportName && area.type === "Airport");

    if (airport) {
        const stars = getProcedures(airport, arrivalRwy, 'STARs');
        createList('star', stars);
    }
});

document.getElementById('arrtrans').addEventListener('focus', () => {
    const arrivalAirportName = document.getElementById('arrival').value.trim().toUpperCase();
    const arrivalRwy = document.getElementById('arrivalRwy').value.trim().toUpperCase();
    const starName = document.getElementById('star').value.trim();
    const airport = controlAreas.find(area => area.name === arrivalAirportName && area.type === "Airport");

    if (airport) {
        const starProcedures = airport.STARs.filter(proc => proc.name === starName);
        const transitions = starProcedures
            .filter(proc => proc.rwy.includes(arrivalRwy)) // Filtro por RWY
            .map(proc => proc.transition)
            .filter(Boolean);

        createList('arrtrans', transitions);
    }
});

document.getElementById('app').addEventListener('focus', () => {
    const arrivalAirportName = document.getElementById('arrival').value.trim().toUpperCase();
    const arrivalRwy = document.getElementById('arrivalRwy').value.trim().toUpperCase();
    const airport = controlAreas.find(area => area.name === arrivalAirportName && area.type === "Airport");

    if (airport) {
        const apps = getProcedures(airport, arrivalRwy, 'APPs');
        createList('app', apps);
    }
});

function resetHighlights() {
    controlAreas.forEach(area =>{
        if (area.type === "polygon") {
            if (area.name.endsWith("CTR")) {
                area.fillColor = area.originalFillColor;
            };
            if (area.name.endsWith("CTR2")) {
                area.fillColor = area.originalFillColor;
            };
            if (area.name.endsWith("APP")) {
                area.fillColor = area.originalFillColor;
            };
        };
    });
    draw();
}

function refreshUI() {
    draw();
    document.querySelectorAll('.airport-ui').forEach(el => el.remove());
    displayAirports();
    resetHighlights();
}

function updateATCCount() {
    const atcNumberElement = document.querySelector('.online-number');
    if (atcNumberElement) {
        const onlineCount = Object.values(onlineATCs).reduce((count, atcs) => {
            return count + Object.entries(atcs).reduce((subCount, [position, atcList]) => {
                if (position !== 'ATS') {
                    return subCount + atcList.length;
                }
                return subCount;
            }, 0);
        }, 0);
        atcNumberElement.textContent = onlineCount;
    }
}

function processATCData(atcList) {
    updateOnlineATCs(atcList);
    updateATCUI();
}

let fetchATCDataAndUpdateTimesExecuted = 0;
let typeOfDataReceivedTimesExecuted = 0;

function getUniqueUserId() {
    let userId = localStorage.getItem("uniqueUserId");
    if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem("uniqueUserId", userId);
    }
    return userId;
}

const uniqueUserId = getUniqueUserId();
const defaultURL = 'https://24data.ptfs.app/api/controllers';
const API_URL = 'https://tico09.com/api/v1/controllers';

async function fetchATCData(url) {
    try {
        const response = url === defaultURL 
            ? await fetch(url) 
            : await fetch(url, { headers: { 'uniqueid': uniqueUserId } });

        if (!response.ok) throw new Error(`Erro ao buscar dados: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Erro ao buscar dados de ${url}:`, error);
        return null;
    }
}

async function fetchATCDataAndUpdate() {
    let data;
    let typeOfDataReceived = '';
    function toggleUpdateClass() {
        const mapUpdateTime = document.getElementById('mapUpdateTime');
        mapUpdateTime.style.backgroundColor = '#ff7a00';
        mapUpdateTime.style.color = '#ffffff'; // Change text color to white
    }
    toggleUpdateClass();

    if (devMode) {
        data = PTFSAPIError;
    } else {
        data = await fetchATCData(API_URL);
    }

    if (!settingsValues.showOnlineATC) {
        onlineATCs = {};
        processATCData([]);

        const mapUpdateTime = document.getElementById('mapUpdateTime');
        setTimeout(() => {
            mapUpdateTime.style.backgroundColor = 'rgba(32, 32, 36, 1)';
            mapUpdateTime.style.color = ''; // Restore default text color
        }, 150);

        return;
    }

    if (!data) {
        data = await fetchATCData(defaultURL);
        typeOfDataReceived = 'defaultURL';
    }

    if (data) {
        const newATCList = data;
        const newATCCount = newATCList.length;
        const currentATCCount = Object.values(onlineATCs).reduce((count, atcs) => {
            return count + Object.values(atcs).flat().length;
        }, 0);

        if (newATCCount !== currentATCCount) {
            PTFSAPI = newATCList;
            processATCData(PTFSAPI);
        } else {
            const newATCNames = newATCList.map(atc => atc.holder).sort().join(',');
            const currentATCNames = Object.values(onlineATCs).flatMap(atcs => Object.values(atcs).flat().map(atc => atc.holder)).sort().join(',');

            if (newATCNames !== currentATCNames) {
                PTFSAPI = newATCList;
                processATCData(PTFSAPI);
            }
        }
    } else {
        if (!window.location.href.includes('DEV')) {
            await showMessage('Server Error', 'Couldn’t get the info from the server, please check your internet connection.', 'Retry');
            await fetchATCDataAndUpdate();
        }
        PTFSAPI = null;
        processATCData(PTFSAPI);
    }

    document.querySelector('.mapUpdateTime .time').textContent = ` ${getTime()}`;
    if (!window.location.href.includes('DEV')) {
        fetchATCDataAndUpdateTimesExecuted += 1;
        if (fetchATCDataAndUpdateTimesExecuted >= 5) {
            fetchATCDataAndUpdateTimesExecuted = 0;
            checkUpdate();
        }
    }

    const mapUpdateTime = document.getElementById('mapUpdateTime');
    setTimeout(() => {
        mapUpdateTime.style.backgroundColor = 'rgba(32, 32, 36, 1)';
        mapUpdateTime.style.color = ''; // Restore default text color
    }, 150);

    if (typeOfDataReceived === 'defaultURL' && typeOfDataReceivedTimesExecuted === 0) {
        typeOfDataReceivedTimesExecuted = 1;
        showMessage('24SPY API Offline', 'The 24SPY API is currently offline. The data is being fetched from the ATC24 API, some website features may not work correctly.', 'Close', 'Try Again').then(response => {
            if (response === 2) {
                fetchATCDataAndUpdate();
                typeOfDataReceivedTimesExecuted = 0;
            }
        });
    }
}

// Função para verificar atualizações
async function checkUpdate() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/tiaguinho2009/24SPY-Backend/main/version');
        if (!response.ok) throw new Error(`Erro ao buscar versão: ${response.status}`);
        
        const versionContent = await response.text();
        if (versionContent.trim() !== localInfo.version.trim()) {
            showMessage('New Version', `The version ${versionContent} is now available! Enjoy the update!`, 'Update').then(response => {
                if (response === 1) location.replace(`${location.href.split('?')[0]}?forceReload=${Date.now()}`);
            });
        }
    } catch (error) {
        console.error('Erro ao buscar versão:', error);
    }
}

function saveToLocalStorage() {
    localStorage.setItem('settingsValues', JSON.stringify(settingsValues));
    localStorage.setItem('websiteInfo', JSON.stringify(websiteInfo));
}

function loadFromLocalStorage() {
    const storedSettings = localStorage.getItem('settingsValues');
    const storedWebsiteInfo = localStorage.getItem('websiteInfo');

    if (storedSettings) {
        Object.assign(settingsValues, JSON.parse(storedSettings));
        console.log('settingsValues carregado do localStorage:', settingsValues);
    } else {
        console.log('Nenhum settingsValues encontrado no localStorage. Usando valores padrão.');
    }

    // Atualiza os checkboxes com base nos valores de settingsValues
    for (const key in settingsValues) {
        if (settingsValues.hasOwnProperty(key)) {
            const checkbox = document.getElementById(key);
            if (checkbox) {
                checkbox.checked = settingsValues[key];
            }
        }
    }

    if (storedWebsiteInfo) {
        Object.assign(localInfo, JSON.parse(storedWebsiteInfo));
        console.log('websiteInfo carregado do localStorage:', websiteInfo);
    } else {
        console.log('Nenhum websiteInfo encontrado no localStorage. Usando valores padrão.');
    }

    if (websiteInfo.version !== localInfo.version) {
        toggleChangeLogMenu();
        saveToLocalStorage();
    }
}
loadFromLocalStorage();

function onCheckBoxChange(checkbox) {
    settings.forEach(setting => {
        if (setting === checkbox.id) {
            settingsValues[setting] = checkbox.checked;
            saveToLocalStorage()
            draw()
            refreshUI()
        };
        if (setting === "showOnlineATC") {fetchATCDataAndUpdate()};
    });
}

function getTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;

    return timeString;
}

function copyCoordinatesToClipboard(x, y) {
    const coordsText = `[${x.toFixed(2)}, ${y.toFixed(2)}]`;
    navigator.clipboard.writeText(coordsText).then(() => {
        console.log(`Coordenadas copiadas: ${coordsText}`);
    }).catch(err => {
        showMessage('Clipboard Error', 'Failed to copy coordinates to clipboard.');
        console.error('Failed to copy coordinates to clipboard.', err);
    });
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'ç') { // Verifica se a tecla pressionada é "ç"
        const mouseX = (lastMouseX - canvas.getBoundingClientRect().left - offsetX) / scale;
        const mouseY = (lastMouseY - canvas.getBoundingClientRect().top - offsetY) / scale;
        copyCoordinatesToClipboard(mouseX, mouseY);
    }
});

function executeOnce() {
    const hasExecuted = localStorage.getItem('hasExecuted');

    if (!hasExecuted) {
        showMessage("24SPY Discord Server", "How about joining our Discord Server, where you can receive updated news about 24SPY, make suggestions and questions and much more?", "Join", "Close").then((response) => {
            if (response === 1) {
                window.open("https://discord.gg/8cQAguPjkh", "_blank");
            }
        });

        // Defina a variável no localStorage para indicar que a função já foi executada
        localStorage.setItem('hasExecuted', 'true');
    }
}
executeOnce();
