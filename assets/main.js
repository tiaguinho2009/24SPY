// prevent right click menu from appearing and annoying people - awdev1
document.addEventListener('contextmenu', function(event) {
	event.preventDefault();
});
const canvas = document.getElementById('map');
const ctx = canvas.getContext('2d');

let offsetX = 0,
	offsetY = 0;
let scale = 1;
let isDragging = false;
let startX, startY;
let onlineATC = 0;
let flightRoute = [];
let onlineATCs = {};

const positionMapping = {
    center: 'CTR',
    control: 'CTR',
    approach: 'APP',
    departure: 'APP',
    director: 'APP',
    tower: 'TWR',
    ground: 'GND',
    delivery: 'DEL',
    atis: 'ATS',
    ats: 'ATS'
};

const positionMapping2 = {
    CTR: 'CTR',
    OCA: 'CTR',
    OCC: 'CTR',
    APP: 'APP',
    DEP: 'APP',
    DIR: 'APP',
    TWR: 'TWR',
    RDO: 'TWR',
    GND: 'GND',
    DEL: 'DEL',
    ATS: 'ATS'
}

const sortedAirports = controlAreas
	.filter(area => area.type === "Airport")
	.map(area => area.name)
	.sort();

const sortedWaypoints = Waypoints
	.map(wp => wp.name)
	.sort();

const mapImages = {
    normal: 'PTFS-Map-Grey.png',
    smallScale: 'PTFS-Map-1200px.png'
};
const mapImageNormal = new Image();
const mapImageSmallScale = new Image();
mapImageNormal.src = mapImages.normal;
mapImageSmallScale.src = mapImages.smallScale;

let currentMapImage = mapImageSmallScale;

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

// Configuração do tamanho do canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 50;
    draw();
    centerMap(); // Centraliza o mapa após redimensionar o canvas
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

function updateOnlineATCs(atcList) {
    onlineATCs = {};

    atcList.forEach(atcData => {
        const { holder, claimable, airport, position, uptime, frequency: initialFrequency } = atcData;
        if (claimable) return;

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

        onlineATCs[airport][mappedPosition].push({ holder, uptime, frequency });
    });
}

// Função para verificar se um ATC está online
function isATCOnline(airport, position) {
    const mappedPosition = positionMapping[position];
    return onlineATCs[airport] && onlineATCs[airport][mappedPosition].length > 0;
}

// Função para obter a lista de ATCs online em um aeroporto
function getOnlineATCs(airport) {
    return onlineATCs[airport] || { TWR: [], GND: [], APP: [], CTR: [], DEL: [], ATS: [] };
}

function isSpecialUser(atcName) {
    const baseName = atcName.split(' | ')[0];
    return Object.keys(specialUsers).includes(baseName);
}

// Função de desenho
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (settingsValues.showBetterMap) {
        currentMapImage = scale < 10 ? mapImageSmallScale : mapImageNormal;
    } else {
        currentMapImage = mapImageSmallScale;
    }

    // Calcula tamanho ajustado do mapa
    const mapWidth = 1200 * scale;
    const mapHeight = 1200 * scale;

    // Desenha a imagem do mapa
    ctx.drawImage(currentMapImage, offsetX, offsetY, mapWidth, mapHeight);

    drawControlAreas();
    drawFlightPlan(flightRoute);
    resetChartsMenu();
    drawNavaids();
    updateAllAirportsUI();
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

		// Calcula a distância diretamente das coordenadas sem transformá-las
		const dxRaw = next.coordinates[0] - current.coordinates[0];
		const dyRaw = next.coordinates[1] - current.coordinates[1];
		const distanceEuclidean = Math.sqrt(dxRaw ** 2 + dyRaw ** 2);
		const distanceNM = (distanceEuclidean * scaleFactor).toFixed(2);

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

