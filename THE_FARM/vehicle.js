class Vehicle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.maxSpeed = 3;
    this.size = 50;
    this.spacing = 25; // Distance entre les véhicules en mode snake
  }

  update(mode, index, vehicles, leader) {
    this.acceleration.mult(0);

    if (mode === 'follow' || mode === 'leader') {
      // Suivre la souris ou le leader
      let desired = createVector(leader.x - this.position.x, leader.y - this.position.y);
      desired.setMag(this.maxSpeed);
      let steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(0.1); // Limite de la force du vecteur
      this.acceleration.add(steer);

      // Ajouter la force de séparation
      let separationForce = this.separate(vehicles);
      this.acceleration.add(separationForce);
    } else if (mode === 'snake') {
      if (index === 0) {
        // Le premier véhicule suit la souris (ou le leader)
        let desired = createVector(leader.x - this.position.x, leader.y - this.position.y);
        desired.setMag(this.maxSpeed);
        let steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(0.1);
        this.acceleration.add(steer);
      } else {
        // Les autres véhicules suivent le précédent
        let previousVehicle = vehicles[index - 1];
        let desired = createVector(previousVehicle.position.x - this.position.x, previousVehicle.position.y - this.position.y);

        // Ajuster la distance
        if (desired.mag() > this.spacing) {
          desired.setMag(this.maxSpeed); // Accélérer si trop éloigné
        } else {
          desired.setMag(this.maxSpeed * 0.5); // Ralentir quand proche
        }

        let steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(0.1); // Limiter l'accélération pour un mouvement fluide
        this.acceleration.add(steer);
      }
    }

    this.avoidObstacles(obstacles);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
  }

  separate(vehicles) {
    let desiredSeparation = this.size * 1.5; // Distance minimale entre les véhicules
    let steer = createVector(0, 0);
    let count = 0;

    for (let other of vehicles) {
      let d = p5.Vector.dist(this.position, other.position);
      if (d > 0 && d < desiredSeparation) { // Si un autre véhicule est trop proche
        let diff = p5.Vector.sub(this.position, other.position);
        diff.normalize();
        diff.div(d); // Plus éloigné = moins d'effet
        steer.add(diff);
        count++;
      }
    }

    if (count > 0) {
      steer.div(count); // Moyenne des forces
    }

    if (steer.mag() > 0) {
      steer.setMag(this.maxSpeed);
      steer.sub(this.velocity);
      steer.limit(0.1); // Limiter la force de séparation
    }

    return steer;
  }

  avoidObstacles(obstacles) {
    for (let obstacle of obstacles) {
      let dir = p5.Vector.sub(obstacle.pos, this.position);
      let d = dir.mag();
      
      if (d < obstacle.r + this.size) {
        let avoidDir = dir.copy();
        avoidDir.setMag(this.maxSpeed);
        avoidDir.mult(-1);
        this.acceleration.add(avoidDir);
      }
    }
  }

  edges() {
    if (this.position.x > width) this.position.x = 0;
    if (this.position.x < 0) this.position.x = width;
    if (this.position.y > height) this.position.y = 0;
    if (this.position.y < 0) this.position.y = height;
  }

  show() {
    fill(255);
    noStroke();
    image(imageFusee, this.position.x, this.position.y, this.size, this.size);
  }
}
