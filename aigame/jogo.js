document.addEventListener('DOMContentLoaded', function() {
    
    
    
    
    //######################################################Eventos
    
    
    
    // Adiciona um listener para o evento de pressionar tecla
window.addEventListener('keydown', function(event) {
    if (event.code === 'Space') { // Verifica se a tecla pressionada foi a barra de espaço
        addGroundInFrontOfPlayer();
    }
});



    
    const toggleZoomButton = document.getElementById('toggleZoomButton');
const zoomControls = document.getElementById('zoomControls');
let zoomControlsVisible = false;

toggleZoomButton.addEventListener('click', function () {
    zoomControlsVisible = !zoomControlsVisible;
    zoomControls.style.display = zoomControlsVisible ? 'block' : 'none';
    toggleZoomButton.textContent = zoomControlsVisible ? 'Desativar Zoom' : 'Ativar Zoom';
});

    
    const zoomInButton = document.getElementById('zoomInButton');
const zoomOutButton = document.getElementById('zoomOutButton');

zoomInButton.addEventListener('click', function() {
    if (cameraMode === 2) {
        // Modo top-down
        cameraHeight -= zoomSpeed;
        cameraHeight = Math.max(minCameraHeight, cameraHeight);
        setCameraTopDown();
    } else if (cameraMode === 3) {
        // Modo orbital
        cameraRadius -= zoomSpeed;
        cameraRadius = Math.max(minCameraRadius, cameraRadius);
        setCameraOrbital();
    }
});

zoomOutButton.addEventListener('click', function() {
    if (cameraMode === 2) {
        // Modo top-down
        cameraHeight += zoomSpeed;
        cameraHeight = Math.min(maxCameraHeight, cameraHeight);
        setCameraTopDown();
    } else if (cameraMode === 3) {
        // Modo orbital
        cameraRadius += zoomSpeed;
        cameraRadius = Math.min(maxCameraRadius, cameraRadius);
        setCameraOrbital();
    }
});



document.addEventListener('wheel', function(event) {
    // Ajuste a sensibilidade conforme necessário
    const zoomSpeed = 0.1;

    if (cameraMode === 2) {
        // Ajusta a altura da câmera top-down
        cameraHeight += event.deltaY * zoomSpeed;

        // Limitar cameraHeight entre min e max
        cameraHeight = Math.max(minCameraHeight, Math.min(maxCameraHeight, cameraHeight));

        // Atualizar a posição da câmera
        setCameraTopDown();
    } else if (cameraMode === 3) {
        // Ajusta o raio da câmera orbital
        cameraRadius += event.deltaY * zoomSpeed;

        // Limitar cameraRadius entre min e max
        cameraRadius = Math.max(minCameraRadius, Math.min(maxCameraRadius, cameraRadius));

        // Atualizar a posição da câmera
        setCameraOrbital();
    }
});


let initialPinchDistance = null;

document.addEventListener('touchstart', function(event) {
    if (event.touches.length === 2) {
        // Dois dedos tocam a tela
        initialPinchDistance = getDistance(event.touches[0], event.touches[1]);
    }
});

document.addEventListener('touchmove', function(event) {
    if (event.touches.length === 2 && initialPinchDistance !== null) {
        const currentPinchDistance = getDistance(event.touches[0], event.touches[1]);
        const pinchDelta = currentPinchDistance - initialPinchDistance;

        // Ajustar o raio da câmera com base na diferença de distância
        cameraRadius -= pinchDelta * 0.01; // Ajuste a sensibilidade conforme necessário

        // Limitar cameraRadius entre min e max
        cameraRadius = Math.max(minCameraRadius, Math.min(maxCameraRadius, cameraRadius));

        // Atualizar a posição da câmera
        if (cameraMode === 3) {
            setCameraOrbital();
        }

        // Atualizar a distância inicial para o próximo movimento
        initialPinchDistance = currentPinchDistance;
    }
});

document.addEventListener('touchend', function(event) {
    if (event.touches.length < 2) {
        // Reiniciar a distância inicial quando menos de dois toques estiverem presentes
        initialPinchDistance = null;
    }
});

// Função auxiliar para calcular a distância entre dois pontos de toque
function getDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}








            const joystickContainer = document.getElementById('joystickContainer');
            const toggleJoystickButton = document.getElementById('toggleJoystickButton');
            let joystickVisible = false;

            // Função para alternar a visibilidade do joystick
            toggleJoystickButton.addEventListener('click', function () {
                joystickVisible = !joystickVisible;

                if (joystickVisible) {
                    joystickContainer.style.display = 'block';  // Mostra o joystick
                    toggleJoystickButton.textContent = 'Desativar Joystick';
                } else {
                    joystickContainer.style.display = 'none';  // Esconde o joystick
                    toggleJoystickButton.textContent = 'Ativar Joystick';
                }
            });
            
            
            
            
            
            
            //##########################################FUNCAO DO CHAT global
            
            
            
    let ChatButtonVisible = false;
const toggleChatButton = document.getElementById('toggleChatButton');
const npcChat = document.getElementById('npcChat');

// Função para alternar a visibilidade do chat e carregar as mensagens do chat global
toggleChatButton.addEventListener('click', function() {
    console.log("Botão de chat clicado");  // Log para depuração
    ChatButtonVisible = !ChatButtonVisible;
    
    if (ChatButtonVisible) {
        console.log("Abrindo chat");  // Log para depuração
        carregarMensagensDoChatGlobal();
        // Se o chat estiver fechado, abrir e carregar as mensagens do chat global
 abrirChat();
        toggleChatButton.textContent = 'Fechar Chat';  // Atualizar o texto do botão
        
        // Chama a função para carregar as mensagens do chat global
      //  carregarMensagensDoChatGlobal();
    } else {
        console.log("Fechando chat");  // Log para depuração
        // Se o chat estiver aberto, esconder
        fecharChat();

    }
});

// Função para carregar as mensagens do chat global
function carregarMensagensDoChatGlobal() {
    console.log("Carregando mensagens do chat global...");  // Log para depuração

    fetch('carregar_chat_global.php')  // Faz a requisição ao servidor PHP
    .then(response => {
        console.log("Resposta recebida:", response);  // Log para verificar a resposta da requisição
        return response.json();
    })
    .then(data => {
        if (data.status === 'success') {
            chatHistory.innerHTML = '';  // Limpar o histórico de chat
            data.conversas.forEach(msg => {
                const remetente = msg.nickname;
                const mensagemx = msg.mensagem;
                const posicao = JSON.parse(msg.posicao);  // Parsear a posição que vem como JSON
                const hora = new Date(msg.timestamp).toLocaleTimeString();  // Converter timestamp para hora local
                
                // Mostrar a mensagem junto com a posição e a hora
                adicionarMensagemAoChatGLOBAL(remetente, mensagemx, posicao, hora);
            });
        } else {
            console.error("Erro ao carregar conversa:", data.conversas);
        }
    })
    .catch(error => console.error('Erro ao carregar conversa:', error));
}

// Função para adicionar uma mensagem ao chat com posição e hora
function adicionarMensagemAoChatGLOBAL(usuario, texto, posicao, hora) {
    const messageElem = document.createElement('div');
    messageElem.textContent = `${hora} | ${usuario}: ${texto}`;
    chatHistory.appendChild(messageElem);
    chatHistory.scrollTop = chatHistory.scrollHeight;  // Rolagem automática para a última mensagem
}


    
    
    
    //############################################################FUNCAO ceu
  //############################################################FUNCAO ceu
function addSun() {
    // Criar um canvas para desenhar a hora
    const canvas = document.createElement('canvas');
    canvas.width = 512; // Aumentar a resolução para melhor qualidade
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Função para desenhar a hora no canvas
    function drawTimeOnCanvas() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();

        // Limpar o canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Desenhar o fundo do Sol com um contorno alaranjado-avermelhado
        ctx.fillStyle = sunColor; // Cor do Sol (altera conforme a posição do Sol)
        ctx.strokeStyle = '#FF4500'; // Contorno laranja-avermelhado
        ctx.lineWidth = 20; // Largura do contorno
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Desenhar a hora no centro do canvas
        ctx.fillStyle = '#000000'; // Preto para o texto
        ctx.font = 'bold 30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(timeString, canvas.width / 4, canvas.height / 2);
    }

    // Criar a textura a partir do canvas
    const sunTexture = new THREE.CanvasTexture(canvas);

    // Criar a geometria e material do Sol
    const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Criar uma luz direcional representando a luz do Sol
    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    scene.add(sunLight);

    // Variável para armazenar a cor dinâmica do Sol
    let sunColor = '#FFFF00'; // Inicialmente amarelo

    // Função para atualizar a posição do Sol com base na hora e ajustar as cores
    function updateSunPosition() {
        const now = new Date();
        const hours = now.getHours() + now.getMinutes() / 60;
        const angle = (hours / 24) * Math.PI * 2;

        const sunHeight = Math.sin(angle) * 50;
        const sunDistance = 200;
        const sunX = sunDistance * Math.cos(angle);
        const sunZ = sunDistance * Math.sin(angle);

        sun.position.set(sunX, Math.max(10, sunHeight), sunZ);
        sunLight.position.set(sunX, Math.max(10, sunHeight), sunZ);

        // Ajustar a cor do céu e do Sol conforme a altura do Sol
        if (sunHeight < 20) {
            const mixFactor = sunHeight / 20;  // Fator para misturar as cores
            const skyColor = new THREE.Color(0xFF4500).lerp(new THREE.Color(0x87CEEB), mixFactor); // Mistura vermelho com azul claro
            const newSunColor = new THREE.Color(0xFF8C00).lerp(new THREE.Color(0xFFFF00), mixFactor); // Mistura laranja com amarelo

            scene.background = skyColor;  // Atualizar a cor do céu
            sunColor = `#${newSunColor.getHexString()}`;  // Atualizar a cor do Sol
        } else {
            // Céu azul claro e Sol amarelo em plena luz do dia
            scene.background = new THREE.Color(0x87CEEB);  // Azul claro
            sunColor = '#FFFF00';  // Sol amarelo
        }

        // Redesenhar o Sol com a cor atualizada e o contorno
        drawTimeOnCanvas();
        sunTexture.needsUpdate = true;  // Atualizar a textura do Sol
    }

    // Função para animar o Sol
    function animateSun() {
        updateSunPosition();

        // Rotacionar o Sol para olhar para a câmera
        sun.lookAt(camera.position);

        requestAnimationFrame(animateSun);
    }

    animateSun();
}

