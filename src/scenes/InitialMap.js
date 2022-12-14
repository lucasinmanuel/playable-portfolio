import Menu from "./Menu.js";

export default class Scenes extends Phaser.Scene {
  preload() {
    this.load.spritesheet("player", "src/assets/tilemaps/tiles/player.png", {
      frameWidth: 16,
      frameHeight: 21,
      startFrame: 0,
      endFrame: 31,
    });
    this.load.image("mapa_auxiliar", "src/assets/images/mapa_auxiliar.jpg");
    this.load.image("seta_baixo", "src/assets/images/seta_baixo.png");
    this.load.image("seta_cima", "src/assets/images/seta_cima.png");
    this.load.image("tiles_farm", "src/assets/tilemaps/tiles/farm.png");
    this.load.image("tiles_nature", "src/assets/tilemaps/tiles/nature.png");
    this.load.image("tiles_town", "src/assets/tilemaps/tiles/town.png");
    this.load.image("tiles_fishing", "src/assets/tilemaps/tiles/fishing.png");
    this.load.tilemapTiledJSON(
      "map",
      "src/assets/tilemaps/maps/initial_map.json"
    );
  }
  create() {
    this.menu = this.scene.add("menu", Menu, true);
    this.mapaAuxiliar = this.add
      .image(240, 160, "mapa_auxiliar")
      .setDepth(4)
      .setDisplaySize(this.game.config.width, this.game.config.height)
      .setVisible(false);

    this.width = this.game.config.width * 2;
    this.height = this.game.config.height * 2;

    let map = this.make.tilemap({
      key: "map",
    });
    let farm = map.addTilesetImage("assets_farm", "tiles_farm");
    let nature = map.addTilesetImage("assets_nature", "tiles_nature");
    let town = map.addTilesetImage("assets_town", "tiles_town");
    let fishing = map.addTilesetImage("assets_fishing", "tiles_fishing");

    let ground = map.createLayer("ground", [farm, fishing], 0, 0);
    this.grass = map.createLayer("grass", [farm, fishing], 0, 0);
    this.water = map.createLayer("water", fishing, 0, 0);
    this.objectCollider = map.createLayer(
      "objectCollider",
      [farm, town, fishing],
      0,
      0
    );
    this.aboveObject = map.createLayer("aboveObject", [farm, town], 0, 0);
    this.board = map.createLayer("board", town, 0, 0);
    this.frutas = map.createLayer("frutas", farm, 0, 0);
    let flora = map.createLayer("flora", [farm, nature], 0, 0);
    let bridge = map.createLayer("bridge", fishing, 0, 0);

    this.water.setCollisionByProperty({ collides: true });
    this.objectCollider.setCollisionByProperty({ collides: true });

    this.player = this.physics.add.sprite(424, 105, "player");
    this.player.setBodySize(8, 19);

    this.physics.add.collider(this.player, this.water);

    //DEIXA VISIVEL OS LOCAIS DE COLISÃO
    // const debugGraphics = this.add.graphics().setAlpha(0.7);
    // this.objectCollider.renderDebug(debugGraphics, {
    //   tileColor: null,
    //   collidingTileColor: new Phaser.Display.Color(243, 234, 48),
    //   faceColor: new Phaser.Display.Color(40, 39, 255),
    // });
    // this.water.renderDebug(debugGraphics, {
    //   tileColor: null,
    //   collidingTileColor: new Phaser.Display.Color(243, 234, 48),
    //   faceColor: new Phaser.Display.Color(40, 39, 255),
    // });
    // this.board.renderDebug(debugGraphics, {
    //   tileColor: null,
    //   collidingTileColor: new Phaser.Display.Color(243, 234, 48),
    //   faceColor: new Phaser.Display.Color(40, 39, 255),
    // });

    //GERENCIMANTO DE PROFUNDIDADE DAS CAMADAS
    this.aboveObject.setDepth(2);

    //ANIMAÇÃO DO PERSONAGEM
    const anims = this.anims;
    anims.create({
      key: "front",
      frames: anims.generateFrameNames("player", {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "back",
      frames: anims.generateFrameNames("player", {
        start: 8,
        end: 15,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "right",
      frames: anims.generateFrameNames("player", {
        start: 16,
        end: 23,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "left",
      frames: anims.generateFrameNames("player", {
        start: 24,
        end: 31,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.camera = this.cameras.main;
    this.camera.startFollow(this.player, true);
    this.camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    //EVENTO DE COLISÃO
    this.colliderEvent();

    this.input.keyboard.on("keydown", (e) => {
      if (e.key === "m" && !this.scene.isVisible("menu")) {
        if (this.mapaAuxiliar.visible) {
          this.mapaAuxiliar.setVisible(false);
          this.camera.startFollow(this.player, true);
          this.player.enableBody(false, 0, 0, true, true);
        } else {
          this.mapaAuxiliar.setVisible(true);
          this.camera.stopFollow();
          this.camera.centerOn(0, 0);
          this.player.disableBody(true, false);
        }
      }
    });
  }

  update() {
    if (this.scene.isVisible("menu")) {
      this.player.disableBody(true, false);
    } else {
      if (!this.mapaAuxiliar.visible) {
        this.player.enableBody(false, 0, 0, true, true);
      }
    }

    const preVelocity = this.player.body.velocity.clone();

    this.player.body.setVelocity(0);
    let cursors = this.input.keyboard.createCursorKeys();
    if (cursors.up.isDown) {
      this.player.setVelocityY(-60);
    } else if (cursors.right.isDown) {
      this.player.setVelocityX(60);
    } else if (cursors.down.isDown) {
      this.player.setVelocityY(60);
    } else if (cursors.left.isDown) {
      this.player.setVelocityX(-60);
    }

    if (cursors.up.isDown) {
      this.player.anims.play("back", true);
    } else if (cursors.right.isDown) {
      this.player.anims.play("right", true);
    } else if (cursors.down.isDown) {
      this.player.anims.play("front", true);
    } else if (cursors.left.isDown) {
      this.player.anims.play("left", true);
    } else {
      this.player.anims.stop();
      if (preVelocity.x < 0) {
        this.player.setTexture("player", 24);
      } else if (preVelocity.x > 0) {
        this.player.setTexture("player", 20);
      } else if (preVelocity.y < 0) {
        let assets = [8, 12];
        this.player.setTexture("player", assets[Math.floor(Math.random() * 2)]);
      } else if (preVelocity.y > 0) {
        let assets = [0, 4];
        this.player.setTexture("player", assets[Math.floor(Math.random() * 2)]);
      }
    }
  }

  colliderEvent() {
    //PROJETO ALQUIMIA DAS PALAVRAS
    this.alquimia = this.alquimiaDasPalavras();

    //PROJETO AGÊNCIA DE VIAGENS HERLIVRE
    this.herlivre = this.herlivreTravelAgency();

    //PROJETO STICKERS GENERATOR
    this.stickers = this.stickersGenerator();

    //PROJETO RICK AND MORTY API
    this.rickAndMorty = this.rickAndMortyAPI();

    this.physics.add.collider(this.player, this.objectCollider, () => {
      if (
        this.player.x >= 580 &&
        this.player.x <= 652 &&
        this.player.y === 137.5
      ) {
        this.physics.disableUpdate();
        this.player.y += 10;
        let camera = this.camera;
        camera.centerOn(0, 0);
        this.alquimia.setVisible(true);

        let target = this.alquimia.children.getArray()[1];
        this.camera.startFollow(target, true);
        let alquimia = this.alquimia;
        this.alquimia.children.getArray()[2].on("pointerdown", function () {
          if (target.y <= 360) {
            target.setY(target.y + 40);
            alquimia.children.getArray()[2].y += 40;
            alquimia.children.getArray()[3].y += 40;
          }
        });

        this.alquimia.children.getArray()[3].on("pointerdown", function () {
          if (target.y > 160) {
            target.setY(target.y - 40);
            alquimia.children.getArray()[2].y -= 40;
            alquimia.children.getArray()[3].y -= 40;
          }
        });

        this.alquimia.children.getArray()[9].on("pointerdown", function () {
          window.open(
            "https://github.com/LucasInmanuel/stickers-generator",
            "_blank"
          );
        });

        this.alquimia.children.getArray()[10].on("pointerdown", function () {
          window.open(
            "https://stickers-generator-front-end-deploy.vercel.app/",
            "_blank"
          );
        });

        let physics = this.physics;
        let player = this.player;
        this.alquimia.children.getArray()[11].on("pointerdown", function () {
          alquimia.setVisible(false);
          camera.startFollow(player, true);
          physics.enableUpdate();
        });
      } else if (
        this.player.x >= 148 &&
        this.player.x <= 220 &&
        this.player.y === 89.5
      ) {
        this.physics.disableUpdate();
        this.player.y += 10;
        let camera = this.camera;
        camera.centerOn(0, 0);
        this.herlivre.setVisible(true);

        let target = this.herlivre.children.getArray()[1];
        this.camera.startFollow(target, true);
        let herlivre = this.herlivre;
        this.herlivre.children.getArray()[2].on("pointerdown", function () {
          if (target.y <= 240) {
            target.setY(target.y + 40);
            herlivre.children.getArray()[2].y += 40;
            herlivre.children.getArray()[3].y += 40;
          }
        });

        this.herlivre.children.getArray()[3].on("pointerdown", function () {
          if (target.y > 160) {
            target.setY(target.y - 40);
            herlivre.children.getArray()[2].y -= 40;
            herlivre.children.getArray()[3].y -= 40;
          }
        });

        this.herlivre.children.getArray()[8].on("pointerdown", function () {
          window.open(
            "https://github.com/LucasInmanuel/herlivre-travel-agency",
            "_blank"
          );
        });

        this.herlivre.children.getArray()[9].on("pointerdown", function () {
          window.open(
            "https://herlivre-travel-agency-deploy.vercel.app/",
            "_blank"
          );
        });

        let physics = this.physics;
        let player = this.player;
        this.herlivre.children.getArray()[10].on("pointerdown", function () {
          herlivre.setVisible(false);
          camera.startFollow(player, true);
          physics.enableUpdate();
        });
      } else if (
        this.player.x >= 548 &&
        this.player.x <= 620 &&
        this.player.y === 457.5
      ) {
        this.physics.disableUpdate();
        this.player.y += 10;
        let camera = this.camera;
        camera.centerOn(0, 0);
        this.rickAndMorty.setVisible(true);

        let target = this.rickAndMorty.children.getArray()[1];
        this.camera.startFollow(target, true);
        let rickAndMorty = this.rickAndMorty;
        this.rickAndMorty.children.getArray()[2].on("pointerdown", function () {
          if (target.y <= 280) {
            target.setY(target.y + 40);
            rickAndMorty.children.getArray()[2].y += 40;
            rickAndMorty.children.getArray()[3].y += 40;
          }
        });

        this.rickAndMorty.children.getArray()[3].on("pointerdown", function () {
          if (target.y > 160) {
            target.setY(target.y - 40);
            rickAndMorty.children.getArray()[2].y -= 40;
            rickAndMorty.children.getArray()[3].y -= 40;
          }
        });

        this.rickAndMorty.children.getArray()[8].on("pointerdown", function () {
          window.open(
            "https://github.com/LucasInmanuel/rick-and-morty-API",
            "_blank"
          );
        });

        this.rickAndMorty.children.getArray()[9].on("pointerdown", function () {
          window.open(
            "https://rick-and-morty-api-phi-eight.vercel.app/",
            "_blank"
          );
        });

        let physics = this.physics;
        let player = this.player;
        this.rickAndMorty.children
          .getArray()[10]
          .on("pointerdown", function () {
            rickAndMorty.setVisible(false);
            camera.startFollow(player, true);
            physics.enableUpdate();
          });
      } else if (
        this.player.x >= 1012 &&
        this.player.x <= 1084 &&
        this.player.y === 553.5
      ) {
        this.physics.disableUpdate();
        this.player.y += 10;
        let camera = this.camera;
        camera.centerOn(0, 0);
        this.stickers.setVisible(true);

        let target = this.stickers.children.getArray()[1];
        this.camera.startFollow(target, true);
        let stickers = this.stickers;
        this.stickers.children.getArray()[2].on("pointerdown", function () {
          if (target.y <= 280) {
            target.setY(target.y + 40);
            stickers.children.getArray()[2].y += 40;
            stickers.children.getArray()[3].y += 40;
          }
        });

        this.stickers.children.getArray()[3].on("pointerdown", function () {
          if (target.y > 160) {
            target.setY(target.y - 40);
            stickers.children.getArray()[2].y -= 40;
            stickers.children.getArray()[3].y -= 40;
          }
        });

        this.stickers.children.getArray()[8].on("pointerdown", function () {
          window.open(
            "https://github.com/LucasInmanuel/stickers-generator",
            "_blank"
          );
        });

        this.stickers.children.getArray()[9].on("pointerdown", function () {
          window.open(
            "https://stickers-generator-front-end-deploy.vercel.app/",
            "_blank"
          );
        });

        let physics = this.physics;
        let player = this.player;
        this.stickers.children.getArray()[10].on("pointerdown", function () {
          stickers.setVisible(false);
          camera.startFollow(player, true);
          physics.enableUpdate();
        });
      }
    });
  }

  alquimiaDasPalavras() {
    return this.add
      .group([
        this.add.rectangle(0, 0, this.width, this.height * 2, 0xe0a354),
        this.add.text(0, this.camera.centerY, ".", { color: "transparent" }),
        this.add
          .image(this.camera.width - 24, this.camera.height - 34, "seta_baixo")
          .setDisplaySize(30, 50)
          .setInteractive({
            cursor: "url(src/assets/images/cursor_over.png), pointer",
          }),
        this.add
          .image(this.camera.width - 24, this.camera.height - 100, "seta_cima")
          .setDisplaySize(30, 50)
          .setInteractive({
            cursor: "url(src/assets/images/cursor_over.png), pointer",
          }),
        this.add.text(10, 15, "Alquimia Das Palavras", {
          fontStyle: "bold",
        }),
        this.add.text(
          10,
          45,
          "Projeto criado a partir do trabalho em equipe. Criamos um jogo que ajuda a reduzir a baixa proficiência em leitura das pessoas com dislexia.",
          { wordWrap: { width: 400 } }
        ),
        this.add.text(
          10,
          115,
          "Main Techs: Bootstrap, JavaScript, Java, Spring, MySQL",
          { wordWrap: { width: 400 } }
        ),
        this.add.text(
          10,
          158,
          "Sinopse do jogo: de uma hora para outra as pessoas começaram a esquecer determinadas palavras. No entanto, não há necessidade de pânico, pois o Estabelecimento Alquimia das Palavras está pronto para fazer os seus clientes recuperarem suas palavras perdidas!",
          { wordWrap: { width: 400 } }
        ),
        this.add
          .dom(220, 385)
          .createFromHTML(
            '<iframe width="420" height="215" src="https://www.youtube.com/embed/8nGguBwmmDU" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
          ),
        this.add
          .text(10, 500, "Github", {
            backgroundColor: "darkblue",
            padding: 5,
          })
          .setInteractive({
            cursor: "url(src/assets/images/cursor_over.png), pointer",
          }),
        this.add
          .text(90, 500, "Deploy", {
            backgroundColor: "darkblue",
            padding: 5,
          })
          .setInteractive({
            cursor: "url(src/assets/images/cursor_over.png), pointer",
          }),
        this.add
          .text(this.camera.width - 29, 10, "X", {
            padding: 5,
            fontStyle: "bold",
          })
          .setInteractive({
            cursor: "url(src/assets/images/cursor_over.png), pointer",
          }),
      ])
      .setDepth(3)
      .setVisible(false);
  }

  herlivreTravelAgency() {
    return this.add
      .group([
        this.add.rectangle(0, 0, this.width, this.height * 2, 0xe0a354),
        this.add.text(0, this.camera.centerY, ".", { color: "transparent" }),
        this.add
          .image(this.camera.width - 24, this.camera.height - 34, "seta_baixo")
          .setDisplaySize(30, 50)
          .setInteractive({
            cursor: "url(src/assets/images/cursor_over.png), pointer",
          }),
        this.add
          .image(this.camera.width - 24, this.camera.height - 100, "seta_cima")
          .setDisplaySize(30, 50)
          .setInteractive({
            cursor: "url(src/assets/images/cursor_over.png), pointer",
          }),
        this.add.text(10, 15, "Herlivre", {
          fontStyle: "bold",
        }),
        this.add.text(
          10,
          45,
          "Site de uma agência de viagens, criado usando Spring MCV, junto com um Banco de Dados.",
          { wordWrap: { width: 400 } }
        ),
        this.add.text(10, 100, "Main Techs: Bootstrap, Java, Spring, MySQL", {
          wordWrap: { width: 400 },
        }),
        this.add
          .dom(220, 250)
          .createFromHTML(
            '<iframe width="420" height="215" src="https://www.youtube.com/embed/3bzx_0W_C6Y" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
          ),
        this.add
          .text(10, 365, "Github", {
            backgroundColor: "darkblue",
            padding: 5,
          })
          .setInteractive({
            cursor: "url(src/assets/images/cursor_over.png), pointer",
          }),
        this.add
          .text(90, 365, "Deploy", {
            backgroundColor: "darkblue",
            padding: 5,
          })
          .setInteractive({
            cursor: "url(src/assets/images/cursor_over.png), pointer",
          }),
        this.add
          .text(this.camera.width - 29, 10, "X", {
            padding: 5,
            fontStyle: "bold",
          })
          .setInteractive({
            cursor: "url(src/assets/images/cursor_over.png), pointer",
          }),
      ])
      .setDepth(3)
      .setVisible(false);
  }

  stickersGenerator() {
    return this.add
      .group([
        this.add.rectangle(0, 0, this.width, this.height * 2, 0xe0a354),
        this.add.text(0, this.camera.centerY, ".", { color: "transparent" }),
        this.add
          .image(this.camera.width - 24, this.camera.height - 34, "seta_baixo")
          .setDisplaySize(30, 50)
          .setInteractive({
            cursor: "url(src/assets/images/cursor_over.png), pointer",
          }),
        this.add
          .image(this.camera.width - 24, this.camera.height - 100, "seta_cima")
          .setDisplaySize(30, 50)
          .setInteractive({
            cursor: "url(src/assets/images/cursor_over.png), pointer",
          }),
        this.add.text(10, 15, "Stickers Generator", {
          fontStyle: "bold",
        }),
        this.add.text(
          10,
          45,
          "Projeto criado ao participar da Imersão Java proporcionado pela Alura. Aprendemos a consumir uma API de filmes com Java, geramos figurinhas, vimos os benefícios da orientação a objetos, criamos uma API com Spring e publicamos a mesma no Cloud usando o site Heroku.",
          { wordWrap: { width: 400 } }
        ),
        this.add.text(10, 162, "Main Techs: JavaScript, Java, Spring", {
          wordWrap: { width: 400 },
        }),
        this.add
          .dom(220, 300)
          .createFromHTML(
            '<iframe width="420" height="215" src="https://www.youtube.com/embed/E5i_VZKpFb8" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
          ),
        this.add
          .text(10, 415, "Github", {
            backgroundColor: "darkblue",
            padding: 5,
          })
          .setInteractive({
            cursor: "url(src/assets/images/cursor_over.png), pointer",
          }),
        this.add
          .text(90, 415, "Deploy", {
            backgroundColor: "darkblue",
            padding: 5,
          })
          .setInteractive({
            cursor: "url(src/assets/images/cursor_over.png), pointer",
          }),
        this.add
          .text(this.camera.width - 29, 10, "X", {
            padding: 5,
            fontStyle: "bold",
          })
          .setInteractive({
            cursor: "url(src/assets/images/cursor_over.png), pointer",
          }),
      ])
      .setDepth(3)
      .setVisible(false);
  }

  rickAndMortyAPI() {
    return this.add
      .group([
        this.add.rectangle(0, 0, this.width, this.height * 2, 0xe0a354),
        this.add.text(0, this.camera.centerY, ".", { color: "transparent" }),
        this.add
          .image(this.camera.width - 24, this.camera.height - 34, "seta_baixo")
          .setDisplaySize(30, 50)
          .setInteractive({
            cursor: "url(src/assets/images/cursor_over.png), pointer",
          }),
        this.add
          .image(this.camera.width - 24, this.camera.height - 100, "seta_cima")
          .setDisplaySize(30, 50)
          .setInteractive({
            cursor: "url(src/assets/images/cursor_over.png), pointer",
          }),
        this.add.text(10, 15, "Rick And Morty API", {
          fontStyle: "bold",
        }),
        this.add.text(
          10,
          45,
          "Projeto que faz uso da Rick and Morty API. Me desafiei ao criar o efeito de transição a partir do portal que é mostrado na série. Adicionei um botão para desabilitar ou ativar o efeito de transição caso seja necessário.",
          { wordWrap: { width: 400 } }
        ),
        this.add.text(
          10,
          148,
          "Main Techs: React, Next.js, Axios, Framer Motion",
          {
            wordWrap: { width: 400 },
          }
        ),
        this.add
          .dom(220, 300)
          .createFromHTML(
            '<iframe width="420" height="215" src="https://www.youtube.com/embed/k0TtVQzu3FI" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
          ),
        this.add
          .text(10, 415, "Github", {
            backgroundColor: "darkblue",
            padding: 5,
          })
          .setInteractive({
            cursor: "url(src/assets/images/cursor_over.png), pointer",
          }),
        this.add
          .text(90, 415, "Deploy", {
            backgroundColor: "darkblue",
            padding: 5,
          })
          .setInteractive({
            cursor: "url(src/assets/images/cursor_over.png), pointer",
          }),
        this.add
          .text(this.camera.width - 29, 10, "X", {
            padding: 5,
            fontStyle: "bold",
          })
          .setInteractive({
            cursor: "url(src/assets/images/cursor_over.png), pointer",
          }),
      ])
      .setDepth(3)
      .setVisible(false);
  }
}
