import profile_picture from "../assets/images/profile_picture.png";
import show_project from "../assets/images/show_project.png";
import cursor_default from "../assets/images/cursor_default.png";

export default class Menu extends Phaser.Scene {
  preload() {
    this.load.image("profile_picture", profile_picture);
    this.load.image("show_project", show_project);
  }
  create() {
    this.input.setDefaultCursor("url(" + cursor_default + "), pointer");

    this.width = this.game.config.width * 2;
    this.height = this.game.config.height * 2;

    //BACKGROUND DO MENU
    this.add.rectangle(0, 0, this.width, this.height, 0xe0a354, 0.8);

    this.add.text(40, 40, "Welcome my portfolio", {
      wordWrap: { width: 220 },
      fontSize: 28,
      shadow: { color: "black", offsetX: -1.2, fill: true, stroke: true },
      fontStyle: "bold",
    });

    //ADD BOTÃO DE START
    this.startBtn = this.add
      .text(40, 110, "Start", {
        backgroundColor: "brown",
        padding: 10,
        shadow: { color: "black", offsetX: -1.2, fill: true, stroke: true },
      })
      .setInteractive({
        cursor: "url(src/assets/images/cursor_over.png), pointer",
      });

    //ADD BOTÃO TUTORIAL
    this.tutorialBtn = this.add
      .text(40, 160, "Tutorial", {
        backgroundColor: "brown",
        padding: 10,
        shadow: { color: "black", offsetX: -1.2, fill: true, stroke: true },
      })
      .setInteractive({
        cursor: "url(src/assets/images/cursor_over.png), pointer",
      });

    //ADD BOTÃO ABOUT ME
    this.aboutMeBtn = this.add
      .text(40, 210, "About me", {
        backgroundColor: "brown",
        padding: 10,
        shadow: { color: "black", offsetX: -1.2, fill: true, stroke: true },
      })
      .setInteractive({
        cursor: "url(src/assets/images/cursor_over.png), pointer",
      });

    //TEXTO DO TUTORIAL
    this.tutorialText = this.add
      .group([
        this.add.text(190, 110, "ESC = Menu"),
        this.add.text(190, 130, "↑ → ↓ ← = Movimento"),
        this.add.text(190, 155, "M = Mapa"),
        this.add.image(196, 183, "show_project"),
        this.add.text(
          210,
          175,
          "= Pisar em cima mostra a descrição do projeto",
          { wordWrap: { width: 300 } }
        ),
      ])
      .setVisible(false);

    this.aboutMeText = this.add
      .group([
        this.add
          .image(this.game.config.width - 95, 100, "profile_picture")
          .setDisplaySize(120, 120),
        this.add.text(this.game.config.width - 164, 150, "Web Developer", {
          backgroundColor: "black",
          padding: 8,
        }),
        this.add
          .text(this.game.config.width - 91, 190, "Github", {
            backgroundColor: "darkblue",
            padding: 5,
          })
          .setInteractive({
            cursor: "url(src/assets/images/cursor_over.png), pointer",
          }),
        this.add
          .text(this.game.config.width - 101, 223, "LinkdIn", {
            backgroundColor: "darkblue",
            padding: 5,
          })
          .setInteractive({
            cursor: "url(src/assets/images/cursor_over.png), pointer",
          }),
      ])
      .setVisible(false);

    this.startBtn.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.scene.setVisible(false);
      this.startBtn.disableInteractive();
      this.tutorialBtn.disableInteractive();
      this.aboutMeBtn.disableInteractive();
      this.tutorialText.setVisible(false);
      this.aboutMeText.setVisible(false);
      this.input.setDefaultCursor(
        "url(src/assets/images/cursor_default.png), pointer"
      );
    });

    this.tutorialBtn.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.tutorialText.setVisible(true);
      this.aboutMeText.setVisible(false);
    });

    this.aboutMeBtn.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.aboutMeText.setVisible(true);
      this.tutorialText.setVisible(false);
    });
    this.aboutMeText.children
      .getArray()[2]
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        window.open("https://github.com/lucasinmanuel", "_blank");
      });

    this.aboutMeText.children
      .getArray()[3]
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        window.open("https://www.linkedin.com/in/lucasinmanuel/", "_blank");
      });

    this.input.keyboard.on("keydown", (e) => {
      if (e.key === "Escape") {
        this.scene.setVisible(true);
        this.startBtn.setInteractive();
        this.tutorialBtn.setInteractive();
        this.aboutMeBtn.setInteractive();
      }
    });
  }
}
