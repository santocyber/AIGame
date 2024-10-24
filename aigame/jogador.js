
  function buscarPersonagemPorNickname(nickname) {
    return fetch(`recuperar_personagem.php?nickname=${nickname}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                return data.personagem;
            } else {
                throw new Error('Erro ao buscar os dados do personagem.');
            }
        })
        .catch(error => {
            console.error('Erro ao buscar personagem:', error);
        });
}

  async function inicializarJogador(scene, nickname) {
    try {
        // Buscar os dados do personagem pelo nickname
        const personagemData = await buscarPersonagemPorNickname(nickname);

        // Se os dados forem retornados corretamente, inicializar o personagem
        player = new Personagem(scene, {
            body: {
                width: 1,
                height: personagemData.body_height,  // Altura do corpo
                depth: 0.5,
                color: personagemData.body_color,  // Cor do corpo
                position: [0, 0, 0]  // Posição do corpo
            },
            head: {
                radius: personagemData.head_radius,  // Tamanho da cabeça
                color: personagemData.head_color,  // Cor da cabeça
                position: [0, personagemData.body_height + 0.5, 0]  // Posição da cabeça
            },
            neck: {
                radiusTop: 0.2,
                radiusBottom: 0.2,
                height: personagemData.neck_height,  // Tamanho do pescoço
                color: personagemData.neck_color,  // Cor do pescoço
                position: [0, personagemData.body_height - 0.5, 0]  // Posição do pescoço
            },
            leftArm: {
                radiusTop: 0.2,
                radiusBottom: 0.2,
                height: 1,
                color: personagemData.arm_color,  // Cor dos braços
                position: [-0.75, personagemData.body_height / 2, 0]  // Posição ajustada do braço esquerdo
            },
            rightArm: {
                radiusTop: 0.2,
                radiusBottom: 0.2,
                height: 1,
                color: personagemData.arm_color,  // Cor dos braços
                position: [0.75, personagemData.body_height / 2, 0]  // Posição ajustada do braço direito
            },
            leftLeg: {
                radiusTop: 0.3,
                radiusBottom: 0.3,
                height: 1.5,
                color: personagemData.leg_color,  // Cor das pernas
                position: [-0.5, -personagemData.body_height / 2, 0]  // Posição ajustada da perna esquerda
            },
            rightLeg: {
                radiusTop: 0.3,
                radiusBottom: 0.3,
                height: 1.5,
                color: personagemData.leg_color,  // Cor das pernas
                position: [0.5, -personagemData.body_height / 2, 0]  // Posição ajustada da perna direita
            },
            hair: {
                color: personagemData.hair_color || '#000000'  // Cor do cabelo, padrão se não especificado
            },
            eyes: {
                color: personagemData.eye_color || '#0000ff'  // Cor dos olhos, padrão se não especificado
            },
            tail: {
                color: personagemData.tail_color || '#ff0000',  // Cor do rabo, padrão se não especificado
                length: personagemData.tail_length || 1  // Comprimento do rabo, padrão se não especificado
            }
        }, [0, 0, 0]);  // Posição inicial do personagem
    } catch (error) {
        console.error('Erro ao inicializar jogador:', error);
    }
}

  
  
  
  
    const playerSpeed = 0.2; // Velocidade do jogador
    let movement = { forward: false, backward: false, left: false, right: false }; // Controle de movimentação
    let player, npcSabio, npcPiadista, npcMedico, npcCientista;
    const groundSize = 50;  // Tamanho do chão
    let rotationSpeed = 0;  // Velocidade de rotação inicial

class Personagem {
    constructor(scene, data, position) {
        this.scene = scene;
        this.data = data;
        this.group = this.createCharacter(position);
        this.isMoving = false;
        this.playerSpeed = 0.1;  // Velocidade de movimento
        this.playerRotationSpeed = 0.05;  // Velocidade de rotação
        this.initPosition = position;
    }


    
    createCharacter(position) {
        const group = new THREE.Group();

        // Corpo (tronco)
        const bodyGeometry = new THREE.BoxGeometry(this.data.body.width, this.data.body.height, this.data.body.depth);
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: this.data.body.color });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.set(...this.data.body.position);
        group.add(body);
        group.body = body;  // Referência para o corpo

        // Cabeça
        const headGeometry = new THREE.SphereGeometry(this.data.head.radius, 32, 32);
        const headMaterial = new THREE.MeshStandardMaterial({ color: this.data.head.color });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(...this.data.head.position);
        body.add(head);  // A cabeça agora é filha do corpo
        group.head = head; // Referência para animar depois

        // Pescoço
        const neckGeometry = new THREE.CylinderGeometry(this.data.neck.radiusTop, this.data.neck.radiusBottom, this.data.neck.height, 32);
        const neckMaterial = new THREE.MeshStandardMaterial({ color: this.data.neck.color });
        const neck = new THREE.Mesh(neckGeometry, neckMaterial);
        neck.position.set(...this.data.neck.position);
        body.add(neck);  // O pescoço também está ligado ao corpo
        group.neck = neck; // Referência para animar depois

        // Braços e pernas (diretamente no grupo principal)
        this.createLimb(group, 'leftArm', this.data.leftArm);
        this.createLimb(group, 'rightArm', this.data.rightArm);
        this.createLimb(group, 'leftLeg', this.data.leftLeg);
        this.createLimb(group, 'rightLeg', this.data.rightLeg);

        // Posicionar o personagem na cena
        group.position.set(...position);
        this.scene.add(group);

        return group;
    }

    createLimb(group, name, data) {
        const geometry = new THREE.CylinderGeometry(data.radiusTop, data.radiusBottom, data.height, 32);
        const material = new THREE.MeshStandardMaterial({ color: data.color });
        const limb = new THREE.Mesh(geometry, material);
        limb.position.set(...data.position);
        limb.rotation.z = name.includes('Arm') ? Math.PI / 2 : 0; // Rotaciona os braços
        group.add(limb);  // Membros são filhos do grupo principal
        group[name] = limb;  // Referência para animar os membros
    }
    
    
    
    
    
    
   move(direction) {
        this.isMoving = true;

        switch (direction) {
            case 'ArrowUp':    
                this.group.translateZ(-this.playerSpeed);  // Move para frente
                break;
            case 'ArrowDown':  
                this.group.translateZ(this.playerSpeed);   // Move para trás
                break;
            case 'ArrowLeft':  
                this.group.rotation.y += this.playerRotationSpeed;  // Rotaciona para a esquerda
                break;
            case 'ArrowRight': 
                this.group.rotation.y -= this.playerRotationSpeed;  // Rotaciona para a direita
                break;
        }
    }

    stop() {
        this.isMoving = false;
    }

    animate(clock) {
        if (this.isMoving) {
            const time = clock.getElapsedTime();
            const angle = Math.sin(time * 4) * 0.5;

            // Movimentar os membros (não o corpo)
            this.group.leftArm.rotation.x = angle;
            this.group.rightArm.rotation.x = -angle;
            this.group.leftLeg.rotation.x = -angle;
            this.group.rightLeg.rotation.x = angle;

            // A cabeça e pescoço podem se mover levemente
            this.group.head.rotation.y = Math.sin(time * 2) * 0.2;
            this.group.neck.rotation.y = this.group.head.rotation.y * 0.5;
        }
    }

    // Função para verificar a colisão entre o player e o NPC
    checkCollisionWith(npc) {
        const playerBox = new THREE.Box3().setFromObject(this.group);
        const npcBox = new THREE.Box3().setFromObject(npc.group);
        return playerBox.intersectsBox(npcBox);
    }
}




class NPC {
    constructor(scene, data, position, role) {
        this.scene = scene;
        this.data = data;
        this.role = role;
        this.group = this.createCharacter(position);
    }

    createCharacter(position) {
        const group = new THREE.Group();

        // Corpo (tronco)
        const bodyGeometry = new THREE.BoxGeometry(this.data.body.width, this.data.body.height, this.data.body.depth);
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: this.data.body.color });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.set(...this.data.body.position);
        group.add(body);

        // Cabeça
        const headGeometry = new THREE.SphereGeometry(this.data.head.radius, 32, 32);
        const headMaterial = new THREE.MeshStandardMaterial({ color: this.data.head.color });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(...this.data.head.position);
        body.add(head);  // A cabeça é filha do corpo

        // Pescoço
        const neckGeometry = new THREE.CylinderGeometry(this.data.neck.radiusTop, this.data.neck.radiusBottom, this.data.neck.height, 32);
        const neckMaterial = new THREE.MeshStandardMaterial({ color: this.data.neck.color });
        const neck = new THREE.Mesh(neckGeometry, neckMaterial);
        neck.position.set(...this.data.neck.position);
        body.add(neck);  // O pescoço também está ligado ao corpo

        // Braços e pernas (diretamente no grupo principal)
        this.createLimb(group, 'leftArm', this.data.leftArm);
        this.createLimb(group, 'rightArm', this.data.rightArm);
        this.createLimb(group, 'leftLeg', this.data.leftLeg);
        this.createLimb(group, 'rightLeg', this.data.rightLeg);

        // Posicionar o NPC na cena
        group.position.set(...position);
        this.scene.add(group);

        return group;
    }

    createLimb(group, name, data) {
        const geometry = new THREE.CylinderGeometry(data.radiusTop, data.radiusBottom, data.height, 32);
        const material = new THREE.MeshStandardMaterial({ color: data.color });
        const limb = new THREE.Mesh(geometry, material);
        limb.position.set(...data.position);
        limb.rotation.z = name.includes('Arm') ? Math.PI / 2 : 0;  // Rotaciona os braços
        group.add(limb);  // Membros são filhos do grupo principal
    }

    // Função para verificar a colisão entre o NPC e o jogador
    checkCollisionWith(player) {
        const npcBox = new THREE.Box3().setFromObject(this.group);
        const playerBox = new THREE.Box3().setFromObject(player.group);
        return npcBox.intersectsBox(playerBox);
    }
}



// Função para animar os membros do jogador (braços e pernas)
let limbAngle = 0;
const walkingSpeed = 0.1;

function animateLimbMovement() {
    limbAngle += walkingSpeed;
    const armSwing = Math.sin(limbAngle) * 0.5;
    const legSwing = Math.cos(limbAngle) * 0.5;

    // Anima os braços para frente e para trás
    player.group.children[1].rotation.z = armSwing;  // Braço esquerdo para frente/para trás
    player.group.children[2].rotation.z = -armSwing; // Braço direito para frente/para trás

    // Anima as pernas para frente e para trás
    player.group.children[3].rotation.x = legSwing;  // Perna esquerda para frente/para trás
    player.group.children[4].rotation.x = -legSwing; // Perna direita para frente/para trás
}



    // Função para bloquear/desbloquear a movimentação
    function blockMovement(block) {
        if (block) {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        } else {
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('keyup', handleKeyUp);
        }
    }
function stopPlayerMovement() {
    movement.forward = false;
    movement.backward = false;
    movement.left = false;
    movement.right = false;
    rotationSpeed = 0;  // Resetando a rotação
}
// Função para parar de mover os membros (parar a animação de movimento)
function stopLimbMovement() {
    player.group.children[1].rotation.z = 0;  // Braço esquerdo parado
    player.group.children[2].rotation.z = 0;  // Braço direito parado
    player.group.children[3].rotation.x = 0;  // Perna esquerda parada
    player.group.children[4].rotation.x = 0;  // Perna direita parada
}

 