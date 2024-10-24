<?php
session_start();
require 'db_config.php'; // Arquivo de conexão ao banco de dados

// Verifica se o usuário está logado
if (isset($_SESSION['nickname'])) {
    $nickname = $_SESSION['nickname'];
} else {
    // Redirecionar para a página de login se não estiver logado
    header("Location: login.php");
    exit();
}

// Verifica se o personagem já existe
$sql = "SELECT * FROM personagens WHERE nickname = :nickname";
$stmt = $pdo->prepare($sql);
$stmt->execute(['nickname' => $nickname]);
$personagem = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$personagem) {
    // Se o personagem não existir, cria um novo com características padrão
    $sql = "INSERT INTO personagens (nickname, body_color, head_color, left_arm_color, right_arm_color, left_leg_color, right_leg_color, hair_color, eye_color, tail_color, neck_color, neck_radius_top, neck_radius_bottom, neck_height)
            VALUES (:nickname, :body_color, :head_color, :left_arm_color, :right_arm_color, :left_leg_color, :right_leg_color, :hair_color, :eye_color, :tail_color, :neck_color, :neck_radius_top, :neck_radius_bottom, :neck_height)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        'nickname' => $nickname,
        'body_color' => '#ffffff', // Corpo branco por padrão
        'head_color' => '#000000', // Cabeça preta por padrão
        'left_arm_color' => '#ffffff',
        'right_arm_color' => '#ffffff',
        'left_leg_color' => '#ffffff',
        'right_leg_color' => '#ffffff',
        'hair_color' => '#000000',  // Cabelo preto por padrão
        'eye_color' => '#0000ff',   // Olhos azuis por padrão
        'tail_color' => '#ff0000',  // Rabo vermelho por padrão
        'neck_color' => '#ffcc00',  // Pescoço amarelo por padrão
        'neck_radius_top' => 2.2,   // Raio superior do pescoço por padrão
        'neck_radius_bottom' => 0.3, // Raio inferior do pescoço por padrão
        'neck_height' => 0.5        // Altura do pescoço por padrão
    ]);

    // Após criar o personagem, não é necessário buscar pelo ID, podemos usar o nickname para pegar o personagem criado.
    $sql = "SELECT * FROM personagens WHERE nickname = :nickname";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['nickname' => $nickname]);
    $personagem = $stmt->fetch(PDO::FETCH_ASSOC);
}

// Passa os dados do personagem para o JavaScript
?>


<head>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">
    <style>
        /* Tema Dark */
        body {
            background-color: #121212;
            color: #e0e0e0;
            font-family: 'Courier New', Courier, monospace;
        }
        #editor {
            background-color: #333;
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        #saveButton, #saveObjButton {
            background-color: #6b4226;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            margin-top: 10px;
        }
        #saveButton:hover, #saveObjButton:hover {
            background-color: #d2691e;
        }
        label {
            color: #e0e0e0;
        }
    </style>
</head>







<script>
// Dados do personagem vindos do PHP
const jogadorNickname = '<?php echo htmlspecialchars($nickname); ?>';
const personagemData = <?php echo json_encode($personagem); ?>;
console.log("Dados do Personagem:", personagemData);
</script>



<div id="editor" class="container">
    <div class="row">
        <div class="col-md-6">
            <label for="bodyHeight">Altura do corpo:</label>
            <input type="range" id="bodyHeight" min="1" max="5" step="0.1" value="2" class="form-control">
        </div>
        <div class="col-md-6">
            <label for="bodyColor">Cor do corpo:</label>
            <input type="color" id="bodyColor" value="#ff0000" class="form-control">
        </div>
    </div>

    <div class="row">
        <div class="col-md-6">
            <label for="headRadius">Tamanho da cabeça:</label>
            <input type="range" id="headRadius" min="0.5" max="2" step="0.1" value="1" class="form-control">
        </div>
        <div class="col-md-6">
            <label for="headColor">Cor da cabeça:</label>
            <input type="color" id="headColor" value="#000000" class="form-control">
        </div>
    </div>

    <div class="row">
        <div class="col-md-6">
            <label for="armLength">Tamanho dos braços:</label>
            <input type="range" id="armLength" min="0.5" max="3" step="0.1" value="1" class="form-control">
        </div>
        <div class="col-md-6">
            <label for="armColor">Cor dos braços:</label>
            <input type="color" id="armColor" value="#ffcc00" class="form-control">
        </div>
    </div>

    <div class="row">
        <div class="col-md-6">
            <label for="legLength">Tamanho das pernas:</label>
            <input type="range" id="legLength" min="0.5" max="3" step="0.1" value="1" class="form-control">
        </div>
        <div class="col-md-6">
            <label for="legColor">Cor das pernas:</label>
            <input type="color" id="legColor" value="#ffcc00" class="form-control">
        </div>
    </div>

    <div class="row">
        <div class="col-md-6">
            <label for="neckHeight">Tamanho do pescoço:</label>
            <input type="range" id="neckHeight" min="0.5" max="3" step="0.1" value="1" class="form-control">
        </div>
        <div class="col-md-6">
            <label for="neckColor">Cor do pescoço:</label>
            <input type="color" id="neckColor" value="#808080" class="form-control">
        </div>
    </div>

    <div class="row mt-3">
        <div class="col-12 text-center">
            <button id="saveButton" class="btn btn-primary">Salvar Alterações</button>
            <button id="saveObjButton" class="btn btn-primary">Salvar como .OBJ</button>
        </div>
    </div>
