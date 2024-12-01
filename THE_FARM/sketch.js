let vehicles = [];
let leader;
let obstacles = [];
let mode = 'follow'; // 'follow', 'snake', or 'leader'
let backgroundImage;  
let backgroundMusic;  

class Obstacle {
  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.r = r;
  }

  show() {
    push();
    imageMode(CENTER); 
    image(treeImage, this.pos.x, this.pos.y, this.r * 2, this.r * 2); 
    pop();
  }
}

function preload() {
  backgroundMusic = loadSound('./assets/music.mp3'); 
  imageFusee = loadImage('./assets/Sheep_beee.png');
  treeImage = loadImage('./assets/tree.png'); 
  backgroundImage = loadImage('./assets/03.png'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);  // Utiliser la taille de la fenêtre pour couvrir tout l'écran
  leader = createVector(mouseX, mouseY);

  // Créer quelques véhicules avec des positions dans les nouvelles dimensions du canvas
  for (let i = 0; i < 10; i++) {
    vehicles.push(new Vehicle(random(width), random(height)));
  }

  // Ajouter des obstacles à des positions fixes avec une taille fixe
  let fixedPositions = [
    { x: 200, y: 300 },
    { x: 600, y: 500 },
    { x: 900, y: 200 },
    { x: 300, y: 700 },
    { x: 1600, y: 600 }
  ];

  let size = 80; // Taille fixe des obstacles

  for (let pos of fixedPositions) {
    obstacles.push(new Obstacle(pos.x, pos.y, size));
  }  
  backgroundMusic.loop(); // Démarre la musique en boucle 
}

function draw() {
  if (backgroundImage) {
    image(backgroundImage, 0, 0, width, height);  // Affiche l'image de fond
  }

  leader.x = mouseX;
  leader.y = mouseY;
  
  // Gérer les modes avec les touches L et S
  if (keyIsPressed) {
    if (key === 'l' || key === 'L') {
      mode = 'leader';
    } else if (key === 's' || key === 'S') {
      mode = 'snake';
    }
  }
  
  // Interface utilisateur pour les modes
  displayModeInfo();

  // Afficher les obstacles (arbres)
  for (let obstacle of obstacles) {
    obstacle.show();
  }

  // Mettre à jour les véhicules
  for (let i = 0; i < vehicles.length; i++) {
    let vehicle = vehicles[i];
    vehicle.update(mode, i, vehicles, leader); // Passer l'index pour ajuster les distances
    vehicle.edges();  // Gérer les bords du canvas
    vehicle.show(); // Afficher l'image du véhicule
  }
}

function displayModeInfo() {
  push();
  fill(0, 150); // Noir avec transparence
  noStroke();
  rect(10, 10, 250, 100, 10); // Rectangle avec bords arrondis pour le fond
  
  fill(50); // Gris foncé pour le fond du carreau
  stroke(255); // Contour blanc
  rect(20, 40, 25, 25, 3); // Petit rectangle arrondi pour la touche
  fill(255); // Blanc pour la lettre
  noStroke();
  textSize(16);
  textAlign(CENTER, CENTER);
  text("S", 32.5, 52.5); // Centrer la lettre dans le carreau
  textAlign(LEFT, CENTER);
  text(" : Mode Snake", 55, 52.5);

  fill(50); // Gris foncé pour le fond du carreau
  stroke(255); // Contour blanc
  rect(20, 70, 25, 25, 3); // Petit rectangle arrondi pour la touche
  fill(255); // Blanc pour la lettre
  noStroke();
  textSize(16);
  textAlign(CENTER, CENTER);
  text("L", 32.5, 82.5); // Centrer la lettre dans le carreau
  textAlign(LEFT, CENTER);
  text(" : Mode Leader", 55, 82.5);

  fill(0); // Ombre (noire)
  textSize(18);
  textStyle(BOLD); // Texte en gras
  text("Mode actuel : " + mode, 21, 28); // Texte légèrement décalé pour ombre

  fill(255, 204, 0); // Couleur jaune
  text("Mode actuel : " + mode, 20, 27); // Texte principal en jaune
  pop();
}

function mousePressed() {
  if (!backgroundMusic.isPlaying()) {
    backgroundMusic.loop(); // Démarre la musique en boucle
  }
} 