// Função para adicionar o céu e o Sol
function addSkySphere() {
    scene.background = new THREE.Color(0x87CEEB);  // Cor azul clara (céu)
    addSun();  // Adicionar o Sol com movimento e hora
}












    //#######################################JOYSTICK

    let joystick = document.getElementById('joystick');
let isDragging = false;
let startX, startY;
let maxSpeed = 0.5; // Velocidade máxima ajustada para o movimento

function calculateMovement(deltaX, deltaY) {
    let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    let maxDistance = joystickContainer.offsetWidth / 2;  // Corrigir aqui para pegar a largura correta no celular

    let force = Math.min(distance / maxDistance, 1);  // Limitar a força para que não seja maior que 1
    let angle = Math.atan2(deltaY, deltaX);  // Calcula o ângulo do movimento

    return { force, angle };
}

joystickContainer.addEventListener('touchstart', function (e) {
    e.preventDefault();  // Prevenir o comportamento padrão de toque (scroll, etc)


    
    let touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    isDragging = true;
    
    
    
    
    
});
joystickContainer.addEventListener('touchmove', function (e) {
    e.preventDefault();  // Prevenir o comportamento padrão de toque

    if (!isDragging) return;

    let touch = e.touches[0];
    let deltaX = touch.clientX - startX;
    let deltaY = touch.clientY - startY;

    let { force, angle } = calculateMovement(deltaX, deltaY);

    joystick.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

        movePlayer(force, angle);  // Movimentação do jogador no celular
    
});

joystickContainer.addEventListener('touchend', function (e) {
    e.preventDefault();  // Prevenir comportamento padrão
    isDragging = false;
    joystick.style.transform = 'translate(-50%, -50%)';  // Resetar a posição do joystick

    stopPlayerMovement();  // Parar o movimento quando o toque termina
});


    //####################################### JOGO PRINCIPAL

    let rotationSpeed = 0;  // Velocidade de rotação inicial
let translationSpeed = 0.05;  // Velocidade de translação

let groundBlocks = [];

    let chatHistory = document.getElementById('chatHistory');  // Captura o histórico de chat
    let npcSubmitButton = document.getElementById('npcSubmit');  // Captura o botão de enviar
    let currentNpcRole = null;

    let scene, camera, renderer, clock, ground;
    let cameraMode = 3;  // 0: Top-Down, 1: Terceira Pessoa
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    const groundSize = 50;  // Tamanho do chão

    const updateInterval = 25000; // Atualizar posição a cada 25 segundos
    let hasCollided = false;  // Controle de colisão
    let isAtEdge = false;  // Controle de limite do chão
    let conversationHistory = []; // Histórico de conversas
const interactionCooldown = 120000;  // 2 minutos em milissegundos
 let isInteracting = false;  // Flag para controlar se o jogador está interagindo com um NPC
let jogadoresNaCena = {};  // Armazenar os jogadores na cena, com o nickname como chave
let currentChatPlayer = null;  // Armazenar o jogador com quem estamos conversando


    // Armazenar o último tempo de interação para cada NPC
    let lastInteractionTime = {
        sabio: 0,
        piadista: 0,
        medico: 0,
        cientista: 0
    };
    
  // Posições dos NPCs dentro da área de 50x50 (x: [-25, 25], z: [-25, 25])
const npcPositions = {
    sabio: { x: getRandomPositionInGround(), y: 0, z: getRandomPositionInGround() },
    piadista: { x: getRandomPositionInGround(), y: 0, z: getRandomPositionInGround() },
    medico: { x: getRandomPositionInGround(), y: 0, z: getRandomPositionInGround() },
    cientista: { x: getRandomPositionInGround(), y: 0, z: getRandomPositionInGround() }
};

// Função para obter uma posição aleatória dentro da área criada pelo SQL
function getRandomPositionInGround() {
    return Math.floor(Math.random() * 51) - 25;  // Retorna um valor entre -25 e 25
}


    // Dados do jogador
    const playerData = {
        "head": { "radius": 0.5, "position": [0, 1.75, 0], "color": 0xffc0cb },
        "neck": { "radiusTop": 0.2, "radiusBottom": 0.2, "height": 0.5, "position": [0, 1.25, 0], "color": 0xffc0cb },
        "body": { "width": 1, "height": 2, "depth": 0.5, "position": [0, 0, 0], "color": 0x8b4513 },
        "leftArm": { "radiusTop": 0.2, "radiusBottom": 0.2, "height": 1, "position": [-0.75, 0.5, 0], "color": 0xffc0cb },
        "rightArm": { "radiusTop": 0.2, "radiusBottom": 0.2, "height": 1, "position": [0.75, 0.5, 0], "color": 0xffc0cb },
        "leftLeg": { "radiusTop": 0.3, "radiusBottom": 0.3, "height": 1.5, "position": [-0.5, -1.5, 0], "color": 0x0000ff },
        "rightLeg": { "radiusTop": 0.3, "radiusBottom": 0.3, "height": 1.5, "position": [0.5, -1.5, 0], "color": 0x0000ff }
    };


const npcData = {
    "head": { "radius": 0.5, "position": [0, 1.75, 0], "color": 0x00ff00 },  // Cabeça do NPC
    "neck": { "radiusTop": 0.2, "radiusBottom": 0.2, "height": 0.5, "position": [0, 1.25, 0], "color": 0x00ff00 },
    "body": { "width": 1, "height": 2, "depth": 0.5, "position": [0, 0, 0], "color": 0xff0000 },  // Corpo
    "leftArm": { "radiusTop": 0.2, "radiusBottom": 0.2, "height": 1, "position": [-0.75, 0.5, 0], "color": 0x00ff00 },  // Braço esquerdo
    "rightArm": { "radiusTop": 0.2, "radiusBottom": 0.2, "height": 1, "position": [0.75, 0.5, 0], "color": 0x00ff00 },  // Braço direito
    "leftLeg": { "radiusTop": 0.3, "radiusBottom": 0.3, "height": 1.5, "position": [-0.5, -1.5, 0], "color": 0x0000ff },  // Perna esquerda
    "rightLeg": { "radiusTop": 0.3, "radiusBottom": 0.3, "height": 1.5, "position": [0.5, -1.5, 0], "color": 0x0000ff }  // Perna direita
};


  

    // Inicializar cena, câmera, e renderizador
    function init() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(canvasWidth, canvasHeight);
        document.body.appendChild(renderer.domElement);
        clock = new THREE.Clock();
        

        player = new Personagem(scene, playerData, [0, 0, 0]);
        if (player) {
    scene.remove(player.group);
}

        inicializarJogador(scene, jogadorNickname);


        // Adicionar iluminação
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);
        fetchGroundsFromDatabase();  // Agora os NPCs só serão inicializados após o chão carregar
        // Adicionar chão
       // createGround();
    initGroundMesh();
        // Inicializar NPCs

        // Inicializar jogador
// Exemplo de uso da função


 // Carregar a posição do jogador do banco de dados
    carregarPosicaoDoJogador();
    carregarJogadoresLogados()
        // Configurar controles de câmera
        setCameraThirdPerson();


addSkySphere();

        // Eventos de teclado
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        // Começar animação
        animate();
    }
    

    
    
