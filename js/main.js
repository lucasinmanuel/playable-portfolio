import InitialMap from "./scenes/InitialMap.js";

const config = {
  type: Phaser.AUTO,
  parent: "gameDiv",
  dom: { createContainer: true },
  width: 480,
  height: 320,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      //debug: true,
    },
  },
  zoom: 2,
  scene: [InitialMap],
};
export default new Phaser.Game(config);