</div>
<div id="visualizacaoPersonagem" style="width: 100%; height: 400px; border: 1px solid #ccc;" class="mt-5"></div>







    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/js/exporters/OBJExporter.js"></script>
<script>

let personagem;  // Declaração global




class Personagem {
    constructor(scene, data, position) {
        this.scene = scene;
        this.data = data;
        this.group = this.createCharacter(position);
        this.isMoving = false;
        this.playerSpeed = 0.1;
        this.playerRotationSpeed = 0.05;
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
        group.body = body;

        // Cabeça
        const headGeometry = new THREE.SphereGeometry(this.data.head.radius, 32, 32);
        const headMaterial = new THREE.MeshStandardMaterial({ color: this.data.head.color });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(...this.data.head.position);
        body.add(head);
        group.head = head;

        // Pescoço
        const neckGeometry = new THREE.CylinderGeometry(0.2, 0.2, this.data.neck.height, 32);
        const neckMaterial = new THREE.MeshStandardMaterial({ color: this.data.neck.color });
        const neck = new THREE.Mesh(neckGeometry, neckMaterial);
        neck.position.set(...this.data.neck.position);
        body.add(neck);  // O pescoço também está ligado ao corpo
        group.neck = neck;

        // Braços
        this.createLimb(group, 'leftArm', this.data.leftArm);
        this.createLimb(group, 'rightArm', this.data.rightArm);

        // Pernas
        this.createLimb(group, 'leftLeg', this.data.leftLeg);
        this.createLimb(group, 'rightLeg', this.data.rightLeg);

        group.position.set(...position);
        this.scene.add(group);

        return group;
    }

    createLimb(group, name, data) {
        const geometry = new THREE.CylinderGeometry(data.radiusTop, data.radiusBottom, data.height, 32);
        const material = new THREE.MeshStandardMaterial({ color: data.color });
        const limb = new THREE.Mesh(geometry, material);
        limb.position.set(...data.position);
        limb.rotation.z = name.includes('Arm') ? Math.PI / 2 : 0;
        group.add(limb);
        group[name] = limb;
    }
}