function animate() {
    requestAnimationFrame(animate);
    movePlayer();
    player.animate(clock);
    

    // Movimentação para frente e para trás
    if (movement.forward) {
        player.group.translateZ(-translationSpeed);  // Move para frente
    }
    if (movement.backward) {
        player.group.translateZ(translationSpeed);  // Move para trás
    }

    // Suavizando a rotação lateral
    if (movement.left || movement.right) {
        player.group.rotation.y += rotationSpeed;  // Gira suavemente com base na velocidade
    }

    // Checar a colisão e proximidade com os NPCs
    checkCollision();

    // Atualizar a posição da câmera
    // Atualizar a câmera dependendo do modo selecionado
    if (cameraMode === 1) {
        setCameraThirdPerson();
    } else if (cameraMode === 2) {
        setCameraTopDown();
    } else if (cameraMode === 3) {
        setCameraOrbital();
    }
    // Manter os textos sempre virados para a câmera
    scene.traverse(function (object) {
        if (object instanceof THREE.Sprite) {
            object.lookAt(camera.position);  // Textos sempre voltados para a câmera
        }
    });

    animateRemotePlayers();
    renderer.render(scene, camera);
}
    
   const toggleCameraButton = document.getElementById('toggleCameraButton');
    // Adicionar evento de clique ao botão para alternar a câmera
    toggleCameraButton.addEventListener('click', function () {
        toggleCamera();  // Chama a função de alternar a câmera
        

    });
    
    
    
    
    
    
    
    
    //######################################################################################################FUNCAO camera
    let cameraRadius = 10;  // Raio padrão da câmera
const minCameraRadius = 1;   // Zoom in máximo
const maxCameraRadius = 70;  // Zoom out máximo


let cameraHeight = 20; // Altura padrão da câmera top-down
const minCameraHeight = 5;  // Altura mínima
const maxCameraHeight = 100; // Altura máxima

const zoomSpeed = 2; // Ajuste conforme necessário


      // Função para alternar a câmera
    function toggleCamera() {
                        console.log(` ${cameraMode}`);

        if (cameraMode === 1) {
            setCameraTopDown();  // Alterna para a visão de cima
            cameraMode = 2;  // Próximo clique alterna para o próximo modo
        } else if (cameraMode === 2) {
            setCameraOrbital();  // Alterna para a câmera orbital
            cameraMode = 3;  // Próximo clique volta para a terceira pessoa
        } else {
            setCameraThirdPerson();  // Alterna de volta para a visão de terceira pessoa
            cameraMode = 1;  // Próximo clique alterna para a visão de cima
        }
    }

            // Funções de controle de câmera
  function setCameraThirdPerson() {
    if (!player) return;

    // Remova ou comente a linha abaixo
    // player.group.visible = false;

    // Posicionar a câmera na altura dos olhos do jogador
    const playerHeadPosition = player.group.position.clone();
    playerHeadPosition.y += 1.75; // Altura aproximada dos olhos

    // Atualizar a posição da câmera
    camera.position.copy(playerHeadPosition);

    // Alinhar a câmera com a rotação do jogador
    camera.rotation.copy(player.group.rotation);
}


function setCameraTopDown() {
    if (!player) return; // Verifica se o jogador está presente
    const playerPosition = player.group.position.clone();
    camera.position.set(playerPosition.x, playerPosition.y + cameraHeight, playerPosition.z);
    camera.lookAt(playerPosition); // Faz a câmera olhar para o jogador
}



    
    function setCameraOrbital() {
    if (!player) return; // Verifica se o jogador está presente

    const cameraHeight = 5; // Altura da câmera

    // Calcular a nova posição da câmera baseada na rotação do jogador
    const playerPosition = player.group.position;
    const playerRotationY = player.group.rotation.y;

    // Posicionar a câmera numa órbita em torno do jogador usando cameraRadius
    const cameraX = playerPosition.x + cameraRadius * Math.sin(playerRotationY);
    const cameraZ = playerPosition.z + cameraRadius * Math.cos(playerRotationY);
    const cameraY = playerPosition.y + cameraHeight;

    // Atualizar a posição da câmera
    camera.position.set(cameraX, cameraY, cameraZ);
    camera.lookAt(playerPosition); // Câmera sempre apontada para o jogador
}




    
    
 


function initPlayer() {
    // Verificar se o jogador já existe
    if (player) {
        console.log("Jogador já existe, não criar uma nova instância.");
        return;  // Se o jogador já existe, sair da função
    }
    
    // Criar o jogador local
    player = new Personagem(scene, playerData, [0, 0, 0]);
    addNameLabelToCharacter(player, jogadorNickname, 2.5);  // Nome do jogador
}


// Funções de movimentação por teclado
function handleKeyDown(event) {
    if (event.code === 'ArrowUp') movement.forward = true;
    if (event.code === 'ArrowDown') movement.backward = true;
    if (event.code === 'ArrowLeft') movement.left = true;
    if (event.code === 'ArrowRight') movement.right = true;
}

function handleKeyUp(event) {
    if (event.code === 'ArrowUp') movement.forward = false;
    if (event.code === 'ArrowDown') movement.backward = false;
    if (event.code === 'ArrowLeft') movement.left = false;
    if (event.code === 'ArrowRight') movement.right = false;
}
function checkCollision() {
    const interactionDistance = 5; // Distância de interação

    function isNearPlayer(player, otherPlayer) {
        if (!otherPlayer || !otherPlayer.group) {
            return false;
        }

        const distance = player.group.position.distanceTo(otherPlayer.group.position);
        return distance <= interactionDistance;
    }

    let playerNearby = false;  // Controle para ver se há jogadores por perto

    // Iterar sobre todos os jogadores na cena
    Object.keys(jogadoresNaCena).forEach(nickname => {
        if (nickname !== jogadorNickname) {  // Não verificar o próprio jogador
            const otherPlayer = jogadoresNaCena[nickname];
            if (isNearPlayer(player, otherPlayer)) {
                currentChatPlayer = nickname;  // Definir o jogador próximo como alvo da conversa
                playerNearby = true;  // Marcar que há um jogador próximo

                // Iniciar o carregamento de mensagens e abrir o chat
                iniciarCarregamentoDeMensagens(currentChatPlayer);
                abrirChat();  // Função para abrir o chat automaticamente
            }
        }
    });

    // Se não houver jogadores próximos, redefinir `currentChatPlayer` e fechar o chat
    if (!playerNearby) {
        if (currentChatPlayer) {
            pararCarregamentoDeMensagens();
           // fecharChat();  // Função para fechar o chat automaticamente
        }
        currentChatPlayer = null;
    }

    // Função para verificar se o jogador está próximo de um NPC
    function isNearNpc(player, npc) {
        if (!npc || !npc.group) {
            return false;
        }

        const distance = player.group.position.distanceTo(npc.group.position);
        return distance <= interactionDistance;
    }

    // Checar proximidade com NPCs e iniciar a interação
    let npcNearby = false;  // Controle para verificar proximidade com NPCs

    if (isNearNpc(player, npcSabio)) {
        if (currentNpcRole !== 'sabio' || !isInteracting) {
            startNpcInteraction('sabio');
            abrirChat();  // Abrir o chat automaticamente
        }
        npcNearby = true;
    } else if (isNearNpc(player, npcPiadista)) {
        if (currentNpcRole !== 'piadista' || !isInteracting) {
            startNpcInteraction('piadista');
            abrirChat();  // Abrir o chat automaticamente
        }
        npcNearby = true;
    } else if (isNearNpc(player, npcMedico)) {
        if (currentNpcRole !== 'medico' || !isInteracting) {
            startNpcInteraction('medico');
            abrirChat();  // Abrir o chat automaticamente
        }
        npcNearby = true;
    } else if (isNearNpc(player, npcCientista)) {
        if (currentNpcRole !== 'cientista' || !isInteracting) {
            startNpcInteraction('cientista');
            abrirChat();  // Abrir o chat automaticamente
        }
        npcNearby = true;
    } else {
        if (isInteracting) {
            endNpcInteraction();  // Terminar a interação se o jogador se afastar de todos os NPCs
            fecharChat();  // Fechar o chat automaticamente
        }
    }

    // Se não estiver perto de nenhum NPC ou jogador, fechar o chat
    if (!playerNearby && !npcNearby) {
       // fecharChat();  // Fechar o chat automaticamente
    }
}

// Funções para abrir e fechar o chat
function abrirChat() {
    const chatContainer = document.getElementById('npcChat');
    chatContainer.style.display = 'block';  // Mostrar o chat
    const toggleChatButton = document.getElementById('toggleChatButton');
    toggleChatButton.textContent = 'Fechar Chat';  // Atualizar o botão para "Fechar Chat"
}

function fecharChat() {
    const chatContainer = document.getElementById('npcChat');
    chatContainer.style.display = 'none';  // Esconder o chat
    const toggleChatButton = document.getElementById('toggleChatButton');
    toggleChatButton.textContent = 'Abrir Chat';  // Atualizar o botão para "Abrir Chat"
}

