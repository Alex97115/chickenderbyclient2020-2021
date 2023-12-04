import "core-js/stable";
import "regenerator-runtime/runtime";
import { cdnBaseUrl } from "../global";

const gameDimension = Utils.getGameDimension();
const gameScale = gameDimension.width / G_WIDTH;

export default class Boot extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    // Fix: Corrected the condition for setting the assetUrl
    if (window.gUrlParams.assets === "cdn") {
      assetUrl = cdnBaseUrl; // Use the correct variable for cdnBaseUrl
    }

    // Load assets of the preload screen
    this.load.image("logo", `${assetUrl}/4x/game/logo.png`);
    this.load.image("preload_bar_bg", `${assetUrl}/4x/game/preload_bar_bg.png`);
  }

  create() {
    Utils.world = {
      width: this.cameras.main.width,
      height: this.cameras.main.height,
      centerX: this.cameras.main.centerX,
      centerY: this.cameras.main.centerY,
    };
    Utils.Lang.updateLanguage("en");
    Utils.text = Utils.Lang.text[Utils.Lang.current];

    let urlParams;
    (window.onpopstate = function () {
      let match,
        pl = /\+/g, // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) {
          return decodeURIComponent(s.replace(pl, " "));
        },
        query = window.location.search.substring(1);

      urlParams = {};
      while ((match = search.exec(query))) urlParams[decode(match[1])] = decode(match[2]);
    })();

    window.gUrlParams = urlParams;

    let baseUrl = BASE_URL_PROD;
    if (ENVIRONMENT === "dev" || urlParams["env"] === "dev") {
      baseUrl = BASE_URL_DEV;
    } else if (ENVIRONMENT === "local" || urlParams["env"] === "local") {
      baseUrl = BASE_URL_LOCAL;
    }

    this.game.isRecorder = !!urlParams["record"];

    // Fix: Handle the API fetch error and display a message
    (async () => {
      try {
        const rawResponse = await fetch(`${baseUrl}/api/race-performances/${urlParams.raceId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (rawResponse.ok) {
          const content = await rawResponse.json();
          gameInfo = content;

          if (gameInfo != null) {
            this.scene.start("Preloader");
          }
        } else {
          throw new Error("Failed to fetch race performance data");
        }
      } catch (error) {
        // Display an error message on fetch failure
        const fontUI = {
          font: "80px " + Utils.text["FONT"],
          fill: "#ffde00",
          stroke: "#fff",
          strokeThickness: 5,
        };

        this.add
          .text(
            (G_WIDTH / 2) * gameScale,
            (G_HEIGHT / 2) * gameScale,
            "Failed to load game data",
            fontUI
          )
          .setOrigin(0.5, 0.5)
          .setScale(gameScale);
      }
    })();
  }
}