// Função para atualizar a posição do aeroporto
function updatePosition(airportUI, airport) {
	if (scale < airport.scale) {
		airportUI.style.display = 'none';
		return;
	} else {
		airportUI.style.display = 'block';
	}

	const [x, y] = transformCoordinates(airport.coordinates);
	const uiWidth = airportUI.offsetWidth;
	const uiHeight = airportUI.offsetHeight;

	airportUI.style.left = `${x - uiWidth / 2}px`;
	airportUI.style.top = `${y + uiHeight / 2}px`;
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

function highlightCTR(ctrName) {
    controlAreas.forEach(area => {
        if (area.type === 'polygon' && area.name === ctrName) {
            area.originalFillColor = area.fillColor;
            area.fillColor = 'rgba(0, 255, 125, 0.075)';
            draw();
        }
    });
}

function resetCTRHighlight(ctrName) {
    controlAreas.forEach(area => {
        if (area.type === 'polygon' && area.name === ctrName) {
            area.fillColor = area.originalFillColor;
            draw();
        }
    });
}

function highlightAPP(appName) {
    controlAreas.forEach(area => {
        if (area.type === 'polygon' && area.name === appName) {
            area.originalFillColor = area.fillColor;
            area.fillColor = 'rgba(255, 122, 0, 0.1)';
            draw();
        }
    });
}

function resetAPPHighlight(appName) {
    controlAreas.forEach(area => {
        if (area.type === 'polygon' && area.name === appName) {
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
        ${generateBadges(airport)}
    `;

    if (airportUI.querySelector('.badge')) {
		airportUI.style.backgroundColor = "rgba(40, 40, 55, 0.5)";
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

    return `
        ${atcs.CTR.length > 0 ? '<div class="badge C">C</div>' : ''}
        ${atcs.APP.length > 0 ? '<div class="badge A">A</div>' : ''}
        ${atcs.TWR.length > 0 ? '<div class="badge T">T</div>' : ''}
        ${atcs.GND.length > 0 ? '<div class="badge G">G</div>' : ''}
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
    if (airport.charts) {
        airport.charts.forEach(([chartName, chartLink]) => {
            const chartButton = document.createElement('button');
            chartButton.className = 'chart-button';
            chartButton.textContent = chartName;
            chartButton.onclick = () => window.open(chartLink, '_blank');
            chartsButtonsContainer.appendChild(chartButton);
        });
    } else {
        chartsButtonsContainer.innerHTML = `<div class="no-charts">No charts available</div>`;
    }
}

function toggleIcaoMenu(menu, airport) {
    if (menu.style.display === 'none' || !menu.style.display) {
        resetChartsMenu();
        menu.style.display = 'block';
        const [x, y] = transformCoordinates(airport.coordinates);
        menu.style.left = `${x - menu.offsetWidth / 2}px`;
        menu.style.top = `${y - menu.offsetHeight + 15}px`;
    } else {
        menu.style.display = 'none';
    }
}

function addBadgeEventListeners(airport, airportUI, infoMenu) {
    const badges = {
        C: { condition: airport.ctr, highlight: highlightCTR, reset: resetCTRHighlight },
        A: { condition: airport.app, highlight: highlightAPP, reset: resetAPPHighlight },
        T: { condition: airport.tower },
        G: { condition: airport.ground },
        D: { condition: airport.delivery }
    };

    Object.entries(badges).forEach(([key, { condition, highlight, reset }]) => {
        const badge = airportUI.querySelector(`.badge.${key}`);
        if (badge && condition) {
            badge.addEventListener('mouseenter', () => {
                showInfoMenu(badge, airport, infoMenu, airportUI);
                if (highlight) highlight(condition);
            });
            badge.addEventListener('mouseleave', () => {
                hideInfoMenu(infoMenu);
                if (reset) reset(condition);
            });
        }
    });
}

function showInfoMenu(badge, airport, menu, airportUI) {
    const positions = { C: 'Control', A: 'Approach', T: 'Tower', G: 'Ground', D: 'Delivery' };
    const position = positions[badge.classList[1]] || 'Unknown';
    let atcName = 'N/A';
    let frequency = 'N/A';
    let uptime = 'N/A';
    const ATCs = getOnlineATCs(airport.real_name);
    console.log(ATCs);

    if (ATCs[positionMapping[position.toLowerCase()]] && ATCs[positionMapping[position.toLowerCase()]].length > 0) {
        atcName = ATCs[positionMapping[position.toLowerCase()]][0].holder || 'N/A';
        frequency = ATCs[positionMapping[position.toLowerCase()]][0].frequency || 'N/A';
        uptime = ATCs[positionMapping[position.toLowerCase()]][0].uptime || 'N/A';
    }

    const baseName = atcName.split(' | ')[0];
    const specialUser = isSpecialUser(baseName);
    const specialTag = specialUser ? `<div class="special-tag">${specialUsers[baseName][0].Role}</div>` : '';

    menu.style.display = 'block';
    menu.innerHTML = `
        <div class="title">${airport.real_name} ${position} ${specialTag}</div>
        <hr class="menu-divider">
        <div class="controller-info-section">
            <p><strong>Controller:</strong> ${atcName}</p>
            <p><strong>Frequency:</strong> ${frequency}</p>
            <p><strong>Online:</strong> ${uptime}</p>
        </div>
    `;
    positionInfoMenu(menu, airportUI);
}

function positionInfoMenu(menu, airportUI) {
    const rect = airportUI.getBoundingClientRect();
    menu.style.left = `${rect.left + window.scrollX}px`;
    menu.style.top = `${rect.bottom + window.scrollY + 10}px`;
}

function hideInfoMenu(menu) {
    menu.style.display = 'none';
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

// Exibe os aeroportos na inicialização
displayAirports();

let velocityX = 0, velocityY = 0;
let friction = 0.85;
const MIN_VELOCITY_THRESHOLD = 0.1;

canvas.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // Verifica se o botão pressionado é o esquerdo
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    velocityX = 0;
    velocityY = 0;
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDragging || e.button !== 0) return; // Verifica se o botão pressionado é o esquerdo
    const currentX = e.clientX;
    const currentY = e.clientY;

    // Calcula o deslocamento
    const dx = currentX - startX;
    const dy = currentY - startY;

    // Atualiza a posição do mapa
    offsetX += dx;
    offsetY += dy;

    // Calcula a velocidade apenas se houver movimento significativo
    if (Math.abs(dx) > MIN_VELOCITY_THRESHOLD || Math.abs(dy) > MIN_VELOCITY_THRESHOLD) {
        velocityX = dx;
        velocityY = dy;
    } else {
        velocityX = 0; // Considera que o rato está parado
        velocityY = 0;
    }

    // Atualiza o ponto inicial
    startX = currentX;
    startY = currentY;

    // Redesenha o canvas
    draw();
});

canvas.addEventListener('mouseup', (e) => {
    if (e.button !== 0) return; // Verifica se o botão pressionado é o esquerdo
    isDragging = false;

    // Só aplica inércia se a velocidade for significativa
    if (Math.abs(velocityX) > MIN_VELOCITY_THRESHOLD || Math.abs(velocityY) > MIN_VELOCITY_THRESHOLD) {
        applyInertia();
    }
});

canvas.addEventListener('mouseleave', (e) => {
    if (e.button !== 0) return; // Verifica se o botão pressionado é o esquerdo
    isDragging = false;
});

function applyInertia() {
	// Aplica a inércia até que a velocidade seja insignificante
	if (Math.abs(velocityX) > MIN_VELOCITY_THRESHOLD || Math.abs(velocityY) > MIN_VELOCITY_THRESHOLD) {
		offsetX += velocityX;
		offsetY += velocityY;

		// Aplica atrito para reduzir a velocidade gradualmente
		velocityX *= friction;
		velocityY *= friction;

		draw();

		// Continua a aplicar inércia
		requestAnimationFrame(applyInertia);
	} else {
		// Zera as velocidades quando a inércia para
		velocityX = 0;
		velocityY = 0;
	}
}

let isZooming = false;

// Função para animar o zoom
function animateZoom(startScale, endScale, startX, endX, startY, endY, duration) {
    const startTime = performance.now();

    function animationStep(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        // Interpolação linear para a escala e coordenadas
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

// Evento de zoom
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();

    if (!isZooming) {
        isZooming = true;

        requestAnimationFrame(() => {
            // Captura a posição do mouse relativa ao canvas
            const mouseX = (e.clientX - canvas.getBoundingClientRect().left - offsetX) / scale;
            const mouseY = (e.clientY - canvas.getBoundingClientRect().top - offsetY) / scale;

            // Ajusta a taxa de zoom dinamicamente com base na escala atual
            const baseZoomRate = 0.005; // Taxa de zoom base
            const zoomRate = baseZoomRate * scale; // Ajusta a taxa de zoom conforme a escala aumenta
            const zoomFactor = e.deltaY * -zoomRate;

            // Define um limite de zoom out mínimo e máximo
            const minScale = 0.5; // Limite de zoom out
            const maxScale = 15; // Limite de zoom in

            // Calcula a nova escala e aplica os limites
            const newScale = Math.min(Math.max(minScale, scale + zoomFactor), maxScale);

            // Se o zoom estiver dentro dos limites, ajusta o offset; caso contrário, mantém o último offset
            if (newScale !== scale) {
                // Calcula o novo offset para centralizar o zoom no ponto do mouse
                const newOffsetX = mouseX * (scale - newScale) + offsetX;
                const newOffsetY = mouseY * (scale - newScale) + offsetY;

                // Anima o zoom
                animateZoom(scale, newScale, offsetX, newOffsetX, offsetY, newOffsetY, 200);
            } else {
                isZooming = false;
            }
        });
    }
});

// Carregar as imagens e inicializar o canvas
Promise.all([
	new Promise((resolve) => (mapImageNormal.onload = resolve)),
	new Promise((resolve) => (mapImageSmallScale.onload = resolve))
]).then(resizeCanvas);

let lastMouseX = 0;
let lastMouseY = 0;

// Captura a posição do mouse no canvas
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

function toggleFlpMenu() {
	const FlpMenu = document.getElementById('FlpMenu');
	const FlpButton = document.getElementById('FlpButton');
	const FlpIcon = document.getElementById('FlpIcon');

	// Alterna o menu entre visível e escondido
	if (FlpMenu.style.display === 'none' || FlpMenu.style.display === '') {
		FlpMenu.style.display = 'flex'; // Mostra o menu
		FlpButton.classList.add('on'); // Adiciona a classe "on" ao botão
		FlpIcon.style.filter = 'brightness(1)';
	} else {
		FlpMenu.style.display = 'none'; // Esconde o menu
		FlpButton.classList.remove('on'); // Remove a classe "on" do botão
		FlpIcon.style.filter = 'brightness(0.8)';
	}
}

function saveFlp() {
    const getValue = id => document.getElementById(id).value.trim().toUpperCase();
    const [departure, departureRwy, arrival, arrivalRwy, waypoints, sid, deptrans, star, arrtrans, app] = 
        ['departure', 'departureRwy', 'arrival', 'arrivalRwy', 'waypoints', 'sid', 'deptrans', 'star', 'arrtrans', 'app'].map(getValue);
    
    const inputPoints = waypoints.split(' ').map(wp => wp.trim());
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
    
    const departureAirport = findAirport(departure);
    const arrivalAirport = findAirport(arrival);
    if (!departureAirport || !arrivalAirport) {
        showMessage('Flight Plan Error', `Airport not found!`);
        return;
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
		if (!name) return true;
	
		let procedure;
		if (type === 'APPs') {
			// O APP não tem transition, então encontramos apenas pelo nome
			procedure = airport[type]?.find(proc => proc.name === name && proc.rwy.includes(transition));
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
    
    if (!addRunway(departureAirport, departureRwy, 'departure')) return;
    if (!addProcedure(departureAirport, 'SIDs', sid, deptrans, departureRwy)) return;
    
    inputPoints.forEach(input => {
        const matchedPoint = allPoints.find(point => point.name === input);
        if (matchedPoint) flightPlanPoints.push(matchedPoint);
        else if (input !== "") showMessage('Flight Plan Error', `Waypoint "${input}" not found!`);
    });
    
    if (!addProcedure(arrivalAirport, 'STARs', star, arrtrans, arrivalRwy)) return;
    if (!addProcedure(arrivalAirport, 'APPs', app, arrivalRwy)) return;
    if (!addRunway(arrivalAirport, arrivalRwy, app ? false : 'arrival')) return;
    
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

function createList(textareaId, options) {
    const textarea = document.getElementById(textareaId);
    if (!textarea) {
        console.error(`Textarea with ID "${textareaId}" not found!`);
        return;
    }

    // Remove duplicatas usando um Set
    const uniqueOptions = [...new Set(options)];

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

    // Função para calcular a proximidade da correspondência
    function calculateMatchScore(option, filter) {
        if (option.startsWith(filter)) {
            return 0; // Melhor correspondência
        } else if (option.includes(filter)) {
            return 1; // Boa correspondência
        } else {
            return 2; // Correspondência menos relevante
        }
    }

    // Função para atualizar a lista com base no filtro
    function updateList(filter) {
        listContainer.innerHTML = ''; // Limpa a lista atual

        const filteredOptions = uniqueOptions
            .filter(option => option.toLowerCase().includes(filter.toLowerCase()))
            .sort((a, b) => calculateMatchScore(a.toLowerCase(), filter.toLowerCase()) - calculateMatchScore(b.toLowerCase(), filter.toLowerCase()));

        filteredOptions.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;

            // Evento de clique para preencher a textarea com a opção selecionada
            button.addEventListener('click', () => {
                if (textareaId === 'waypoints') {
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
        const filter = textareaId === 'waypoints' ? textarea.value.split(' ').pop() : textarea.value;
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
    createList('waypoints', sortedWaypoints);
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
				area.fillColor = "rgba(0, 90, 50, 0.05)";
			};
			if (area.name.endsWith("APP")) {
				area.fillColor = "rgba(255, 122, 0, 0)";
			};
		};
	});
	//hideAirportUI();
	draw();
}

function resetChartsMenu() {
	const menus = document.querySelectorAll(`.icao-menu`);
	menus.forEach(menu => {
		menu.style.display = "none";
	});
}

function refreshUI() {
	// Limpa e redesenha o canvas
	draw();

	// Remove todos os elementos da UI (exemplo de classes específicas)
	document.querySelectorAll('.airport-ui').forEach(el => el.remove());

	// Redesenha os elementos da interface do usuário
	displayAirports();
	resetHighlights();
}

function updateATCCount() {
    const atcNumberElement = document.querySelector('.online-number');
    if (atcNumberElement) {
        const onlineCount = Object.values(onlineATCs).reduce((count, atcs) => {
            return count + Object.values(atcs).flat().length;
        }, 0);
        atcNumberElement.textContent = onlineCount;
    }
}

function processATCData(atcList) {
    updateOnlineATCs(atcList);
    updateATCUI();
}

let fetchATCDataAndUpdateTimesExecuted = 0;

function getUniqueUserId() {
    let userId = localStorage.getItem("uniqueUserId");
    if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem("uniqueUserId", userId);
    }
    return userId;
}

const uniqueUserId = getUniqueUserId();
const defaultURL = 'https://ptfs.xyz/api/controllers';
const dynamicURLRepository = 'https://raw.githubusercontent.com/tiaguinho2009/24SPY-Backend/main/backend';
let cachedDynamicURL = localStorage.getItem("cachedDynamicURL") || null;

async function fetchDynamicURL() {
    try {
        const response = await fetch(dynamicURLRepository);
        if (!response.ok) throw new Error(`Erro ao buscar repositório: ${response.status}`);
        
        const repositoryContent = await response.text();
        const dynamicURLMatch = repositoryContent.match(/https?:\/\/[\w.-]+\.trycloudflare\.com/g);
        
        if (dynamicURLMatch && dynamicURLMatch.length > 0) {
            cachedDynamicURL = dynamicURLMatch[0] + '/api/controllers';
            localStorage.setItem("cachedDynamicURL", cachedDynamicURL);
        } else {
            throw new Error('Nenhuma URL dinâmica encontrada no repositório.');
        }
    } catch (error) {
        console.error('Erro ao buscar URL dinâmica:', error);
        cachedDynamicURL = null;
    }
}

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
    function toggleUpdateClass() {
        const mapUpdateTime = document.getElementById('mapUpdateTime');
        mapUpdateTime.style.backgroundColor = '#ff7a00';
        setTimeout(() => mapUpdateTime.style.backgroundColor = 'rgba(32, 32, 36, 1)', 150);
    }

    let localCachedURL = localStorage.getItem("cachedDynamicURL");
    let data = localCachedURL ? await fetchATCData(localCachedURL) : null;

    if (!data) {
        await fetchDynamicURL();
        if (cachedDynamicURL) {
            data = await fetchATCData(cachedDynamicURL);
            if (data) {
                localStorage.setItem("cachedDynamicURL", cachedDynamicURL);
            }
        }
    }

    if (!data) data = await fetchATCData(defaultURL);

    if (data) {
        PTFSAPI = data;
        processATCData(PTFSAPI);
        toggleUpdateClass();
    } else {
        if (!window.location.href.includes('DEV')) {
            showMessage('Server Error', 'Couldn’t get the info from the server, please check your internet connection.', 'Retry')
                .then(() => fetchATCDataAndUpdate());
        }
        PTFSAPI = PTFSAPIError;
        processATCData(PTFSAPI);
        toggleUpdateClass();
    }

    document.querySelector('.mapUpdateTime .time').textContent = ` ${getTime()}`;
    if (!window.location.href.includes('DEV')) {
        fetchATCDataAndUpdateTimesExecuted += 1;
        if (fetchATCDataAndUpdateTimesExecuted >= 5) {
            fetchATCDataAndUpdateTimesExecuted = 0;
            checkUpdate();
        }
    }
}

async function checkUpdate() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/tiaguinho2009/24SPY-Backend/main/version');
        if (!response.ok) throw new Error(`Erro ao buscar versão: ${response.status}`);
        
        const versionContent = await response.text();
        if (versionContent.trim() !== localInfo.version.trim()) {
            showMessage('New Version', `The version ${versionContent} is now available! Enjoy the update!`, 'Update').then(response => {
                if (response === 1) location.replace(location.href);
            });
        }
    } catch (error) {
        console.error('Erro ao buscar versão:', error);
    }
}


function ActiveAllATCfunction() {
    const allAirports = [];

    controlAreas.forEach(area => {
        if (area.type === 'Airport') {
            allAirports.push({
                airport: area.real_name,
                holder: 'Tiaguinho_2009 | Tower',
                claimable: false,
                position: 'tower',
                uptime: '00:00',
            });

            if (area.atcs && area.atcs.length > 1) {
                allAirports.push({
                    airport: area.real_name,
                    holder: 'Tiaguinho_2009 | Ground',
                    claimable: false,
                    position: 'ground',
                    uptime: '00:00',
                });
            }
        }
    });

    PTFSAPI = allAirports;
    processATCData(PTFSAPI);
}

// Function to generate the list of ATCs in the specified format
function generateATCsListFromAreas() {
	// List to collect ATCs in the desired format
	let atcsList = [];

	// Filter areas by type 'Airport' and extract their ATCs
	controlAreas.forEach(area => {
		if (area.type === "Airport" && area.atcs && area.atcs.length > 0) {
			area.atcs.forEach(atc => {
				// Add the ATC name followed by '@' on a new line
				atcsList.push(atc);
				atcsList.push("@");
			});
		}
	});

	// Juntar os ATCs em uma string
	const formattedATCs = atcsList.join("\n");
	return formattedATCs;
}

generateATCsListFromAreas()

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

resizeCanvas();
loadFromLocalStorage();
setInterval(fetchATCDataAndUpdate, 30000);fetchATCDataAndUpdate();
//ActiveAllATCfunction();