function startNpcInteraction(npcRole) {
    if (currentNpcRole !== npcRole) {
        currentNpcRole = npcRole;
        isInteracting = true;  // Marcar que o jogador está interagindo
        chatHistory.innerHTML = ''; // Limpa o histórico de mensagens
        carregarConversa(npcRole);  // Carrega a conversa com o NPC
        console.log(`Interagindo com ${npcRole}`);
    }
}

function endNpcInteraction() {
    console.log(`Terminando interação com ${currentNpcRole}`);
    currentNpcRole = null;
    isInteracting = false;  // Marcar que o jogador não está mais interagindo
    chatHistory.innerHTML = '';  // Limpa o histórico de chat quando a interação termina
}




// Função de interação com NPC
function interagirComNpc(npcRole, npcInteractionFile) {
    startNpcInteraction(npcRole, npcInteractionFile);
}



    // Definir a lógica de submissão do formulário/modal

   // const npcSubmitButton = document.getElementById('npcSubmit'); // Verifique se o ID do botão está correto
    const npcAnswerElem = document.getElementById('npcAnswer'); // Campo de input da resposta do jogador

  // Adicionar evento de tecla pressionada (keydown) para verificar a tecla Enter
    npcAnswerElem.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();  // Prevenir comportamento padrão do Enter (como pular linha)
            handleSubmit();  // Chamar a função de enviar mensagem
        }
    });


    npcSubmitButton.addEventListener('click', handleSubmit);
npcSubmitButton.addEventListener('click', handleSubmit);

function handleSubmit() {
    const userMessage = npcAnswerElem.value.trim();
    if (userMessage === '') return;

    adicionarMensagemAoChat('Você', userMessage);
    conversationHistory.push({ role: 'user', content: userMessage });

    // Verificar se o jogador está conversando com outro jogador ou com um NPC
    if (currentChatPlayer) {
        // Caso esteja conversando com um jogador
        fetch('salvar_conversa_jogador.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                interlocutor: currentChatPlayer,  // Jogador com quem está interagindo
                mensagem: userMessage             // Mensagem enviada
            })
        })
        .then(response => response.text())  // Usa text() para ver a resposta completa
        .then(data => {
            console.log("Resposta bruta do servidor:", data);
            try {
                const jsonData = JSON.parse(data);
                if (jsonData.status === 'success') {
                    adicionarMensagemAoChat(currentChatPlayer, userMessage);  // Exibe a mensagem enviada no chat
                    carregarConversaJogador(currentChatPlayer);  // Carregar a conversa com o jogador atual
                } else {
                    console.error('Erro ao salvar a conversa com o jogador:', jsonData.message);
                }
            } catch (error) {
                console.error('Erro ao interpretar o JSON:', error);
            }
        })
        .catch(error => console.error('Erro ao salvar a conversa com o jogador:', error));

    } else if (currentNpcRole) {
        // Caso esteja conversando com um NPC
        fetch('npc-interaction.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                npcId: currentNpcRole,
                nickname: jogadorNickname,
                mensagem: userMessage,
                conversationHistory: conversationHistory  // Envia o histórico junto
            })
        })
        .then(response => response.text())
        .then(data => {
            // Atualiza pontuação quando uma interação com NPC ocorre
            playerEarnedPoints(1); // Ganhar 5 pontos por interagir com um NPC
            
            console.log("Resposta bruta do servidor:", data);
            try {
                const jsonData = JSON.parse(data);
                if (jsonData.response) {
                    adicionarMensagemAoChat(currentNpcRole, jsonData.response);
                    conversationHistory.push({ role: 'npc', content: jsonData.response });
                } else {
                    console.error('Erro ao salvar a conversa com o NPC:', jsonData);
                }
            } catch (error) {
                console.error('Erro ao interpretar o JSON:', error);
            }
        })
        .catch(error => console.error('Erro ao salvar a conversa com o NPC:', error));

    } else {
        // Se não estiver interagindo com NPC ou jogador, salvar no chat global
        
   // carregarMensagensDoChatGlobal();

        fetch('enviar_chat_global.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nickname: jogadorNickname,         // Envia o nickname do jogador
                mensagem: userMessage,             // Envia a mensagem para o chat global
                posicao: JSON.stringify(player.group.position)  // Posição do jogador

            })
        })
        .then(response => response.text())
        .then(data => {
            console.log("Resposta bruta do servidor (chat global):", data);
            try {
                const jsonData = JSON.parse(data);
                if (jsonData.status === 'success') {
                    carregarMensagensDoChatGlobal();
                    
                    console.log('Mensagem global enviada com sucesso.');
                } else {
                    console.error('Erro ao salvar a mensagem no chat global:', jsonData.message);
                }
            } catch (error) {
                console.error('Erro ao interpretar o JSON (chat global):', error);
            }
        })
        .catch(error => console.error('Erro ao enviar mensagem global:', error));
    }

    npcAnswerElem.value = '';  // Limpa o campo de input
}


// Função para carregar mensagens do jogador no servidor
function carregarConversaJogador(interlocutor) {
    fetch('recuperar_conversa_jogador.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            interlocutor: interlocutor  // Jogador com quem está conversando
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success' && Array.isArray(data.conversas)) {
            // Limpar o chat atual e carregar o histórico de conversa
            chatHistory.innerHTML = '';
            data.conversas.forEach(msg => {
                const remetente = msg.jogador === jogadorNickname ? 'Você' : interlocutor;
                adicionarMensagemAoChat(remetente, msg.mensagem);
            });
        } else {
            console.error("Erro ao carregar conversa:", data.message);
        }
    })
    .catch(error => console.error('Erro ao carregar conversa:', error));
}


    // Função para adicionar mensagens ao chat
    function adicionarMensagemAoChat(remetente, mensagem) {
        const messageElem = document.createElement('div');
        messageElem.textContent = `${remetente}: ${mensagem}`;
        chatHistory.appendChild(messageElem);
        chatHistory.scrollTop = chatHistory.scrollHeight;  // Rolagem automática para a última mensagem
    }
// Função para carregar o histórico de conversa do NPC
function carregarConversa(npcRole) {
    fetch('recuperar_conversa.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            npcId: npcRole,  // Envia o npcRole (como string: 'piadista', 'sabio', etc.)
            nickname: jogadorNickname  // Envia o nickname do jogador
        })
    })
    .then(response => response.json())
    .then(data => {
        if (Array.isArray(data) && data.length > 0) {
            data.forEach(msg => {
                // Adiciona ao chat a mensagem dependendo do role ('user' ou 'npc')
                adicionarMensagemAoChat(msg.role === 'user' ? 'Você' : npcRole, msg.content);
            });
        } else {
            // Caso não haja conversas anteriores, exibe a mensagem inicial
            adicionarMensagemAoChat(npcRole, 'Olá, como posso ajudá-lo?');
        }
    })
    .catch(error => console.error('Erro ao carregar conversa:', error));
}

// Listener para o botão de enviar
npcSubmitButton.addEventListener('click', handleSubmit);

    
    function salvarConversa(resposta) {
        conversationHistory.push({ role: 'user', content: resposta });

fetch('salvar_conversa.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        npcId: currentNpcRole,  // Enviando a string como 'piadista', 'sabio', etc.
        nickname: jogadorNickname,
        conversa: conversationHistory
    })
})
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                carregarConversa(currentNpcRole);
            } else {
                console.error('Erro ao salvar a conversa:', data.message);
            }
        })
        .catch(error => console.error('Erro ao salvar a conversa:', error));
    }

    
    
// Função para enviar o histórico de conversa ao backend
function enviarHistorico(npcRole, npcInteractionFile) {
fetch('salvar_conversa.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        npcId: currentNpcRole,
        nickname: jogadorNickname,
        conversa: conversationHistory
    })
})
.then(response => response.json())
.then(data => {
    console.log("Resposta do servidor:", data);  // Verificar a resposta do servidor
    if (data.status === 'success') {
        carregarConversa(currentNpcRole);
    } else {
        console.error('Erro ao salvar a conversa:', data.message);
    }
})
.catch(error => console.error('Erro ao salvar a conversa:', error));

}







// Função para parar o movimento do jogador
function stopPlayerMovement() {
    movement.forward = false;
    movement.backward = false;
    movement.left = false;
    movement.right = false;
    isPlayerMoving = false;
}






let lastPlayerState = { x: null, y: null, z: null, lookX: null, lookY: null, lookZ: null };  // Armazenar a última posição e direção do jogador
function savePlayerPositionToDatabase() {
    const currentPlayerPosition = player.group.position;
    
    const playerDirection = new THREE.Vector3();
    player.group.getWorldDirection(playerDirection);

    // Enviar a posição e direção do jogador local, mas o servidor deve excluir este jogador ao retornar a lista de jogadores
    const data = {
        nickname: jogadorNickname,
        x: currentPlayerPosition.x,
        y: currentPlayerPosition.y,
        z: currentPlayerPosition.z,
        lookX: playerDirection.x,
        lookY: playerDirection.y,
        lookZ: playerDirection.z
    };

    fetch('atualizar_posicao.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.status !== 'success') {
            console.error("Erro ao atualizar a posição do jogador:", result.message);
        }
    })
    .catch(error => {
        console.error('Erro ao salvar a posição:', error);
    });
}




