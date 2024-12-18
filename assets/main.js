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

// Imagens do mapa
const mapImages = {
	normal: 'PTFS-Map-Grey.png',
	smallScale: 'PTFS-Map-1200px.png'
};
const mapImageNormal = new Image();
const mapImageSmallScale = new Image();
mapImageNormal.src = mapImages.normal;
mapImageSmallScale.src = mapImages.smallScale;

// Imagem atualmente utilizada
let currentMapImage = mapImageNormal;

// Configuração do tamanho do canvas
function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight - 50;
	draw();
}
window.addEventListener('resize', resizeCanvas);

// Função de transformação das coordenadas
function transformCoordinates(coord) {
	return [
		coord[0] * scale + offsetX,
		coord[1] * scale + offsetY
	];
}

// Função de desenho
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Alterna entre as imagens com base na escala
	currentMapImage = scale < 3 ? mapImageSmallScale : mapImageNormal;

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

// Função para desenhar áreas de controle
function drawControlAreas() {
	// Desenho das polylines
	controlAreas.forEach(area => {
		if (area.active && area.type === 'polyline') {
			let drawLine = false;

			if (area.name.includes('TMA') && settingsValues.showAPPlines) {
				drawLine = true;
			};
			if (area.name.includes('FIR') && settingsValues.showFIRlines) {
				drawLine = true;
			};

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
				if (airport.type === 'Airport' && airport.tower) {
					if (airport.ctr === area.name) {
						drawCTR = true;
					}
					if (airport.app === area.name) {
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

        // Calcula a posição para exibir as labels (meio do segmento)
        const midX = (currentTrans[0] + nextTrans[0]) / 2;
        const midY = (currentTrans[1] + nextTrans[1]) / 2;

        // Rotaciona o contexto para alinhar com o ângulo da rota
        ctx.save();
        ctx.translate(midX, midY);
        let angle = Math.atan2(dy, dx);
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

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "14px Arial";
        ctx.fillText(point.name, x + 5, y - 5);
    });
}

function drawNavaids() {
    if (!settingsValues.showNavaids) {
        return;
    }
    const navaids = Waypoints;

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

function createAirportUI(airport) {
	if (settingsValues.showAirportUI === false) {return};
	const airportUI = document.createElement('div');
	airportUI.className = 'airport-ui';
	airportUI.id = airport.name
	airportUI.style.zIndex = 10 + (3 - airport.originalscale);
	airportUI.innerHTML = `
		<button class="icao-code">${airport.name}</button>
		${airport.ctr && airport.tower ? '<div class="badge C">C</div>' : ''}
		${airport.app && airport.tower && !airport.ctr ? '<div class="badge A">A</div>' : ''}
		${!airport.ctr && !airport.app && airport.tower ? '<div class="badge T">T</div>' : ''}
		${airport.ground ? '<div class="badge G">G</div>' : ''}
	`;
	document.body.appendChild(airportUI);

	const airportInfoMenu = document.createElement('div');
	airportInfoMenu.className = 'airport-info-menu';
	document.body.appendChild(airportInfoMenu);

	if (airportUI.querySelector('.badge')) {
		airportUI.style.backgroundColor = "rgba(32, 47, 54, 0.5)";
		airportUI.style.color = "#ffffff";
	}

	if (icaoMenuCount < 1) {
		const icaoMenu = document.createElement('div');
		icaoMenu.className = 'icao-menu';
		icaoMenu.innerHTML = `
			<div class="title">Charts for ${airport.name}</div>
			<hr class="menu-divider">
			<div class="charts-buttons"></div>
		`;
		document.body.appendChild(icaoMenu);
	
		const chartsButtonsContainer = icaoMenu.querySelector('.charts-buttons');
		if (airport.charts) {
			airport.charts.forEach(chart => {
				const [chartName, chartLink] = chart;
				const chartButton = document.createElement('button');
				chartButton.className = 'chart-button';
				chartButton.textContent = chartName;
				chartButton.onclick = () => {
					window.open(chartLink, '_blank');
				};
				chartsButtonsContainer.appendChild(chartButton);
			});
		} else {
			chartsButtonsContainer.innerHTML = `<div class="no-charts">No charts available</div>`;
		}
	
		function toggleIcaoMenu() {
			if (icaoMenu.style.display === 'none' || !icaoMenu.style.display) {
				resetChartsMenu()
				icaoMenu.style.display = 'block';
		
				const [x, y] = transformCoordinates(airport.coordinates);
				const menuHeight = icaoMenu.offsetHeight;
		
				icaoMenu.style.left = `${x - (icaoMenu.offsetWidth / 2)}px`;
				icaoMenu.style.top = `${y - menuHeight + 15}px`;
			} else {
				icaoMenu.style.display = 'none';
			}
		}
	
		airportUI.querySelector('.icao-code').addEventListener('click', toggleIcaoMenu);
	}	

	function showInfoMenu(badge) {
    const position =
        badge.classList.contains('C') ? (airport.ctr && airport.oceanic ? 'Oceanic' : 'Control') :
        badge.classList.contains('A') ? 'Approach' :
        badge.classList.contains('T') ? 'Tower' :
        badge.classList.contains('G') ? 'Ground' :
        badge.classList.contains('D') ? 'Delivery' :
        'Unknown';

    const atcName = (position === 'Control' || position === 'Oceanic' || position === 'Approach' || position === 'Tower') ?
        airport.towerAtc :
        (position === 'Ground' || position === 'Delivery') ?
        airport.groundAtc :
        null;

    const frequency = position === 'Ground' ? airport.groundfreq : airport.towerfreq;

    let atcName2 = atcName;
    if (atcName.includes("|")) {
        atcName2 = atcName.split("|")[0].trim();
    }
    let roleText = "";
    let roleIndex = "role2";
    if (specialUsers[atcName2]) {
        roleText = specialUsers[atcName2][0].Role;
        roleIndex = "role1";
    }

    airportInfoMenu.style.display = 'block';
    airportInfoMenu.innerHTML = `
        <div class="title">
            ${airport.real_name} ${position}
            <div class="${roleIndex}">${roleText}</div>
        </div>
        <hr class="menu-divider">
        <div class="controller-info-section">
            <p><strong>Controller:</strong> ${atcName}</p>
            <p><strong>Frequency:</strong> ${frequency} </p>
        </div>
    `;//<strong>Time Online:</strong> ${getTimeOnline()}

    const [x, y] = transformCoordinates(airport.coordinates);
    airportInfoMenu.style.left = `${x - (airportUI.offsetWidth / 2)}px`;
    airportInfoMenu.style.top = `${y + airportUI.offsetHeight / 2 + 60}px`;
}

function hideInfoMenu() {
    document.querySelectorAll('.airport-info-menu').forEach(menu => {
        menu.style.display = 'none';
    });
}

function loadStartTime() {
    const savedTime = localStorage.getItem('startTime');
    if (savedTime) {
        startTime = new Date(savedTime);
    } else {
        resetTimer();  // Set start time to the current time if not available
    }
}

function getTimeOnline() {
    let currentTime = new Date();
    let timeDiff = Math.abs(currentTime - startTime);
    let hours = Math.floor(timeDiff / 3600000);
    let minutes = Math.floor((timeDiff % 3600000) / 60000);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
}

function resetTimer() {
    startTime = new Date();
    localStorage.setItem('startTime', startTime.toISOString());
}

function onATCConnectionEvent() {
    resetTimer();
}

// Assume these functions detect ATC log on/log off events
function detectATCLogon() {
    // Example function body
    onATCConnectionEvent();
}

function detectATCLogoff() {
    // Example function body
    onATCConnectionEvent();
}

// Example event listeners for ATC logon/logoff
document.addEventListener('ATCLogon', detectATCLogon);
document.addEventListener('ATCLogoff', detectATCLogoff);

let startTime;
loadStartTime();
	const controlBadge = airportUI.querySelector('.badge.C');
	const approachBadge = airportUI.querySelector('.badge.A');
	const towerBadge = airportUI.querySelector('.badge.T');
	const groundBadge = airportUI.querySelector('.badge.G');

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

	// Funções para destaque de APP
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

	// Eventos para o badge de controle
	if (controlBadge) {
		controlBadge.addEventListener('mouseenter', () => {
			showInfoMenu(controlBadge);
			highlightCTR(airport.ctr); // Destaque CTR
			highlightAPP(airport.app); // Destaque APP se existir
		});
		controlBadge.addEventListener('mouseleave', () => {
			hideInfoMenu();
			resetCTRHighlight(airport.ctr); // Reset CTR
			resetAPPHighlight(airport.app); // Reset APP
		});
	}

	// Eventos para o badge de approach
	if (approachBadge) {
		approachBadge.addEventListener('mouseenter', () => {
			showInfoMenu(approachBadge);
			highlightAPP(airport.app); // Destaque APP
		});
		approachBadge.addEventListener('mouseleave', () => {
			hideInfoMenu();
			resetAPPHighlight(airport.app); // Reset APP
		});
	}

	// Eventos para o badge de tower
	if (towerBadge) {
		towerBadge.addEventListener('mouseenter', () => showInfoMenu(towerBadge));
		towerBadge.addEventListener('mouseleave', hideInfoMenu);
	}

	// Eventos para o badge de ground
	if (groundBadge) {
		groundBadge.addEventListener('mouseenter', () => showInfoMenu(groundBadge));
		groundBadge.addEventListener('mouseleave', hideInfoMenu);
	}

	if (controlBadge || approachBadge || towerBadge || groundBadge) {
		const icaoCodeButton = airportUI.querySelector('.icao-code');
		icaoCodeButton.classList.add('active');
	}		

	updatePosition(airportUI, airport);
}

function resetAllAirportsUI() {
	// Selecionar todos os elementos de interface de aeroporto
	const airportUIs = document.querySelectorAll(`.airport-ui`);

	airportUIs.forEach(airportUI => {
		// Remover event listeners dos badges
		const controlBadge = airportUI.querySelector('.badge.C');
		const approachBadge = airportUI.querySelector('.badge.A');
		const towerBadge = airportUI.querySelector('.badge.T');
		const groundBadge = airportUI.querySelector('.badge.G');
		const icaoCodeButton = airportUI.querySelector('.icao-code');

		if (controlBadge) {
			controlBadge.removeEventListener('mouseenter', showInfoMenu);
			controlBadge.removeEventListener('mouseleave', hideInfoMenu);
		}
		if (approachBadge) {
			approachBadge.removeEventListener('mouseenter', showInfoMenu);
			approachBadge.removeEventListener('mouseleave', hideInfoMenu);
		}
		if (towerBadge) {
			towerBadge.removeEventListener('mouseenter', showInfoMenu);
			towerBadge.removeEventListener('mouseleave', hideInfoMenu);
		}
		if (groundBadge) {
			groundBadge.removeEventListener('mouseenter', showInfoMenu);
			groundBadge.removeEventListener('mouseleave', hideInfoMenu);
		}

		// Remover event listener do botão ICAO
		if (icaoCodeButton) {
			icaoCodeButton.removeEventListener('click', toggleIcaoMenu);
		}

		// Remover o elemento da interface do DOM
		airportUI.remove();
	});

	// Remover menus adicionais
	const airportInfoMenus = document.querySelectorAll('.airport-info-menu');
	airportInfoMenus.forEach(menu => menu.remove());

	const icaoMenus = document.querySelectorAll('.icao-menu');
	icaoMenus.forEach(menu => menu.remove());

	// Remover event listeners globais
	window.removeEventListener('resize', updatePosition);
	canvas.removeEventListener('mousemove', updatePosition);
	canvas.removeEventListener('wheel', updatePosition);
}

function displayAirports() {
	resetAllAirportsUI(); // Reseta todos os aeroportos antes de exibi-los
	controlAreas.forEach(area => {
		if (area.type === 'Airport') {
			createAirportUI(area);
		}
	});
}

// Exibe os aeroportos na inicialização
displayAirports();

let velocityX = 0, velocityY = 0;
let friction = 0.85;
const MIN_VELOCITY_THRESHOLD = 0.1;

canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    velocityX = 0;
    velocityY = 0;
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
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
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;

    // Só aplica inércia se a velocidade for significativa
    if (Math.abs(velocityX) > MIN_VELOCITY_THRESHOLD || Math.abs(velocityY) > MIN_VELOCITY_THRESHOLD) {
        applyInertia();
    }
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

// Evento de zoom
canvas.addEventListener('wheel', (e) => {
	e.preventDefault();

	if (!isZooming) {
		isZooming = true;

		requestAnimationFrame(() => {
			// Captura a posição do mouse relativa ao canvas
			const mouseX = (e.clientX - canvas.getBoundingClientRect().left - offsetX) / scale;
			const mouseY = (e.clientY - canvas.getBoundingClientRect().top - offsetY) / scale;

			// Ajusta a escala e aumenta a taxa de zoom
			const zoomRate = 0.005; // Aumente o valor para um zoom mais rápido
			const zoomFactor = e.deltaY * -zoomRate;

			// Define um limite de zoom out mínimo e máximo
			const minScale = 0.5; // Limite de zoom out
			const maxScale = 10; // Limite de zoom in

			// Calcula a nova escala e aplica os limites
			const newScale = Math.min(Math.max(minScale, scale + zoomFactor), maxScale);

			// Se o zoom estiver dentro dos limites, ajusta o offset; caso contrário, mantém o último offset
			if (newScale !== scale) {
				// Atualiza a escala
				scale = newScale;

				// Calcula o novo offset para centralizar o zoom no ponto do mouse
				offsetX = e.clientX - mouseX * scale;
				offsetY = e.clientY - mouseY * scale;
			}

			console.log(scale);
			draw();

			// Libera o zooming para o próximo evento
			isZooming = false;
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
	settingsMenu.style.display = settingsMenu.style.display === 'none' || settingsMenu.style.display === '' ? 'block' : 'none';
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

function repositionFlpMenu() {
    const FlpMenu = document.getElementById('FlpMenu');
    const FlpButton = document.getElementById('FlpButton');

    // Obtém as coordenadas e dimensões do botão
    const buttonRect = FlpButton.getBoundingClientRect();

    // Calcula a posição do menu
    const menuTop = buttonRect.bottom + window.scrollY + 180 + FlpMenu.offsetHeight;
    const menuLeft = buttonRect.right + window.scrollX + 10 - FlpMenu.offsetWidth;

    // Define a posição do menu
    FlpMenu.style.position = 'absolute';
    FlpMenu.style.top = `${menuTop}px`;
    FlpMenu.style.left = `${menuLeft}px`;
}
repositionFlpMenu()

function saveFlp() {
    // Obtém os valores das text areas
    const departure = document.querySelector('.small-input[placeholder="IRFD"]').value.trim().toUpperCase();
    const arrival = document.querySelector('.small-input[placeholder="ILAR"]').value.trim().toUpperCase();
    const waypoints = document.querySelector('.large-input[placeholder="MOGTA TRN CAN"]').value.trim().toUpperCase();

    // Divide os waypoints em uma lista
    const inputPoints = [departure, ...waypoints.split(' ').map(wp => wp.trim()), arrival];

    // Junta os dados de aeroportos e waypoints
    const allPoints = [
        ...controlAreas.filter(area => area.type === "Airport"),
        ...Waypoints
    ];

    const flightPlanPoints = [];

    // Procura cada ponto na lista de dados
    inputPoints.forEach(input => {
        const matchedPoint = allPoints.find(point => point.name === input);

        if (matchedPoint) {
            flightPlanPoints.push(matchedPoint);
        } else {
            console.error(`Ponto "${input}" não encontrado em controlAreas ou Waypoints!`);
        }
    });

    // Verifica se há pelo menos dois pontos válidos
    if (flightPlanPoints.length < 2) {
        console.error("É necessário pelo menos dois pontos válidos para desenhar o plano de voo!");
        return;
    }

	flightRoute = flightPlanPoints;
    draw();
}

function resetFlp() {
    // Limpa os valores das text areas
    document.querySelector('.small-input[placeholder="IRFD"]').value = '';
    document.querySelector('.small-input[placeholder="ILAR"]').value = '';
    document.querySelector('.large-input[placeholder="MOGTA TRN CAN"]').value = '';

    // Reseta a rota de voo
    flightRoute = [];
	draw();
    console.log("Plano de voo resetado!");
}

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
        atcNumberElement.textContent = onlineATC;
    }
}

function ATCOnlinefuncion(atcList) {
	onlineATC = 0;

	// Desativa todas as áreas e aeroportos ao iniciar
	controlAreas.forEach(area => {
		if (area.type === 'Airport') {
			area.tower = false;
			area.ground = false;
			area.towerAtc = '';
			area.groundAtc = '';
			area.scale = area.originalscale;
		} else if (area.type === 'polygon') {
			area.active = false; // Desativa TMAs/CTRs inicialmente
		}
	});

	if (settingsValues.showOnlineATC === false) {updateATCCount(); refreshUI(); return};

	// Processa cada objeto da lista ATC
	atcList.forEach(atcData => {
		const { holder, claimable, airport, position } = atcData;
		
		if (claimable) return;
		
		// Encontra a área correspondente ao aeroporto
		controlAreas.forEach(area => {
			
			if (area.type === 'Airport' && area.real_name === airport) {
				area.scale = 0; // Reduz o scale ao ativar uma posição no aeroporto
				if (position === "tower") {
					area.tower = true;
					area.towerAtc = holder;
					onlineATC += 1;

					// Ativa a TMA correspondente, se aplicável
					controlAreas.forEach(tmaArea => {
						if (tmaArea.type === 'polygon' && tmaArea.name === area.tma) {
							tmaArea.active = true;
						}
					});
				}

				if (position === "ground") {
					area.ground = true;
					area.groundAtc = holder;
					onlineATC += 1;
				}

				// Ativa a CTR correspondente, se aplicável
				if (area.ctr) {
					controlAreas.forEach(ctrArea => {
						if (ctrArea.type === 'polygon' && ctrArea.name === area.ctr) {
							ctrArea.active = true;
						}
					});
				}
			}
		});
	});

	updateATCCount();
	refreshUI();
}

ATCOnlinefuncion(PTFSAPI);

// Função para buscar dados do endpoint e atualizar o estado de ATC
function fetchATCDataAndUpdate() {
	function toggleUpdateClass() {
		const mapUpdateTime = document.getElementById('mapUpdateTime');
		const originalColor = 'rgba(32, 32, 36, 1)'
	
		mapUpdateTime.style.backgroundColor = '#ff7a00';
	
		setTimeout(() => {
			mapUpdateTime.style.backgroundColor = originalColor;
		}, 150);
	}
	
    fetch('https://ptfs.xyz/api/controllers')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar dados: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            PTFSAPI = data;

            ATCOnlinefuncion(PTFSAPI);
			toggleUpdateClass();
        })
        .catch(error => {
            console.error('Erro ao buscar os dados ATC:', error);
			PTFSAPI = PTFSAPIError
			ATCOnlinefuncion(PTFSAPI);
			toggleUpdateClass();
        });

		const time = getTime()
		document.querySelector('.mapUpdateTime .time').textContent = ` ${time}`;
}

setInterval(fetchATCDataAndUpdate, 30000);

fetchATCDataAndUpdate();

function ActiveAllATCfunction() {
	const list = generateATCsListFromAreas();
	const atcInfoTextarea = document.getElementById('atcInfo');
	atcInfoTextarea.value = list;
	ATCOnlinefuncion();
	refreshUI();
}

function resetAllATCfuntion() {
	const atcInfoTextarea = document.getElementById('atcInfo');
	atcInfoTextarea.value = "";
	controlAreas.forEach(area => {
		if (area.type === 'Airport') {
			area.tower = false; // Desativa a torre
			area.ground = false; // Desativa o ground
			area.towerAtc = ''; // Limpa o ATC da torre
			area.groundAtc = ''; // Limpa o ATC do ground
			area.scale = area.originalscale; // Opcional: redefinir a escala para não mostrar
		}
	});
	ATCOnlinefuncion();
	refreshUI();
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

function redirectToDiscord() {
	window.open('https://discord.gg/8cQAguPjkh');
}

function redirectToGitHub() {
	window.open('https://github.com/tiaguinho2009/24SPY');
}

function redirectToWiki() {
	window.open('https://github.com/tiaguinho2009/24SPY/wiki');
}

function saveToLocalStorage() {
    localStorage.setItem('settingsValues', JSON.stringify(settingsValues));
    localStorage.setItem('websiteInfo', JSON.stringify(websiteInfo));
    console.log('Dados salvos no localStorage.');
}

function loadFromLocalStorage() {
    const storedSettings = localStorage.getItem('settingsValues');
    const storedWebsiteInfo = localStorage.getItem('websiteInfo');

    if (storedSettings) {
        Object.assign(settingsValues, JSON.parse(storedSettings));
        console.log('settingsValues carregado do localStorage:', settingsValues);

        // Atualiza os checkboxes com base nos valores de settingsValues
        for (const key in settingsValues) {
            if (settingsValues.hasOwnProperty(key)) {
                const checkbox = document.getElementById(key);
                if (checkbox) {
                    checkbox.checked = settingsValues[key];
                }
            }
        }
    } else {
        console.log('Nenhum settingsValues encontrado no localStorage. Usando valores padrão.');
    }

    if (storedWebsiteInfo) {
        Object.assign(localInfo, JSON.parse(storedWebsiteInfo));
        console.log('websiteInfo carregado do localStorage:', websiteInfo);
    } else {
        console.log('Nenhum websiteInfo encontrado no localStorage. Usando valores padrão.');
    }

	if (websiteInfo.version !== localInfo.version) {
		toggleChangeLogMenu()
		saveToLocalStorage()
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
		console.error('Falha ao copiar para a área de transferência', err);
	});
}

window.addEventListener('keydown', (e) => {
	if (e.key === 'ç') { // Verifica se a tecla pressionada é "ç"
		const mouseX = (lastMouseX - canvas.getBoundingClientRect().left - offsetX) / scale;
		const mouseY = (lastMouseY - canvas.getBoundingClientRect().top - offsetY) / scale;
		copyCoordinatesToClipboard(mouseX, mouseY);
	}
});

// Inicializa o canvas
resizeCanvas();
