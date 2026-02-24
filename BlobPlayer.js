class BlobPlayer {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.r = 26;
    this.vx = 0;
    this.vy = 0;

    this.accel = 1.5;
    this.maxRun = 2.0;

    this.gravity = 0.65;
    this.jumpV = -11.0;

    this.frictionAir = 0.995;
    this.frictionGround = 0.88;

    this.onGround = false;

    // wobble visuals
    this.t = 0;
    this.tSpeed = 0.01;
    this.wobble = 7;
    this.points = 48;
    this.wobbleFreq = 0.9;
  }

  spawnFromLevel(level) {
    this.x = level.start.x;
    this.y = level.start.y;
    this.r = level.start.r;

    this.vx = 0;
    this.vy = 0;
    this.onGround = false;

    this.gravity = level.gravity;
    this.jumpV = level.jumpV;
  }

  tryJump() {
    if (this.onGround) {
      this.vy = this.jumpV;
      this.onGround = false;
    }
  }

  update(level) {
    // input
    let move = 0;
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) move -= 1;
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) move += 1;

    this.vx += this.accel * move;
    this.vx *= this.onGround ? this.frictionGround : this.frictionAir;
    this.vx = constrain(this.vx, -this.maxRun, this.maxRun);

    this.vy += this.gravity;

    // collider box
    let box = {
      x: this.x - this.r,
      y: this.y - this.r,
      w: this.r * 2,
      h: this.r * 2,
    };

    // move X
    box.x += this.vx;
    for (const s of level.platforms) {
      if (BlobPlayer.overlap(box, s)) {
        if (this.vx > 0) box.x = s.x - box.w;
        else if (this.vx < 0) box.x = s.x + s.w;
        this.vx = 0;
      }
    }

    // move Y
    box.y += this.vy;
    this.onGround = false;
    for (const s of level.platforms) {
      if (BlobPlayer.overlap(box, s)) {
        if (this.vy > 0) {
          box.y = s.y - box.h;
          this.vy = 0;
          this.onGround = true;
        } else if (this.vy < 0) {
          box.y = s.y + s.h;
          this.vy = 0;
        }
      }
    }

    // write back
    this.x = box.x + box.w / 2;
    this.y = box.y + box.h / 2;

    // keep inside world horizontally, allow falling below world
    this.x = constrain(this.x, this.r, level.w - this.r);

    this.t += this.tSpeed;
  }

  draw() {
    push();

    // car body
    fill(20);
    rectMode(CENTER);
    rect(this.x, this.y - 120, 60, 24, 6);

    // roof
    fill(40);
    rect(this.x - 5, this.y - 120 - 12, 30, 12, 4);

    // wheels
    fill(0);
    circle(this.x - 18, this.y - 108, 12);
    circle(this.x + 18, this.y - 108, 12);

    // headlights glow
    fill(255, 255, 180, 120);
    ellipse(this.x + 35, this.y - 120, 60, 30);

    pop();
  }
  static overlap(a, b) {
    return (
      a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
    );
  }
}