function initNPCs(grounds) {
    if (!grounds || grounds.length === 0) {
        console.log("Nenhum bloco de chão encontrado para posicionar os NPCs.");
        return;
    }
    
     // Verificar se os NPCs já existem para evitar recriação
    if (npcSabio || npcPiadista || npcMedico || npcCientista) {
        console.log("NPCs já foram criados, evitando duplicação.");
        return;  // Se já foram criados, sai da função
    }

    if (!scene) return;
    
npcSabio = new Personagem(scene, npcData, [npcPositions.sabio.x, 0, npcPositions.sabio.z]);
addNameLabelToCharacter(npcSabio, "Sábio", 2.5, true);  // Adiciona o nome "Sábio" acima do NPC

npcPiadista = new Personagem(scene, npcData, [npcPositions.piadista.x, 0, npcPositions.piadista.z]);
addNameLabelToCharacter(npcPiadista, "Piadista", 2.5, true);  // Adiciona o nome "Piadista" acima do NPC

npcMedico = new Personagem(scene, npcData, [npcPositions.medico.x, 0, npcPositions.medico.z]);
addNameLabelToCharacter(npcMedico, "Médico", 2.5, true);  // Adiciona o nome "Médico" acima do NPC

npcCientista = new Personagem(scene, npcData, [npcPositions.cientista.x, 0, npcPositions.cientista.z]);
addNameLabelToCharacter(npcCientista, "Cientista", 2.5, true);  // Adiciona o nome "Cientista" acima do NPC

    // Adiciona os NPCs à cena
    scene.add(npcSabio.group);
    scene.add(npcPiadista.group);
    scene.add(npcMedico.group);
    scene.add(npcCientista.group);
    
    // Escolha aleatória de blocos de chão para NPCs
    const sabioGround = grounds[Math.floor(Math.random() * grounds.length)];
    const piadistaGround = grounds[Math.floor(Math.random() * grounds.length)];
    const medicoGround = grounds[Math.floor(Math.random() * grounds.length)];
    const cientistaGround = grounds[Math.floor(Math.random() * grounds.length)];

    // Inicializar NPCs em posições visíveis dentro dos blocos de chão
  //  adicionarOuAtualizarJogadorNaCena("Sábio", sabioGround.x, sabioGround.y + 0.5, sabioGround.z, 0, 0, 0, true);
  //  adicionarOuAtualizarJogadorNaCena("Piadista", piadistaGround.x + 1, piadistaGround.y + 0.5, piadistaGround.z + 1, 0, 0, 0, true);
 //   adicionarOuAtualizarJogadorNaCena("Médico", medicoGround.x - 1, medicoGround.y + 0.5, medicoGround.z - 1, 0, 0, 0, true);
  //  adicionarOuAtualizarJogadorNaCena("Cientista", cientistaGround.x + 2, cientistaGround.y + 0.5, cientistaGround.z + 2, 0, 0, 0, true);

console.log("Inicializando NPCs");
console.log("Posição do NPC Sabio:", npcPositions.sabio);
console.log("Posição do NPC Piadista:", npcPositions.piadista);
console.log("Posição do NPC Medico:", npcPositions.medico);
console.log("Posição do NPC Cientista:", npcPositions.cientista);

    saveNpcPositionsToDatabase(npcPositions);
    console.log("NPCs inicializados em blocos de chão.");
}

function createGroundWithNickname(x, y, z, nickname) {
    // Criar um canvas para desenhar o nome
    const canvas = document.createElement('canvas');
    canvas.width = 256;  // Defina o tamanho do canvas para a resolução da textura
    canvas.height = 256;
    const context = canvas.getContext('2d');

    // Desenhar o fundo (cor do chão)
    context.fillStyle = '#228B22';  // Cor verde para o chão
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Desenhar o nickname como texto no centro do chão
    context.font = '40px Arial';
    context.fillStyle = 'rgba(255, 255, 255, 0.5)';  // Cor branca com transparência para o efeito de marca d'água
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(nickname, canvas.width / 2, canvas.height / 2);

    // Criar uma textura a partir do canvas
    const texture = new THREE.CanvasTexture(canvas);

    // Criar a geometria e o material do chão
    const groundGeometry = new THREE.PlaneGeometry(1, 1);  // Tamanho do novo bloco de chão
    const groundMaterial = new THREE.MeshBasicMaterial({ map: texture });  // Usar a textura criada a partir do canvas
    const newGround = new THREE.Mesh(groundGeometry, groundMaterial);

    // Rotacionar para que o plano fique horizontal e ajustado ao chão
    newGround.rotation.x = -Math.PI / 2;
    newGround.position.set(x, y - 2, z);

    newGround.isGround = true;  // Marca como objeto de chão
    return newGround;
}


// Função para criar um sprite de texto transparente
function createTextSpritegr(text, opacity) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const fontSize = 42;
    canvas.width = 256;
    canvas.height = 128;

    // Configura o estilo do texto
    context.font = `${fontSize}px Arial`;
    context.fillStyle = `rgba(255, 255, 255, ${opacity})`;  // Texto transparente
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Desenha o texto no centro do canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    // Cria textura com o canvas
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);

    // Ajustar o tamanho do sprite
    sprite.scale.set(2, 1, 1);  // Ajuste a escala conforme necessário

    return sprite;
}



// Capturar o botão 'Adicionar Chão' pelo ID
const addGroundButton = document.getElementById('addGroundButton');

// Adicionar o evento de clique no botão para chamar a função de adicionar chão
addGroundButton.addEventListener('click', function() {
    addGroundInFrontOfPlayer();  // Função que adiciona o chão na frente do jogador
});
    
function carregarPosicaoDoJogador() {
    const data = {
        nickname: jogadorNickname  // Variável que contém o nickname do jogador
    };

    // Enviar a requisição para carregar a posição e direção
    fetch('carregar_posicao.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === 'success' && result.posicao && result.direcao) {
            const { x, y, z } = result.posicao;
            const { lookX, lookY, lookZ } = result.direcao;
            
            console.log("Posição carregada:", x, y, z);
            console.log("Direção carregada:", lookX, lookY, lookZ);

            // Atualizar a posição do jogador no jogo
            player.group.position.set(x, y, z);

            // Atualizar a direção do jogador, mas sem sobrecarregar `lookAt`
            const playerDirection = new THREE.Vector3(lookX, lookY, lookZ).normalize();

            // Definir a rotação manualmente para evitar usar `lookAt` diretamente
            player.group.rotation.y = Math.atan2(playerDirection.x, playerDirection.z);
        } else {
            console.error("Erro ao carregar a posição ou direção:", result.message);
        }
    })
    .catch(error => {
        console.error('Erro na requisição para carregar a posição e direção:', error);
    });
}





function carregarJogadoresLogados() {
    fetch('jogadores_logados.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nickname: jogadorNickname })  // Enviar o nickname local
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success' && Array.isArray(data.players)) {
            //console.log("Jogadores logados:", data.players);
            data.players.forEach(jogador => {
                const { nickname, posicao, direcao } = jogador;

                // Ignorar o jogador local
                if (nickname === jogadorNickname) {
                    console.log("Ignorando o jogador local.");
                    return;
                }

                const { x, y, z } = posicao;
                const { lookX, lookY, lookZ } = direcao || {};  // Verificar se a direção está definida

                // Adicionar ou atualizar o jogador na cena
                adicionarOuAtualizarJogadorNaCena(nickname, x, y, z, lookX, lookY, lookZ);
            });
        } else {
            console.error("Erro ao carregar jogadores logados:", data.message);
        }
    })
    .catch(error => {
        console.error('Erro na requisição para carregar os jogadores logados:', error);
    });
}






// Função para criar um sprite de texto com estilos personalizados
function createTextSprite(text, color, fontSize, isBold = false) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    // Definir a largura e altura do canvas
    canvas.width = 512;  // Aumentar a largura para melhorar a qualidade do texto
    canvas.height = 256;  // Aumentar a altura para melhorar a qualidade do texto

    // Definir o estilo do texto
    const fontStyle = isBold ? 'bold' : 'normal';  // Definir se o texto será negrito
    context.font = `${fontStyle} ${fontSize}px Arial`;
    context.fillStyle = color;  // Cor personalizada
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Desenhar o texto no centro do canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    // Criar a textura com o canvas
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);

    // Ajustar o tamanho do sprite
    sprite.scale.set(4, 2, 1);  // Ajuste a escala conforme necessário

    return sprite;
}

