class WorldLevel {
  constructor(levelJson) {
    this.name = levelJson.name ?? "Level";

    this.theme = Object.assign(
      { bg: "#F0F0F0", platform: "#C8C8C8", blob: "#1478FF" },
      levelJson.theme ?? {},
    );

    // Physics knobs
    this.gravity = levelJson.gravity ?? 0.65;
    this.jumpV = levelJson.jumpV ?? -11.0;

    // Camera knob (data-driven view state)
    this.camLerp = levelJson.camera?.lerp ?? 0.12;

    // World size + death line
    this.w = levelJson.world?.w ?? 2400;
    this.h = levelJson.world?.h ?? 360;
    this.deathY = levelJson.world?.deathY ?? this.h + 200;

    // Start
    this.start = Object.assign({ x: 80, y: 220, r: 26 }, levelJson.start ?? {});

    // Platforms
    this.platforms = (levelJson.platforms ?? []).map(
      (p) => new Platform(p.x, p.y, p.w, p.h),
    );
    // generate stars ONCE
    this.stars = [];

    for (let i = 0; i < 300; i++) {
      this.stars.push({
        x: random(0, this.w),
        y: random(0, this.h * 0.5),
        size: random(1, 3),
      });
      this.planets = [];

      let planetCount = 6;
      let spacing = this.w / planetCount;

      const colors = ["#FF6B6B", "#6BCBFF", "#FFD93D", "#C77DFF", "#FF9F1C"];

      for (let i = 0; i < planetCount; i++) {
        let baseX = spacing * i;

        this.planets.push({
          x: baseX + random(-200, 200), // small variation
          y: random(50, this.h * 0.35),
          size: random(60, 140),
          color: random(colors),
        });
      }
    }
  }

  drawWorld() {
    // night sky gradient
    for (let y = 0; y < height; y++) {
      let c = lerpColor(color(5, 5, 20), color(20, 20, 40), y / height);
      stroke(c);
      line(this.cam?.x ?? 0, y, this.w, y);
    }

    noStroke();

    // draw planets
    noStroke();

    for (const planet of this.planets) {
      // glow
      fill(
        red(color(planet.color)),
        green(color(planet.color)),
        blue(color(planet.color)),
        60,
      );

      circle(planet.x, planet.y, planet.size * 1.4);

      // main planet
      fill(planet.color);
      circle(planet.x, planet.y, planet.size);

      // subtle shading
      fill(0, 40);
      arc(planet.x, planet.y, planet.size, planet.size, HALF_PI, PI + HALF_PI);
    }

    // stars
    // draw stars
    fill(255);
    noStroke();

    for (const star of this.stars) {
      circle(star.x, star.y, star.size);
    }

    // road
    fill(30);
    rect(0, this.h - 120, this.w, 120);

    // lane divider
    stroke(255, 255, 100);
    strokeWeight(3);

    for (let x = 0; x < this.w; x += 80) {
      line(x, this.h - 60, x + 40, this.h - 60);
    }

    noStroke();

    // streetlights
    for (let x = 200; x < this.w; x += 400) {
      fill(50);
      rect(x, this.h - 160, 6, 80);

      fill(255, 255, 180, 120);
      ellipse(x, this.h - 160, 40, 40);
    }
  }
}