function inicializarVisualizacaoPersonagem() {
    const divVisualizacao = document.getElementById('visualizacaoPersonagem');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(75, divVisualizacao.clientWidth / divVisualizacao.clientHeight, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(divVisualizacao.clientWidth, divVisualizacao.clientHeight);
    divVisualizacao.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Inicializar o personagem com todas as partes, incluindo o pescoço (neck)
    personagem = new Personagem(scene, {
        body: {
            width: 1, height: 2, depth: 0.5,
            color: personagemData.body_color,
            position: [0, 1, 0]
        },
        head: {
            radius: 0.5,
            color: personagemData.head_color,
            position: [0, 1.75, 0]
        },
        neck: {  // Adicionando o pescoço ao personagem
            radiusTop: 0.2,
            radiusBottom: 0.2,
            height: 0.5,
            color: '#ffffff',  // Cor do pescoço (pode ser alterada)
            position: [0, 1.25, 0]  // Posição correta do pescoço
        },
        leftArm: {
            radiusTop: 0.2, radiusBottom: 0.2, height: 1,
            color: personagemData.left_arm_color,
            position: [-1, 1.5, 0]
        },
        rightArm: {
            radiusTop: 0.2, radiusBottom: 0.2, height: 1,
            color: personagemData.right_arm_color,
            position: [1, 1.5, 0]
        },
        leftLeg: {
            radiusTop: 0.3, radiusBottom: 0.3, height: 1,
            color: personagemData.left_leg_color,
            position: [-0.5, 0, 0]
        },
        rightLeg: {
            radiusTop: 0.3, radiusBottom: 0.3, height: 1,
            color: personagemData.right_leg_color,
            position: [0.5, 0, 0]
        },
        hair: {
            color: personagemData.hair_color
        },
        eyes: {
            color: personagemData.eye_color
        },
        tail: {
            color: personagemData.tail_color
        }
    }, [0, 0, 0]);

    // Função de animação
    function animate() {
        requestAnimationFrame(animate);
        personagem.group.rotation.y += 0.01;  // Rotaciona para visualização
        renderer.render(scene, camera);
    }

    animate();
    adicionarListeners();
}

// Chama a função ao carregar a página
window.onload = function () {
    inicializarVisualizacaoPersonagem();
};

// Função para adicionar os event listeners
function adicionarListeners() {
    
    
    
    
    
    
    // Listener para alterar o corpo
document.getElementById('bodyHeight').addEventListener('input', function () {
    personagem.group.body.scale.y = this.value;
});

document.getElementById('bodyColor').addEventListener('input', function () {
    personagem.group.body.material.color.set(this.value);
});

// Listener para alterar a cor da cabeça
document.getElementById('headColor').addEventListener('input', function () {
    personagem.group.head.material.color.set(this.value);
});

    // Listener para alterar o tamanho da cabeça
document.getElementById('headRadius').addEventListener('input', function () {
    const currentColor = personagem.group.head.material.color.getHexString();  // Preserve a cor atual
    personagem.group.head.scale.set(this.value, this.value, this.value);
    personagem.group.head.material.color.set(`#${currentColor}`);  // Reaplica a cor
});

    
// Listener para alterar o tamanho dos braços
document.getElementById('armLength').addEventListener('input', function () {
    const currentLeftArmColor = personagem.group.leftArm.material.color.getHexString();
    const currentRightArmColor = personagem.group.rightArm.material.color.getHexString();
    
    personagem.group.leftArm.scale.y = this.value;
    personagem.group.rightArm.scale.y = this.value;

    personagem.group.leftArm.material.color.set(`#${currentLeftArmColor}`);
    personagem.group.rightArm.material.color.set(`#${currentRightArmColor}`);
});


// Listener para alterar o tamanho das pernas
document.getElementById('legLength').addEventListener('input', function () {
    const currentLeftLegColor = personagem.group.leftLeg.material.color.getHexString();
    const currentRightLegColor = personagem.group.rightLeg.material.color.getHexString();
    
    personagem.group.leftLeg.scale.y = this.value;
    personagem.group.rightLeg.scale.y = this.value;

    personagem.group.leftLeg.material.color.set(`#${currentLeftLegColor}`);
    personagem.group.rightLeg.material.color.set(`#${currentRightLegColor}`);
});


document.getElementById('armColor').addEventListener('input', function () {
    personagem.group.leftArm.material.color.set(this.value);
    personagem.group.rightArm.material.color.set(this.value);
});

document.getElementById('legColor').addEventListener('input', function () {
    personagem.group.leftLeg.material.color.set(this.value);
    personagem.group.rightLeg.material.color.set(this.value);
});

// Listener para alterar o tamanho do pescoço
document.getElementById('neckHeight').addEventListener('input', function () {
    personagem.group.neck.scale.y = this.value;
});

// Listener para alterar a cor do pescoço
document.getElementById('neckColor').addEventListener('input', function () {
    personagem.group.neck.material.color.set(this.value);
});
// Função para salvar as características do personagem
document.getElementById('saveButton').addEventListener('click', function () {
    
    
    
    const data = {
        nickname: jogadorNickname,
        body_height: document.getElementById('bodyHeight').value,
        body_color: document.getElementById('bodyColor').value,
        head_radius: document.getElementById('headRadius').value,
        neck_height: document.getElementById('neckHeight').value,  // Adiciona o tamanho do pescoço
        neck_color: document.getElementById('neckColor').value,    // Adiciona a cor do pescoço
        head_color: document.getElementById('headColor').value,
        arm_color: document.getElementById('armColor').value,
        leg_color: document.getElementById('legColor').value
    };


fetch('salvar_personagem.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
})
.then(response => response.text())  // Usa .text() para ver a resposta bruta do servidor
.then(data => {
    console.log("Resposta completa do servidor:", data);  // Log para ver a resposta do servidor
    try {
        const jsonData = JSON.parse(data);  // Tenta converter a resposta para JSON
        if (jsonData.status === 'success') {
            alert('Características salvas com sucesso!');
        } else {
            alert('Erro ao salvar características: ' + jsonData.message);
        }
    } catch (error) {
        console.error('Erro ao processar o JSON:', error, data);  // Exibe o erro e os dados brutos
        alert('Erro ao processar a resposta do servidor.');
    }
})
.catch(error => {
    console.error('Erro de rede ou na resposta do servidor:', error);
    alert('Erro de rede ao tentar salvar as características.');
});


});



    


}

// Chama a função ao carregar a página
window.onload = function () {
    inicializarVisualizacaoPersonagem();
};



// Função para salvar o personagem como um arquivo OBJ
document.getElementById('saveObjButton').addEventListener('click', function () {
    // Inicialize o exportador OBJ
    const exporter = new THREE.OBJExporter();
    
    // Exporte o modelo do personagem para formato OBJ
    const result = exporter.parse(personagem.group);

    // Crie um blob para fazer download do arquivo
    const blob = new Blob([result], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'personagem.obj';
    
    // Simule o clique para baixar o arquivo
    link.click();
});



</script>