// Função para adicionar o nome do jogador sobre o personagem
function addNameLabelToCharacter(character, name, yOffset, isNpc = false) {
    const color = isNpc ? 'yellow' : 'green';  // Amarelo para NPCs, Verde para jogadores
    const fontSize = isNpc ? 80 : 62;  // Fonte maior para NPCs
    const isBold = true;  // Todos os nomes em negrito

    const nameSprite = createTextSprite(name, color, fontSize, isBold);
    nameSprite.position.set(0, yOffset, 0);  // Posicionar acima da cabeça
    character.group.add(nameSprite);  // Adicionar ao grupo do personagem
}
// Função para adicionar ou atualizar jogadores e NPCs na cena
async function adicionarOuAtualizarJogadorNaCena(nickname, x, y, z, lookX = 0, lookY = 0, lookZ = 0, isNpc = false) {
    try {
        // Buscar os dados do personagem no banco de dados pelo nickname
        const personagemData = await buscarPersonagemPorNickname(nickname);

        // Verificar se o jogador já existe na cena
        if (jogadoresNaCena[nickname]) {
            const jogador = jogadoresNaCena[nickname];
            const previousPosition = jogador.group.position.clone();

            // Atualizar a posição e direção do jogador
            jogador.group.position.set(x, y, z);
            jogador.group.lookAt(new THREE.Vector3(x + lookX, y + lookY, z + lookZ));  // Atualizar a direção que o jogador está olhando

            // Verificar se o jogador mudou de posição
            if (!previousPosition.equals(jogador.group.position)) {
                jogador.isMoving = true;  // Marcar como em movimento se a posição mudou
            } else {
                jogador.isMoving = false;  // Parar o movimento se a posição não mudou
            }

            console.log(`Atualizando posição de ${nickname} para (${x}, ${y}, ${z}) e direção (${lookX}, ${lookY}, ${lookZ})`);
        } else {
            // Jogador não existe, cria um novo personagem na posição x, y, z
            const jogadorData = {
                "head": { 
                    "radius": personagemData.head_radius || 0.5, 
                    "position": [0, personagemData.body_height + 0.75, 0], 
                    "color": personagemData.head_color || 0xffc0cb 
                },
                "neck": { 
                    "radiusTop": 0.2, 
                    "radiusBottom": 0.2, 
                    "height": personagemData.neck_height || 0.5, 
                    "position": [0, personagemData.body_height - 0.25, 0], 
                    "color": personagemData.neck_color || 0xffc0cb 
                },
                "body": { 
                    "width": 1, 
                    "height": personagemData.body_height || 2, 
                    "depth": 0.5, 
                    "position": [0, 0, 0], 
                    "color": personagemData.body_color || 0x8b4513 
                },
                "leftArm": { 
                    "radiusTop": 0.2, 
                    "radiusBottom": 0.2, 
                    "height": 1, 
                    "position": [-0.75, personagemData.body_height / 2, 0], 
                    "color": personagemData.arm_color || 0xffc0cb 
                },
                "rightArm": { 
                    "radiusTop": 0.2, 
                    "radiusBottom": 0.2, 
                    "height": 1, 
                    "position": [0.75, personagemData.body_height / 2, 0], 
                    "color": personagemData.arm_color || 0xffc0cb 
                },
                "leftLeg": { 
                    "radiusTop": 0.3, 
                    "radiusBottom": 0.3, 
                    "height": 1.5, 
                    "position": [-0.5, -personagemData.body_height / 2, 0], 
                    "color": personagemData.leg_color || 0x0000ff 
                },
                "rightLeg": { 
                    "radiusTop": 0.3, 
                    "radiusBottom": 0.3, 
                    "height": 1.5, 
                    "position": [0.5, -personagemData.body_height / 2, 0], 
                    "color": personagemData.leg_color || 0x0000ff 
                }
            };

            // Adicionar o jogador na posição x, y, z
            const novoJogador = new Personagem(scene, jogadorData, [x, y, z]);
            novoJogador.isMoving = false;  // Inicialmente, marcar como não em movimento
            novoJogador.group.lookAt(new THREE.Vector3(x + lookX, y + lookY, z + lookZ));  // Definir a direção inicial

            // Adicionar o nome do jogador ou NPC
            addNameLabelToCharacter(novoJogador, nickname, 2.5, isNpc);

            // Armazena o jogador na lista de jogadores na cena
            jogadoresNaCena[nickname] = novoJogador;

            console.log(`Adicionando novo jogador: ${nickname} em (${x}, ${y}, ${z}) e direção (${lookX}, ${lookY}, ${lookZ})`);
        }
    } catch (error) {
        console.error(`Erro ao adicionar ou atualizar o jogador ${nickname}:`, error);
    }
}

// Função para animar jogadores remotos apenas quando se movem
function animateRemotePlayers() {
    Object.keys(jogadoresNaCena).forEach(nickname => {
        // Ignora o jogador local
        if (nickname === jogadorNickname) return;

        const jogador = jogadoresNaCena[nickname];

        // Verificar se o jogador remoto está em movimento
        if (jogador.isMoving) {
            jogador.animate(clock);  // Anima o jogador remoto
        } else {
            // Se o jogador remoto parou de se mover, parar a animação dos membros
            jogador.stop();  // Função para parar o movimento dos membros
        }
    });
}



let mensagemInterval = null;  // Armazena o ID do intervalo para o tempo real

// Função para carregar mensagens periodicamente enquanto o jogador está interagindo
function iniciarCarregamentoDeMensagens(interlocutor) {
    // Limpa o intervalo anterior se houver
    if (mensagemInterval) {
        clearInterval(mensagemInterval);
    }
  
    // Atualiza o jogador com quem estamos interagindo
    currentChatPlayer = interlocutor;

    // Define um intervalo para carregar novas mensagens a cada 3 segundos
    mensagemInterval = setInterval(() => {
      // Faz uma requisição a cada 3 segundos
       carregarConversaJogador(interlocutor);
    }, 500); 
}

// Função para parar o carregamento de mensagens em tempo real
function pararCarregamentoDeMensagens() {
    if (mensagemInterval) {
        clearInterval(mensagemInterval);
        mensagemInterval = null;
    }
}





//#########################################################################################CODIGO REFERENTE AO LIMITE DO ground




function movePlayer(force = 0, angle = null) {
    // Verifique se o jogador já existe antes de tentar movê-lo
    if (!player || !player.group) return;

    let moved = false;

    // Verificar se o jogador está sobre um bloco de chão
    if (!isPlayerInsideGroundBlocks(player.group.position)) {
        console.log("O jogador não está sobre um bloco de chão permitido.");
         repositionPlayerToClosestGroundBlock();
        return;  // Não permitir o movimento se o jogador não estiver sobre um bloco de chão
    }

    // Teclado: Movimento pelas setas
    if (movement.forward) {
        player.group.translateZ(-0.05);  // Move para frente
        moved = true;
    }
    if (movement.backward) {
        player.group.translateZ(0.05);   // Move para trás
        moved = true;
    }
    if (movement.left) {
        player.group.rotation.y += 0.05;  // Gira para a esquerda
        moved = true;
    }
    if (movement.right) {
        player.group.rotation.y -= 0.05;  // Gira para a direita
        moved = true;
    }

    // Joystick: Se houver força e ângulo, use para mover
    if (angle !== null) {
        let cosAngle = Math.cos(angle);
        let sinAngle = Math.sin(angle);

        if (cosAngle > 0.5) {
            player.group.rotation.y -= 0.05;  // Girar para a direita
            moved = true;
        } else if (cosAngle < -0.5) {
            player.group.rotation.y += 0.05;  // Girar para a esquerda
            moved = true;
        }

        if (sinAngle < -0.5) {
            player.group.translateZ(-maxSpeed * force);  // Mover para frente
            moved = true;
        } else if (sinAngle > 0.5) {
            player.group.translateZ(maxSpeed * force);  // Mover para trás
            moved = true;
        }
    }

    // Verifica se o jogador se moveu e salva a posição
    if (moved) {
        animateLimbMovement();  // Anima os membros do jogador
        savePlayerPositionToDatabase();  // Salva a posição do jogador no banco de dados
    }
}



// Função para reposicionar o jogador de volta ao bloco mais próximo de chão permitido
function repositionPlayerToClosestGroundBlock() {
    // Encontre o bloco mais próximo
    let closestGround = null;
    let minDistance = Infinity;

    groundBlocks.forEach(ground => {
        const distance = player.group.position.distanceTo(new THREE.Vector3(ground.x, ground.y, ground.z));
        if (distance < minDistance) {
            minDistance = distance;
            closestGround = ground;
        }
    });

    if (closestGround) {
        // Reposiciona o jogador no bloco mais próximo encontrado
        player.group.position.set(closestGround.x, closestGround.y, closestGround.z);
        console.log(`Reposicionando o jogador para o bloco mais próximo em: (${closestGround.x}, ${closestGround.y}, ${closestGround.z})`);
    }
}

function saveGroundPositionToDatabase(vector3) {
    const x = vector3.x;
    const y = vector3.y;
    const z = vector3.z;

    console.log("Dados enviados:", { x, y, z, nickname: jogadorNickname });

    fetch('save-ground.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            x: x,
            y: y,
            z: z,
            nickname: jogadorNickname
        })
    })
    .then(response => response.text())
    .then(data => {
        console.log("Resposta do servidor:", data);
        try {
            const jsonData = JSON.parse(data);
            if (jsonData.status === 'success') {
                console.log('Posição do chão salva com sucesso:', jsonData.message);
                    playerEarnedPoints(0.25); 

                // Buscar os novos blocos de chão recém-adicionados
                fetchNewGroundsFromDatabase();  // Carregar apenas os blocos adicionados recentemente
            } else {
                console.error('Erro ao salvar a posição do chão:', jsonData.message);
            }
        } catch (error) {
            console.error('Erro ao interpretar o JSON:', error);
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
    });
}



// Definir os limites globais para os blocos de chão
let groundLimits = {
    minX: Infinity,
    maxX: -Infinity,
    minY: Infinity,
    maxY: -Infinity,
    minZ: Infinity,
    maxZ: -Infinity
};

// Função para buscar os novos blocos do banco de dados
function fetchNewGroundsFromDatabase() {
    // Chama o PHP que retorna os 10 últimos blocos em ordem decrescente
    fetch('get-new-grounds.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success' && Array.isArray(data.grounds)) {
                let newGroundsAdded = false; // Verifica se novos blocos foram adicionados

                // Iterar pelos novos blocos e calcular os novos limites
                data.grounds.forEach(ground => {
                    const x = ground.x;
                    const y = ground.y;
                    const z = ground.z;

                    // Atualizar os limites globais
                    if (x < groundLimits.minX) groundLimits.minX = x;
                    if (x > groundLimits.maxX) groundLimits.maxX = x;
                    if (y < groundLimits.minY) groundLimits.minY = y;
                    if (y > groundLimits.maxY) groundLimits.maxY = y;
                    if (z < groundLimits.minZ) groundLimits.minZ = z;
                    if (z > groundLimits.maxZ) groundLimits.maxZ = z;

                    // Verificar se o bloco já está na cena
                    if (!isGroundAlreadyInScene(x, y, z)) {
                        const newGround = createGround(x, y, z);
                        scene.add(newGround);
                        groundBlocks.push({ x, y, z });
                        newGroundsAdded = true; // Marcar que novos blocos foram adicionados
                    }
                });

                // Se novos blocos foram adicionados, verificar e reposicionar o jogador, se necessário
                if (newGroundsAdded) {
                    console.log("Novos blocos adicionados. Verificando posição do jogador...");
                    if (!isPlayerInsideGroundBlocks(player.group.position)) {
                        repositionPlayerToClosestGroundBlock(); // Reposiciona o jogador
                    }
                }
            } else {
                console.error('Erro ao carregar novos blocos de chão:', data.message);
            }
        })
        .catch(error => console.error("Erro ao buscar novos blocos de chão:", error));
}









function addGroundInFrontOfPlayer() {
    // Pega a posição atual do jogador
    const playerPosition = player.group.position.clone();
    
    // Pega a direção que o jogador está olhando
    const playerDirection = new THREE.Vector3();
    player.group.getWorldDirection(playerDirection);
    
    // Normaliza a direção para garantir que ela tenha magnitude 1
    playerDirection.normalize();
    
    // Calcula a posição à frente do jogador para colocar o novo bloco de chão
    const groundPosition = playerPosition.add(playerDirection.multiplyScalar(-1));  // 1 unidade na frente do jogador

    // Adicionar o bloco de chão no cenário
    const newGround = createGround(groundPosition.x, groundPosition.y, groundPosition.z);
    scene.add(newGround);

    // Salvar essa nova posição no banco de dados
    saveGroundPositionToDatabase(groundPosition);
   // updateGroundFromDatabase(jsonData.grounds);  // Atualiza o chão no jogo
   
   // Incrementar a pontuação ao adicionar um bloco de chão
    // Atualizar pontos do jogador por interagir com o NPC
    

}



//############################################################################################ funcoes ground addE


const renderDistance = 50; // Ajuste conforme necessário

let groundGeometry = new THREE.PlaneGeometry(1, 1);
let groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
let groundMesh;
let groundCount = 0;
let maxGroundBlocks = 10000; // Ajuste conforme necessário

// Função para criar o chão e marcar como um objeto de chão
function createGround(x, y, z) {
    
    
    const groundGeometry = new THREE.PlaneGeometry(1, 1);  // Tamanho do novo bloco de chão
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
    const newGround = new THREE.Mesh(groundGeometry, groundMaterial);
    newGround.rotation.x = -Math.PI / 2;
    newGround.position.set(x, y - 2, z);  // Ajuste para alinhar o chão
    newGround.isGround = true;  // Marca como objeto de chão
    return newGround;
}


function initGroundMesh() {
    groundMesh = new THREE.InstancedMesh(groundGeometry, groundMaterial, maxGroundBlocks);
    groundMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // Permite atualizar a matriz das instâncias
    scene.add(groundMesh);
}



function addGroundInstance(x, y, z) {
    const dummy = new THREE.Object3D();
    dummy.position.set(x, y - 2, z);
    dummy.rotation.x = -Math.PI / 2; // Rotacionar para ficar plano
    dummy.updateMatrix();
    groundMesh.setMatrixAt(groundCount++, dummy.matrix);
    groundMesh.instanceMatrix.needsUpdate = true;
}


function removeDistantGroundBlocks(playerPosition) {
    groundBlocks = groundBlocks.filter(ground => {
        const distance = Math.hypot(ground.x - playerPosition.x, ground.z - playerPosition.z);
        if (distance > renderDistance) {
            removeGroundInstance(ground); // Função que remove o bloco da cena
            return false; // Remove do array groundBlocks
        }
        return true; // Mantém no array
    });
}

function removeGroundInstance(ground) {
    // Implementar a lógica para remover a instância do InstancedMesh
    // Isso pode ser um pouco complexo com InstancedMesh, pois requer gerenciamento dos índices das instâncias
}

function fetchGroundsFromDatabase() {
    if (!player || !player.group || !player.group.position) {
        console.error('Player não está definido ao chamar fetchGroundsFromDatabase.');
        return;
    }

    const playerPosition = player.group.position;

    fetch('get-grounds.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            x: playerPosition.x,
            z: playerPosition.z,
            renderDistance: renderDistance
        })
    })
    .then(response => response.json())
    .then(jsonData => {
        if (jsonData.status === 'success') {
            updateGroundFromDatabase(jsonData.grounds);
            initNPCs(jsonData.grounds);
        } else {
            console.error('Erro ao recuperar os blocos de chão:', jsonData.message);
        }
    })
    .catch(error => {
        console.error('Erro ao buscar os blocos de chão do banco de dados:', error);
    });
}




function updateGroundFromDatabase(grounds) {
    grounds.forEach(ground => {
        if (!isGroundAlreadyInScene(ground.x, ground.y, ground.z)) {
            addGroundInstance(ground.x, ground.y, ground.z);
            groundBlocks.push({ x: ground.x, y: ground.y, z: ground.z });
        }
    });
}

// Função para verificar se o jogador está dentro dos blocos de chão permitidos
// Função para verificar se o jogador está dentro dos blocos de chão permitidos
function isPlayerInsideGroundBlocks(playerPosition) {
    return groundBlocks.some(ground => {
        // Verificar se a posição do jogador está dentro do bloco de chão (considerando o tamanho 1x1)
        const isInsideX = playerPosition.x >= ground.x - 0.5 && playerPosition.x <= ground.x + 0.5;
        const isInsideZ = playerPosition.z >= ground.z - 0.5 && playerPosition.z <= ground.z + 0.5;
        return isInsideX && isInsideZ;
    });
}

function isGroundAlreadyInScene(x, y, z) {
    return groundBlocks.some(ground =>
        ground.x === x && ground.y === y && ground.z === z
    );
}


//######################################## POSICAO DOS NPCS globais




// Chamar essa função para carregar as posições ao iniciar o jogo

function saveNpcPositionsToDatabase(npcPositions) {
    // Prepara o array de NPCs para envio ao servidor
    const npcs = Object.keys(npcPositions).map(npcName => {
        return {
            name: npcName,
            x: npcPositions[npcName].x,
            y: npcPositions[npcName].y,
            z: npcPositions[npcName].z
        };
    });

    console.log("Enviando as posições dos NPCs:", npcs);  // Verificar se os dados estão corretos

    // Enviar as posições dos NPCs para o servidor
    fetch('save-npc-positions.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(npcs)  // Enviar o array de NPCs
    })
    .then(response => response.text())  // Use text() para debugar a resposta
    .then(data => {
        console.log("Resposta do servidor:", data);  // Imprimir a resposta completa do servidor
        try {
            const jsonData = JSON.parse(data);
            if (jsonData.status === 'success') {
                console.log("Posições dos NPCs salvas com sucesso.");
            } else {
                console.error("Erro ao salvar as posições dos NPCs:", jsonData.message);
            }
        } catch (error) {
            console.error("Erro ao interpretar o JSON:", error, data);  // Exibir o erro e a resposta crua
        }
    })
    .catch(error => {
        console.error("Erro ao salvar as posições dos NPCs:", error);
    });
}
function loadNpcPositionsFromDatabase() {
    fetch('get-npc-positions.php')
        .then(response => response.json())
        .then(data => {
           // console.log("Resposta do servidor para posições dos NPCs:", data); // Log da resposta

            if (data.status === 'success' && Array.isArray(data.npcs)) {
                data.npcs.forEach(npcData => {
                    const { name, x, y, z } = npcData;  // Alterado de id para name

                    // Encontrar o NPC pelo nome
                    let npc = null;
                    if (name === 'sabio') npc = npcSabio;
                    else if (name === 'piadista') npc = npcPiadista;
                    else if (name === 'medico') npc = npcMedico;
                    else if (name === 'cientista') npc = npcCientista;

                    if (npc) {
                        const currentPosition = npc.group.position;

                        // Verificar se as coordenadas são iguais
                        if (currentPosition.x === x && currentPosition.y === y && currentPosition.z === z) {
                           // console.log(`NPC ${name} já está na posição x: ${x}, y: ${y}, z: ${z}. Nenhuma atualização necessária.`);
                        } else {
                            console.log(`Movendo o NPC ${name} para x: ${x}, y: ${y}, z: ${z}`); // Verificar se o NPC foi encontrado e está pronto para mover

                            // Mover o NPC para a nova posição suavemente
                            moveNpcToPosition(npc, { x, y, z });
                        }
                    } else {
                        console.warn(`NPC com nome ${name} não encontrado!`); // Caso o NPC não seja encontrado
                    }
                });
            } else {
                console.error('Erro ao carregar as posições dos NPCs:', data.message || 'Dados de NPCs inválidos.');
            }
        })
        .catch(error => console.error('Erro ao carregar as posições dos NPCs:', error));
}
function moveNpcToPosition(npc, targetPosition) {
    const currentPosition = npc.group.position.clone(); // Clonar para não modificar diretamente
    const duration = 5; // Duração do movimento em segundos
    const startTime = performance.now();
    const epsilon = 0.01; // Precisão para considerar que o NPC chegou à posição final

    // Calcular a direção do movimento
    const direction = new THREE.Vector3(targetPosition.x - currentPosition.x, 0, targetPosition.z - currentPosition.z).normalize();
    const targetRotation = Math.atan2(direction.x, direction.z); // Ângulo da direção do movimento

    // Função de easing quadrática (movimento mais lento no início)
    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function animateMovement() {
        const elapsedTime = (performance.now() - startTime) / 1000; // Tempo em segundos
        let progress = elapsedTime / duration; // Progresso do movimento (de 0 a 1)
        progress = Math.min(progress, 1); // Garantir que o progresso não exceda 1

        // Aplicar a função de easing para suavizar o movimento
        const easedProgress = easeInOutQuad(progress);

        // Interpolar as coordenadas para suavizar o movimento com easing
        const newPosition = new THREE.Vector3(
            THREE.MathUtils.lerp(currentPosition.x, targetPosition.x, easedProgress),
            THREE.MathUtils.lerp(currentPosition.y, targetPosition.y, easedProgress),
            THREE.MathUtils.lerp(currentPosition.z, targetPosition.z, easedProgress)
        );
        npc.group.position.set(newPosition.x, newPosition.y, newPosition.z);

        // Girar o NPC na direção que ele está se movendo
        npc.group.rotation.y = THREE.MathUtils.lerp(npc.group.rotation.y, targetRotation, 0.05); // Suave rotação para a direção do movimento

        // Animação dos membros (pernas e braços) se existirem
        if (npc.group.children) {
            animateNpcLimbs(npc, elapsedTime); // Usando elapsedTime para um movimento contínuo
        }

        // Verificar se o NPC chegou suficientemente perto da posição final
        if (progress < 1 && npc.group.position.distanceTo(new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z)) > epsilon) {
            requestAnimationFrame(animateMovement); // Continuar o movimento
        } else {
            // Garantir que o NPC chegue à posição final
            npc.group.position.set(targetPosition.x, targetPosition.y, targetPosition.z);

            // Parar a animação dos membros
            stopNpcLimbsAnimation(npc);
        }
    }

    requestAnimationFrame(animateMovement); // Iniciar o movimento
}


// Função para animar os membros (pernas e braços) do NPC
function animateNpcLimbs(npc, elapsedTime) {
    const limbSpeed = 5; // Velocidade para os membros
    const limbMovement = Math.sin(elapsedTime * limbSpeed) * 0.5; // Movimento baseado no tempo decorrido, com amplitude maior

    // Movimento das pernas
    if (npc.group.leftLeg && npc.group.rightLeg) {
        npc.group.leftLeg.rotation.x = limbMovement;
        npc.group.rightLeg.rotation.x = -limbMovement;
    }

    // Movimento dos braços, acompanhando o movimento das pernas
    if (npc.group.leftArm && npc.group.rightArm) {
        npc.group.leftArm.rotation.x = -limbMovement * 0.5; // Movimento dos braços é oposto ao das pernas, mas menor
        npc.group.rightArm.rotation.x = limbMovement * 0.5;
    }
}

// Função para parar a animação dos membros
function stopNpcLimbsAnimation(npc) {
    if (npc.group.leftLeg && npc.group.rightLeg && npc.group.leftArm && npc.group.rightArm) {
        npc.group.leftLeg.rotation.x = 0;
        npc.group.rightLeg.rotation.x = 0;
        npc.group.leftArm.rotation.x = 0;
        npc.group.rightArm.rotation.x = 0;
    }
}

// Iniciar o carregamento das posições dos NPCs
loadNpcPositionsFromDatabase();

//################################################### codigo de pontuacao



let score = 0;

function updateScoreBoard() {
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = score; // Atualizar o placar na tela

    // Atualizar a pontuação no banco de dados
    updateScoreInDatabase(score);
}
// Função para buscar a pontuação do jogador ao iniciar o jogo
function fetchPlayerScore() {
    fetch('atualizar_pontos.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: jogadorNickname })  // Envia o nickname para buscar os pontos
    })
    .then(response => response.json())
    .then(data => {
        console.log("Resposta recebida:", data);  // Adiciona log para depurar a resposta do servidor
        if (data.status === 'success') {
            if (typeof data.pontos !== 'undefined') {
                score = data.pontos;  // Atualiza a pontuação com o valor do banco de dados
                updateScoreDisplay(score);  // Atualiza a pontuação na interface
            } else {
                console.error('Erro: Pontuação não definida no servidor');
            }
        } else {
            console.error('Erro ao buscar a pontuação:', data.message);
        }
    })
    .catch(error => {
        console.error('Erro na requisição para buscar a pontuação:', error);
    });
}

// Função para salvar os pontos no banco de dados e atualizar a interface
function updateScoreInDatabase(newScore) {
    fetch('atualizar_pontos.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nickname: jogadorNickname,  // Enviar o nickname do jogador
            pontos: newScore            // Enviar a nova pontuação
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Resposta do servidor após atualizar a pontuação:", data);  // Adiciona log
        if (data.status === 'success') {
            console.log('Pontuação atualizada no banco de dados com sucesso.');
            updateScoreDisplay(newScore);  // Atualiza a pontuação na interface
        } else {
            console.error('Erro ao atualizar a pontuação:', data.message);
        }
    })
    .catch(error => {
        console.error('Erro na requisição para atualizar a pontuação:', error);
    });
}

// Função para atualizar o div com a pontuação
function updateScoreDisplay(newScore) {
    const scoreDisplay = document.getElementById('scoreDisplay');
    if (scoreDisplay) {
        scoreDisplay.textContent = `Tokens: ${newScore}`;
    } else {
        console.error('Div de pontuação não encontrado.');
    }
}

// Função que é chamada quando o jogador ganha pontos
function playerEarnedPoints(pointsEarned) {
    score += pointsEarned;  // Atualizar a pontuação local
    updateScoreInDatabase(score);  // Atualizar a pontuação no banco de dados
}




    init();  // Inicializar o jogo
     // Carregar a pontuação do banco de dados ao iniciar o jogo
        fetchPlayerScore();  // Busca a pontuação ao iniciar

    
 // Configurar o intervalo para enviar a posição dos jogadores e carregar os NPCs a cada 1 segundo (1000 milissegundos)
setInterval(() => {
    carregarJogadoresLogados();  // Carregar os jogadores logados
    loadNpcPositionsFromDatabase();  // Carregar as posições dos NPCs
}, 1000);

setInterval(() => {
    fetchGroundsFromDatabase();
}, 5000); // Atualiza a cada 5 segundos


});