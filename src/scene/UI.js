import { cdnBaseUrl, localBaseUrl } from "../global";
const gameDimension = Utils.getGameDimension();
const gameScale = gameDimension.width / G_WIDTH;
const assetScale = Math.floor(gameScale * 4) + "x";

const CHICK_NAME_FONT_SIZE = 24;
const CHICH_NAME_X = 70;
const ACTION_BTN_SIZE = 86;
const ACTION_BTN_PADDING = 10;
const RIGHT_PADDING = 20;
const DISTANCE_BAR_WIDTH = 687;

const LOAD_IMAGE_EVENT_PREFIX = "filecomplete-image-";
const PLACEHOLDER_NAME = "placeholder";

const SPEED_OPTIONS = [
  {
    speedFactor: 1,
    topIcon: "x1_icon",
    bottomIcon: "play_icon",
  },
  {
    speedFactor: 1.2,
    topIcon: "x1.2_icon",
    bottomIcon: "play_speedup_icon",
  },
  {
    speedFactor: 1.5,
    topIcon: "x1.5_icon",
    bottomIcon: "play_speedup_icon_2",
  },
  {
    speedFactor: 2,
    topIcon: "x2_icon",
    bottomIcon: "play_speedup_icon_2",
  },
];

export default class UI extends Phaser.Scene {
  constructor() {
    super("UI");
  }

  loadAssets() {
    const uiAssets = [
      ["chat_panel", `${assetUrl}/4x/ui/chat_panel.png`],

      ["feather0", `${assetUrl}/4x/game/feather1.png`],
      ["feather1", `${assetUrl}/4x/game/feather2.png`],
      ["feather2", `${assetUrl}/4x/game/feather3.png`],

      ["eye", `${assetUrl}/${assetScale}/ui/cock-eye.png`],

      ["chat_divide_line", `${assetUrl}/4x/ui/chat_divide_line.png`],
      ["chat_panel", `${assetUrl}/4x/ui/chat_panel.png`],

      // New UI Elements
      [
        "location_name_panel",
        `${assetUrl}/${assetScale}/ui/location_name_panel.png`,
      ],
      ["prize_bg", `${assetUrl}/${assetScale}/ui/prize_bg.png`],
      [
        "main_chicken_name_panel",
        `${assetUrl}/${assetScale}/ui/main_chicken_name_panel.png`,
      ],
      [
        "secondary_chicken_name_panel",
        `${assetUrl}/${assetScale}/ui/secondary_chicken_name_panel.png`,
      ],
      ["distance_panel", `${assetUrl}/${assetScale}/ui/distance_panel.png`],

      ["distance_bar", `${assetUrl}/${assetScale}/ui/distance_bar.png`],
      [
        "distance_bar_frame",
        `${assetUrl}/${assetScale}/ui/distance_bar_frame.png`,
      ],
      ["start", `${assetUrl}/${assetScale}/ui/start.png`],
      ["goal", `${assetUrl}/${assetScale}/ui/goal.png`],
      ["btn_panel", `${assetUrl}/${assetScale}/ui/btn_panel.png`],
      ["btn_play", `${assetUrl}/${assetScale}/ui/btn_play.png`],
      ["btn_pause", `${assetUrl}/${assetScale}/ui/btn_pause.png`],
      ["btn_sound_on", `${assetUrl}/${assetScale}/ui/btn_sound_on.png`],
      ["btn_sound_off", `${assetUrl}/${assetScale}/ui/btn_sound_off.png`],
      ["btn_zoom_in", `${assetUrl}/${assetScale}/ui/btn_zoom_in.png`],
      ["btn_zoom_out", `${assetUrl}/${assetScale}/ui/btn_zoom_out.png`],
      ["btn_reply", `${assetUrl}/${assetScale}/ui/btn_reply.png`],

      // TODO: rename to keep consistency!
      ["x1_icon", `${assetUrl}/${assetScale}/ui/x1_icon.png`],
      ["x1.2_icon", `${assetUrl}/${assetScale}/ui/x1.2_icon.png`],
      ["x1.5_icon", `${assetUrl}/${assetScale}/ui/x1.5_icon.png`],
      ["x2_icon", `${assetUrl}/${assetScale}/ui/x2_icon.png`],
      ["play_icon", `${assetUrl}/${assetScale}/ui/play_icon.png`],
      [
        "play_speedup_icon",
        `${assetUrl}/${assetScale}/ui/play_speedup_icon.png`,
      ],
      [
        "play_speedup_icon_2",
        `${assetUrl}/${assetScale}/ui/play_speedup_icon_2.png`,
      ],

      ["eth_icon", `${assetUrl}/${assetScale}/ui/eth_icon.png`],
      // ["timer", `${assetUrl}/${assetScale}/ui/timer.png`],
    ];

    uiAssets.forEach(([name, path]) => {
      this.load.image(name, path);
      // this.load.on(`filecomplete-image-${name}`, this.addImage, this);
    });
    this.load.start();
  }

  addImage(key, _file) {
    console.log(key);
  }

  create() {
    this.loadAssets();
    this.mainScene = this.game.scene.getScene("Main");
    this.raceCommentaries = this.mainScene.commentaries?.raceCommentaries;
    this.counter = this.mainScene.raceStats.minimumStartDelay;
    this.isAutoFollowing = true;
    this.totalTime = gameInfo.chickens.reduce((res, e) => {
      const lastSegment = e.segments[e.segments.length - 1];
      return Math.max(res, lastSegment.cumulativeSegmentSize);
    }, 1);

    this.createEffects();
    this.createUI1();
    this.createUI2();
    this.createGoLabel();
    this.createLeaderboard();
    this.createReplayLabel();

    if (this.raceCommentaries) {
      this.createChatPanel();
    }

    this.createDistanceLayout();
    this.createFullScreenControlPanel();

    this.speedIndex = 0; // for SPEED_OPTIONS
  }

  // ai chat ui
  createChatPanel() {
    const uiScale = gameScale;
    const textScale = gameScale;
    this.chatContainer = this.add
      .container()
      .setPosition(25 * uiScale, G_HEIGHT * uiScale - 140 * uiScale);
    // const chatPanel = this.add.image(0, 0, "chat_panel").setOrigin(0, 1).setScale(1.5, 1);

    this.chatContentContainer = this.add.container();
    this.messsageHeight = 34;
    const chatInitialOffset = -68 + this.messsageHeight * 2;
    this.conversationContainer = [];
    this.raceCommentaries.forEach((conv, i) => {
      this.conversationContainer[i] = this.add
        .container()
        .setPosition(
          0,
          (chatInitialOffset + i * this.messsageHeight * 2) * uiScale
        );

      this.conversationContainer[i].children = [];
      conv.msgList.forEach((message, j) => {
        const messageContainer = this.add
          .container()
          .setPosition(0, j * this.messsageHeight * uiScale)
          .setVisible(false)
          .setAlpha(0);

        const msgName = this.add
          .text(10 * uiScale, -2 * uiScale, message.who + ":", {
            font: "20px " + Utils.text["FONT"],
            fill: message.who === "Tom" ? "#36d6c6" : "#f6ff00",
            stroke: "#000",
            strokeThickness: 4,
          })
          .setOrigin(0, 0)
          .setScrollFactor(0)
          .setScale(textScale);
        messageContainer.add(msgName);
        messageContainer.who = msgName;
        const msgContent = this.add
          .text(90 * uiScale, 0, message.msg, {
            font: "18px " + Utils.text["FONT"],
            fill: "#fff",
            stroke: "#000",
            strokeThickness: 3,
          })
          .setOrigin(0, 0)
          .setScrollFactor(0)
          .setScale(textScale);
        messageContainer.add(msgContent);
        messageContainer.msg = msgContent;
        if (i !== 0 || j !== 0) {
          // const chatDevideLine = this.add
          //   .image(0, -4 * uiScale, "chat_divide_line")
          //   .setOrigin(0, 1);
          // messageContainer.add(chatDevideLine);
          // messageContainer.sep = chatDevideLine;
        }

        this.conversationContainer[i].add(messageContainer);
        this.conversationContainer[i].children.push(messageContainer);
      });

      this.chatContentContainer.add(this.conversationContainer[i]);
    });

    // this.chatContainer.add(chatPanel);
    this.chatContainer.add(this.chatContentContainer);

    this.conversationIndex = 0;

    this.message0Tween = [];
    this.message1Tween = [];
  }

  // update ai chat content
  setChatContent(index) {
    const duration = 300;
    const delay = 500;

    if (this.scrollUpTween0) {
      this.scrollUpTween0.remove();
    }
    if (this.scrollUpTween1) {
      this.scrollUpTween1.remove();
    }

    this.scrollUpTween0 = this.tweens.add({
      targets: this.chatContentContainer,
      y:
        -(index + 1) * this.messsageHeight * 2 * gameScale +
        this.messsageHeight * gameScale,
      duration: duration,
      yoyo: false,
    });

    this.scrollUpTween1 = this.tweens.add({
      targets: this.chatContentContainer,
      y: -(index + 1) * this.messsageHeight * 2 * gameScale,
      duration: duration,
      delay: delay,
      yoyo: false,
    });

    this.conversationContainer.forEach((conv, i) => {
      const [msg0, msg1] = conv.children;

      if (this.message0Tween[i]) {
        this.message0Tween[i].remove();
        this.message1Tween[i].remove();
      }

      if (i === index) {
        msg1.setVisible(true);
        msg0.setVisible(true);

        this.message0Tween[i] = this.tweens.add({
          targets: msg0,
          alpha: 1,
          duration: duration / 2,
          delay: duration,
          yoyo: false,
        });

        this.message1Tween[i] = this.tweens.add({
          targets: msg1,
          alpha: 1,
          duration: duration / 2,
          delay: duration + delay,
          yoyo: false,
        });
      } else if (i + 2 === index) {
        this.message0Tween[i] = this.tweens.add({
          targets: msg0,
          alpha: 0,
          duration: duration / 2,
          yoyo: false,
          onComplete: () => {
            msg0.setVisible(false);
          },
        });

        this.message1Tween[i] = this.tweens.add({
          targets: msg1,
          alpha: 0,
          duration: duration / 2,
          delay: delay,
          yoyo: false,
          onComplete: () => {
            msg1.setVisible(false);
          },
        });
      } else if (i + 1 === index) {
        this.message0Tween[i] = this.tweens.add({
          targets: msg0,
          alpha: 0.4,
          duration: duration / 2,
          yoyo: false,
        });

        this.message1Tween[i] = this.tweens.add({
          targets: msg1,
          alpha: 0.4,
          duration: duration / 2,
          delay: delay,
          yoyo: false,
        });
      } else if (i + 2 < index) {
        conv.setVisible(false);
      }
    });
  }

  createEffects() {
    // Freeze effect for Talent - snapshot
    this.frostContainer = this.add.container().setVisible(false).setAlpha(0);
    const frostLeftTop = this.add
      .image(0, 0, "frost")
      .setOrigin(0)
      .setFlip(true, true);
    const frostLeftBottom = this.add
      .image(0, gameDimension.height, "frost")
      .setOrigin(0, 1)
      .setFlip(true, false);
    const frostRightBottom = this.add
      .image(gameDimension.width, gameDimension.height, "frost")
      .setOrigin(1, 1)
      .setFlip(false, false);
    const frostRightTop = this.add
      .image(gameDimension.width, 0, "frost")
      .setOrigin(1, 0)
      .setFlip(false, true);
    this.frostContainer.add(frostLeftTop);
    this.frostContainer.add(frostLeftBottom);
    this.frostContainer.add(frostRightBottom);
    this.frostContainer.add(frostRightTop);
    this.frostContainer.setVisible(false);
  }

  createUI1() {
    const uiScale = gameScale;
    const textScale = gameScale > 0.5 ? gameScale : 0.65;

    this.leftPanel = this.add.container(0, 10 * gameScale);

    const name = this.add
      .text(60 * uiScale, 22 * uiScale, this.mainScene.raceStats.name, {
        font: "22px " + Utils.text["FONT"],
        fill: "#FFF",
        stroke: "#000",
        strokeThickness: 2,
      })
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(2)
      .setScale(textScale);

    const location = this.add
      .text(60 * uiScale, 75 * uiScale, this.mainScene.raceStats.location, {
        font: "26px " + Utils.text["FONT"],
        fill: "#fff",
        stroke: "#000",
        strokeThickness: 2,
      })
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(2)
      .setScale(textScale);

    const leftPanelLength = Math.max(
      name.x + name.width * uiScale,
      location.x + location.width * uiScale
    );
    this.leftPanel.setX(-leftPanelLength - 350 * gameScale);
    this.rightPanel = this.add.container(0, 10 * gameScale);

    const locationPanelTexture = "location_name_panel";
    this.load.on(`${LOAD_IMAGE_EVENT_PREFIX}${locationPanelTexture}`, () => {
      const leftPanelCenter = this.add
        .sprite(-10, 60 * uiScale, locationPanelTexture)
        .setOrigin(0, 0.5)
        .setScrollFactor(0)
        .setDepth(0);
      this.leftPanel.add(leftPanelCenter);
      this.leftPanel.add(name);
      this.leftPanel.add(location);
    });
  }

  createUI2() {
    const uiScale = gameScale;
    const btnScale = gameScale > 0.5 ? 1 : 1.2;
    const isNotIOS = !Utils.isIOSDevice();

    const buttonX = G_WIDTH - ACTION_BTN_SIZE / 2 - RIGHT_PADDING;
    const btnOffsetY =
      (ACTION_BTN_SIZE + ACTION_BTN_PADDING) * uiScale * btnScale;

    const btnBgTexture = "btn_panel";

    const btnPlayPosition = [
      buttonX * uiScale,
      (20 + ACTION_BTN_SIZE / 2) * uiScale,
    ];
    const btnMusicPosition = [
      buttonX * uiScale,
      btnPlayPosition[1] + btnOffsetY,
    ];
    const btnFullScreenPostion = [
      buttonX * uiScale,
      btnMusicPosition[1] + btnOffsetY,
    ];
    const btnSpeedY = isNotIOS ? btnFullScreenPostion[1] : btnMusicPosition[0];
    const btnSpeedPosition = [buttonX * uiScale, btnSpeedY + btnOffsetY];

    // btn bg
    this.load.on(`${LOAD_IMAGE_EVENT_PREFIX}${btnBgTexture}`, () => {
      const btnPlayBg = this.add
        .image(...btnPlayPosition, btnBgTexture)
        .setInteractive({ cursor: "pointer" })
        .setScrollFactor(0)
        .setScale(btnScale)
        .on("pointerup", () => {
          this.onPlayRace();
        });

      const btnMusic = this.add
        .image(...btnMusicPosition, btnBgTexture)
        .setInteractive({ cursor: "pointer" })
        .setScrollFactor(0)
        .setScale(btnScale)
        .on("pointerup", () => {
          gameMusicOn = !gameMusicOn;
          this.onMusic();
        });

      const btnFullScreen = this.add
        .image(...btnFullScreenPostion, btnBgTexture)
        .setInteractive({ cursor: "pointer" })
        .setScrollFactor(0)
        .setVisible(isNotIOS)
        .setScale(btnScale)
        .on("pointerup", () => {
          this.onFullScreen();
        });

      const btnSpeedBg = this.add
        .image(...btnSpeedPosition, btnBgTexture)
        .setScale(btnScale)
        .setInteractive({ cursor: "pointer" })
        .setScrollFactor(0)
        .on("pointerup", () => {
          this.speedIndex = (this.speedIndex + 1) % SPEED_OPTIONS.length;
          this.mainScene.speedFactor =
            SPEED_OPTIONS[this.speedIndex].speedFactor;
          this.speedIcons.forEach((icons, i) => {
            icons.forEach((icon) => {
              icon.setVisible(i === this.speedIndex);
            });
          });
        });
    });

    // play icon
    const btnPlayTexture = "btn_play";
    this.load.on(`${LOAD_IMAGE_EVENT_PREFIX}${btnPlayTexture}`, () => {
      this.btnPlay = this.add
        .image(...btnPlayPosition, btnPlayTexture)
        .setScrollFactor(0)
        .setVisible(false)
        .setScale(btnScale);
    });

    const btnPauseTexture = "btn_pause";
    this.load.on(`${LOAD_IMAGE_EVENT_PREFIX}${btnPauseTexture}`, () => {
      this.btnPause = this.add
        .image(...btnPlayPosition, btnPauseTexture)
        .setScrollFactor(0)
        .setScale(btnScale);
    });

    /* mute icon */
    const btnMusicOnTexture = "btn_sound_on";
    this.load.on(`${LOAD_IMAGE_EVENT_PREFIX}${btnMusicOnTexture}`, () => {
      this.musicon = this.add
        .image(...btnMusicPosition, btnMusicOnTexture)
        .setScrollFactor(0)
        .setVisible(false)
        .setScale(btnScale);
    });
    const btnMusicOffTexture = "btn_sound_off";
    this.load.on(`${LOAD_IMAGE_EVENT_PREFIX}${btnMusicOffTexture}`, () => {
      this.musicoff = this.add
        .image(...btnMusicPosition, btnMusicOffTexture)
        .setScrollFactor(0)
        .setScale(btnScale);
    });

    // fullscreen icon
    const btnFullscreenOnTexture = "btn_zoom_in";
    this.load.on(`${LOAD_IMAGE_EVENT_PREFIX}${btnFullscreenOnTexture}`, () => {
      this.btnFullScreenOn = this.add
        .image(...btnFullScreenPostion, btnFullscreenOnTexture)
        .setScrollFactor(0)
        .setVisible(isNotIOS)
        .setScale(btnScale);
    });
    const btnFullscreenOffTexture = "btn_zoom_out";
    this.load.on(`${LOAD_IMAGE_EVENT_PREFIX}${btnFullscreenOffTexture}`, () => {
      this.btnFullScreenOff = this.add
        .image(...btnFullScreenPostion, btnFullscreenOffTexture)
        .setScrollFactor(0)
        .setVisible(false)
        .setScale(btnScale);
    });

    /* speed icon */
    this.speedIcons = [];
    SPEED_OPTIONS.map((option, i) => {
      this.speedIcons.push([]);
      this.load.on(`${LOAD_IMAGE_EVENT_PREFIX}${option.topIcon}`, () => {
        const topIcon = this.add
          .image(
            btnSpeedPosition[0],
            btnSpeedPosition[1] - 12 * uiScale,
            option.topIcon
          )
          .setScrollFactor(0)
          .setVisible(!i);
        this.speedIcons[i][0] = topIcon;
      });

      this.load.on(`${LOAD_IMAGE_EVENT_PREFIX}${option.bottomIcon}`, () => {
        const bottomIcon = this.add
          .image(
            btnSpeedPosition[0],
            btnSpeedPosition[1] + 15 * uiScale,
            option.bottomIcon
          )
          .setScrollFactor(0)
          .setVisible(!i);
        this.speedIcons[i][1] = bottomIcon;
      });
    });

    const prizePanelScale = uiScale > 0.5 ? 1 : 1.3;
    const prizePanel = this.add.container(
      (buttonX - ACTION_BTN_SIZE / 2 - 20) * uiScale,
      10
    );

    const prizeBgTexture = "prize_bg";
    this.load.on(`${LOAD_IMAGE_EVENT_PREFIX}${prizeBgTexture}`, () => {
      const prizeBg = this.add
        .sprite(0, 0, prizeBgTexture)
        .setOrigin(1, 0)
        .setScrollFactor(0)
        .setScale(prizePanelScale);
      prizePanel.add(prizeBg);
    });

    const ethIconTexture = "eth_icon";
    this.load.on(`${LOAD_IMAGE_EVENT_PREFIX}${ethIconTexture}`, () => {
      const ethIcon = this.add
        .sprite(
          -40 * uiScale * prizePanelScale,
          10 * uiScale * prizePanelScale,
          ethIconTexture
        )
        .setOrigin(1, 0)
        .setScale(prizePanelScale)
        .setScrollFactor(0);
      prizePanel.add(ethIcon);

      const textScale = gameScale > 0.5 ? gameScale : 0.65;
      const txtPrice = this.add
        .text(
          ethIcon.x -
            ethIcon.width * prizePanelScale -
            20 * uiScale * prizePanelScale,
          10 * uiScale * prizePanelScale,
          `${this.mainScene.raceStats.prizePoolUSD.toFixed(2)}`,
          { font: "40px " + Utils.text["FONT"], fill: "#FFF" }
        )
        .setOrigin(1, 0)
        .setScrollFactor(0)
        .setScale(textScale);

      const txtPriceComment = this.add
        .text(
          -30 * uiScale * prizePanelScale,
          ethIcon.y + (ethIcon.height + 5 * uiScale) * prizePanelScale,
          "Total prize pool",
          {
            font: "24px " + Utils.text["FONT"],
            fill: "#fff",
            stroke: "#000",
            strokeThickness: 2,
          }
        )
        .setOrigin(1, 0)
        .setScrollFactor(0)
        .setScale(textScale);

      prizePanel.add(txtPrice);
      prizePanel.add(txtPriceComment);
    });

    if (this.sound.locked) {
      gameMusicOn = false;
      this.onMusic();
    }

    this.input.on("gameobjectup", (pointer, gameObject) => {
      if (
        this.leaderboardItems.find((o) => o === gameObject) &&
        this.sortedChickens
      ) {
        const index = this.leaderboardItems.findIndex((o) => o === gameObject);
        const focusedId = this.sortedChickens[index].id;
        this.mainScene.toggleCamera(focusedId);
      }
    });

    if (Utils.isMobile()) {
      this.input.on("pointerdown", () => {
        this.mainScene.chickens.forEach((chicken) => chicken.hideInfo(this));
      });
    }

    this.onMusic();
  }

  setPositionOfFullScreenControlPanel() {
    if (this.isVisibleFullScreenControl === false) {
      return false;
    }

    const elements = document.getElementsByTagName("canvas");

    if (!elements || elements.length === 0) {
      return false;
    }

    const screenWidth = screen.width;
    const screenHeight = screen.height;

    const fullScreenControlPanel = document.getElementById(
      "fullScreenControlPanel"
    );
    fullScreenControlPanel.style.left = `${
      (screenWidth - elements[0].offsetWidth) / 2 + 3
    }px`;
    fullScreenControlPanel.style.top = `${
      (screenHeight - elements[0].offsetHeight) / 2 + 3
    }px`;

    const isMobile = Utils.isMobile();
    const isIOS = Utils.isIOSDevice();

    if (!isMobile || isIOS) {
      return false;
    }

    fullScreenControlPanel.style.display = "block";

    return true;
  }

  createFullScreenControlPanel() {
    const result = this.setPositionOfFullScreenControlPanel();

    if (!result) {
      return;
    }

    this.isVisibleFullScreenControl = true;
    const expandFullPanel = document.getElementById("expandFullPanel");
    expandFullPanel.addEventListener("click", () => {
      this.onFullScreen();
    });

    const hideFullPanel = document.getElementById("hideFullPanel");
    hideFullPanel.addEventListener("click", () => {
      const fullScreenControlPanel = document.getElementById(
        "fullScreenControlPanel"
      );
      fullScreenControlPanel.style.display = "none";

      this.isVisibleFullScreenControl = false;
    });

    window.addEventListener("orientationchange", () => {
      setTimeout(() => {
        this.setPositionOfFullScreenControlPanel();
      }, 50);
    });
  }

  createLeaderboard() {
    const uiScale = Math.max(0.65, gameScale);
    this.leaderboard = this.add
      .container(-300 * uiScale, 180 * gameScale)
      .setScrollFactor(0)
      .setAlpha(0)
      .setScale(uiScale);

    this.nameLabels = [];
    this.nameLines = [];
    const font = {
      font: CHICK_NAME_FONT_SIZE + "px " + Utils.text["FONT"],
      fill: "#FFF",
      stroke: "#000",
      strokeThickness: 2,
    };

    this.leaderboardItems = [];

    const panelScale = gameScale > 0.5 ? 1 : 2;

    for (let i = 0; i < this.mainScene.chickens.length; i++) {
      const y = 25 + i * 50 + (i >= 3 ? i + 2 : i);
      if (i < 3) {
        this.leaderboardItems[i] = this.make
          .sprite({ x: 25, y: y, key: PLACEHOLDER_NAME }) // main_chicken_name_panel
          .setOrigin(0, 0.5)
          .setInteractive({ cursor: "pointer" })
          .setScale(panelScale);
        this.leaderboard.add(this.leaderboardItems[i]);

        font["strokeThickness"] = 1;
        this.leaderboard.add(
          this.make
            .text({ x: 40, y: y, text: `${i + 1}.`, style: font })
            .setOrigin(0, 0.5)
        );
        this.nameLabels[i] = this.make
          .text({
            x: CHICH_NAME_X,
            y: y,
            text: Utils.getName(this.mainScene.chickens[i].info),
            style: font,
          })
          .setOrigin(0, 0.5);
        this.leaderboard.add(this.nameLabels[i]);
        this.nameLines[i] = this.add
          .line(
            this.nameLabels[i].width / 2,
            this.nameLabels[i].height / 2,
            CHICH_NAME_X,
            y,
            CHICH_NAME_X + this.nameLabels[i].width,
            y
          )
          .setStrokeStyle(1, 0xffffff);
        this.leaderboard.add(this.nameLines[i]);
      } else {
        font["strokeThickness"] = 2;
        this.leaderboardItems[i] = this.make
          .sprite({ x: 25, y: y, key: PLACEHOLDER_NAME }) // secondary_chicken_name_panel
          .setOrigin(0, 0.5)
          .setInteractive({ cursor: "pointer" })
          .setScale(panelScale);
        this.leaderboard.add(this.leaderboardItems[i]);

        const number = this.make
          .text({ x: 40, y: y, text: `${i + 1}.`, style: font })
          .setOrigin(0, 0.5);
        this.leaderboard.add(number);

        this.nameLabels[i] = this.make
          .text({
            x: CHICH_NAME_X,
            y: y,
            text: Utils.getName(this.mainScene.chickens[i].info),
            style: font,
          })
          .setOrigin(0, 0.5);
        this.leaderboard.add(this.nameLabels[i]);
      }
    }

    this.eye = this.make
      .sprite({ x: 228, y: 0, key: PLACEHOLDER_NAME })
      .setOrigin(0, 0)
      .setScale(1 / uiScale)
      .setVisible(false);
    // lazy loading
    const eyeTexture = "eye";
    this.load.on(`${LOAD_IMAGE_EVENT_PREFIX}${eyeTexture}`, () => {
      this.eye.setTexture(eyeTexture);
    });
    this.leaderboard.add(this.eye);

    // lazy loading
    const mainChickenNamePanelTexture = "main_chicken_name_panel";
    this.load.on(
      `${LOAD_IMAGE_EVENT_PREFIX}${mainChickenNamePanelTexture}`,
      () => {
        for (let i = 0; i < 3; i++) {
          this.leaderboardItems[i].setTexture(mainChickenNamePanelTexture);
        }
      }
    );
    const secondaryChickenNamePanelTexture = "secondary_chicken_name_panel";
    this.load.on(
      `${LOAD_IMAGE_EVENT_PREFIX}${secondaryChickenNamePanelTexture}`,
      () => {
        for (let i = 3; i < this.mainScene.chickens.length; i++) {
          this.leaderboardItems[i].setTexture(secondaryChickenNamePanelTexture);
        }
      }
    );
  }

  fadeInFrost(fadeIn) {
    if (fadeIn && !this.frostContainer.isFrozn) {
      this.tweens.add(
        {
          targets: this.frostContainer,
          alpha: 1,
          delay: 1000 / this.mainScene.currentSpeedFactor(),
          duration: 1000 / this.mainScene.currentSpeedFactor(),
        },
        this
      );
      this.frostContainer.isFrozn = true;
      this.frostContainer.setVisible(true);
    } else if (!fadeIn && this.frostContainer.isFrozn) {
      this.tweens.add(
        {
          targets: this.frostContainer,
          alpha: 0,
          duration: 3000 / this.mainScene.currentSpeedFactor(),
          onComplete: () => {
            this.frostContainer.setVisible(false);
          },
        },
        this
      );
      this.frostContainer.isFrozn = false;
    }
  }

  showLeaderboard() {
    this.tweens.add({
      targets: [this.leaderboard, this.leftPanel],
      alpha: 1,
      x: 0,
      delay: 4000 / this.mainScene.currentSpeedFactor(),
      ease: "Cubic", // 'Cubic', 'Elastic', 'Bounce', 'Back'
      duration: 1000 / this.mainScene.currentSpeedFactor(),
      repeat: 0, // -1: infinity
      yoyo: false,
      onComplete: () => {
        this.mainScene.hasLeaderboard = true;
      },
    });
  }

  hideLeaderboard() {
    this.tweens.add({
      targets: this.leaderboard,
      alpha: 0,
      x: -300,
      ease: "Cubic", // 'Cubic', 'Elastic', 'Bounce', 'Back'
      duration: 1000 / this.mainScene.currentSpeedFactor(),
      repeat: 0, // -1: infinity
      yoyo: false,
      onComplete: () => {
        this.mainScene.hasLeaderboard = false;
      },
    });
  }
  createGoLabel() {
    const fontCounter = {
      font: "150px " + Utils.text["FONT"],
      fill: "#ffde00",
      stroke: "#000",
      strokeThickness: 5,
    };
    const txtCounter = this.add
      .text(
        (G_WIDTH / 2) * gameScale,
        (G_HEIGHT / 2) * gameScale,
        this.counter,
        fontCounter
      )
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setScale(gameScale);
    this.playCountown();
    this.tweenCounter = this.tweens.add({
      targets: txtCounter,
      alpha: 0,
      scale: 2 * gameScale,
      duration: 800 / this.mainScene.currentSpeedFactor(),
      ease: "Linear",
      loop: this.counter,
      onLoop: () => {
        this.counter--;
        if (this.counter == 0) {
          txtCounter.text = "Go!";
        } else {
          txtCounter.text = this.counter;
          if (this.counter === 2) {
            this.mainScene.chickens.forEach((c) => {
              if (c.info.bonusBawk) {
                c.playAnimation("Bonus_Bawk", false);
              }
            });
          }
        }
      },
      onComplete: () => {
        txtCounter.destroy();
        this.showLeaderboard();
        this.run();
      },
    });
  }

  createReplayLabel() {
    const font = {
      font: "70px " + Utils.text["FONT"],
      fill: "#ffde00",
      stroke: "#000",
      strokeThickness: 5,
    };
    this.replayLabel = this.add
      .text(
        (G_WIDTH - 70) * gameScale,
        (G_HEIGHT - 60) * gameScale,
        "REPLAY ",
        font
      )
      .setFontStyle("italic")
      .setOrigin(1, 1)
      .setScrollFactor(0)
      .setAlpha(0)
      .setScale(gameScale);
  }

  createDistanceLayout() {
    const uiScale = gameScale;
    const textScale = Math.max(0.65, gameScale);

    this.distancePanel = this.add.container(
      (G_WIDTH * gameScale) / 2,
      (G_HEIGHT - 40) * gameScale
    );

    const distanceBackground = this.add
      .sprite(0, 0, PLACEHOLDER_NAME) // distance_panel
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0);

    // lazy loading
    const distancePanelTexture = "distance_panel";
    this.load.on(`${LOAD_IMAGE_EVENT_PREFIX}${distancePanelTexture}`, () => {
      distanceBackground.setTexture(distancePanelTexture);
    });

    let fontUI = {
      font: "36px " + Utils.text["FONT"],
      fill: "#FFF",
      stroke: "#000",
      strokeThickness: 2,
    };
    const peckingOrderText = this.add
      .text(0, 0, gameInfo.raceStats.peckingOrder, fontUI)
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setScale(uiScale);

    const terrainText = this.add
      .text(
        peckingOrderText.x - peckingOrderText.width / 2 - 20 * uiScale,
        0,
        gameInfo.raceStats.terrain.name,
        fontUI
      )
      .setOrigin(1, 0.5)
      .setScrollFactor(0)
      .setScale(uiScale);

    const distanceText = this.add
      .text(
        peckingOrderText.x + peckingOrderText.width / 2 + 20 * uiScale,
        0,
        gameInfo.raceStats.distance + "m",
        fontUI
      )
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setScale(uiScale);

    const distanceBarFrame = this.add
      .sprite(0, -40 * uiScale, PLACEHOLDER_NAME)
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0);
    // lazy loading
    const distanceBarFrameTexture = "distance_bar_frame";
    this.load.on(`${LOAD_IMAGE_EVENT_PREFIX}${distanceBarFrameTexture}`, () => {
      distanceBarFrame.setTexture(distanceBarFrameTexture);

      this.startBtn.setPosition(
        (-1 * distanceBarFrame.width) / 2 - 35 * uiScale,
        -40 * uiScale
      );
      this.goalBtn.setPosition(
        distanceBarFrame.width / 2 + 25 * uiScale,
        -40 * uiScale
      );
    });

    this.distanceBar = this.add
      .sprite(0, -40 * uiScale, PLACEHOLDER_NAME)
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0);
    // lazy loading
    const distanceBarTexture = "distance_bar";
    this.load.on(`${LOAD_IMAGE_EVENT_PREFIX}${distanceBarTexture}`, () => {
      this.distanceBar.setTexture(distanceBarTexture);
      this.distanceBarMaskGraphics = this.make.graphics();
      this.distanceBarMaskGraphics.fillStyle(0xffffff);
      this.distanceBarCalValues = {
        x: (-1 * this.distanceBar.width) / 2 + this.distancePanel.x,
        y: -50 + this.distancePanel.y,
      };
      this.distanceBarMaskGraphics.fillRect(
        this.distanceBarCalValues.x,
        this.distanceBarCalValues.y,
        0,
        50
      );
      const distanceBarMask = new Phaser.Display.Masks.BitmapMask(
        this,
        this.distanceBarMaskGraphics
      );
      this.distanceBar.setMask(distanceBarMask);
    });

    this.startBtn = this.add
      .sprite(0, 0, PLACEHOLDER_NAME)
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0);

    // lazy loading
    const startBtnTexture = "start";
    this.load.on(`${LOAD_IMAGE_EVENT_PREFIX}${startBtnTexture}`, () => {
      this.startBtn.setTexture(startBtnTexture);
    });

    this.goalBtn = this.add
      .sprite(0, 0, PLACEHOLDER_NAME)
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0);
    // lazy loading
    const goalBtnTexture = "goal";
    this.load.on(`${LOAD_IMAGE_EVENT_PREFIX}${goalBtnTexture}`, () => {
      this.goalBtn.setTexture(goalBtnTexture);
    });

    fontUI = {
      font: "26px " + Utils.text["FONT"],
      fill: "#FFF",
      stroke: "#000",
      strokeThickness: 2,
    };
    this.txtTime = this.add
      .text(0, -70 * uiScale, "00:00:00", fontUI)
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setScale(textScale);

    this.distancePanel.add(distanceBackground);
    this.distancePanel.add(terrainText);
    this.distancePanel.add(peckingOrderText);
    this.distancePanel.add(distanceText);
    this.distancePanel.add(distanceBarFrame);
    this.distancePanel.add(this.distanceBar);

    this.distancePanel.add(this.startBtn);
    this.distancePanel.add(this.goalBtn);
    this.distancePanel.add(this.txtTime);
  }

  onMusic() {
    if (this.musicon && this.musicoff) {
      this.musicon.visible = gameMusicOn;
      this.musicoff.visible = !gameMusicOn;
      Howler.mute(!gameMusicOn);
    }
  }

  onPlayRace() {
    this.mainScene.isPlaying = !this.mainScene.isPlaying;

    if (this.mainScene.isPlaying) {
      this.btnPlay.setVisible(false);
      this.btnPause.setVisible(true);
    } else {
      this.btnPlay.setVisible(true);
      this.btnPause.setVisible(false);
    }
  }

  onSFX() {
    this.sfxon.visible = sfxIsOn;
    this.sfxoff.visible = !sfxIsOn;
  }

  onFullScreen() {
    const { isFullscreen } = this.scale;
    this.btnFullScreenOn.visible = isFullscreen;
    this.btnFullScreenOff.visible = !isFullscreen;

    if (isFullscreen) {
      this.scale.stopFullscreen();
    } else {
      this.scale.startFullscreen();
    }
  }

  playCountown() {
    // this.sound.play("sfx_countdown", {volume: 0.5});
    playSound("sfx_countdown", 0.5, false);
  }

  playMusic() {
    // this.sound.play("grass_intro");
    // const music = this.sound.add('grass_intro', {volume: 0.5});
    // music.on('complete', () => {
    //     this.bgm = this.sound.add("grass_bgm", {volume: 0.5});
    //     this.bgm.play({loop:true});
    // });
    // music.play();

    const sound = playSound("grass_intro", 0.5, false);
    sound.on("end", () => {
      this.bgm = playSound("grass_bgm", 0.5, true);
    });
  }

  run() {
    this.mainScene.run();
    this.playMusic();
  }

  updateRank(elapsedFrame) {
    this.sortedChickens = this.mainScene.chickens
      .map((c) => ({
        id: c.info.id,
        x: c.x,
        name: Utils.getName(c.info),
      }))
      .sort((c1, c2) => c2.x - c1.x);

    if (elapsedFrame % G_FPS == 0) {
      this.sortedChickens.forEach(({ name }, i) => {
        this.nameLabels[i].text = name;
        // this.nameLabels[i].setFontSize(name.length < 18 ? 18 : 16);
        this.nameLabels[i].setFontSize(CHICK_NAME_FONT_SIZE);

        if (this.nameLines[i]) {
          const scale = this.nameLabels[i].width / this.nameLines[i].width;
          this.nameLines[i].setScale(scale, 1);
        }
      });
      if (elapsedFrame > (this.mainScene.firstArrivalTime - 5) * G_FPS) {
        this.hideLeaderboard();
      }
    }

    if (!this.mainScene.isReplay) {
      const isAutoFollowing = this.mainScene.focusedId === undefined;

      const hasCk47 =
        this.mainScene.ck47Chicken &&
        this.mainScene.ck47Chicken.visible &&
        this.mainScene.ck47Chicken.originalChicken;

      const firstChickenId =
        hasCk47 && this.mainScene.ck47Chicken.x > this.sortedChickens[0].x
          ? this.mainScene.ck47Chicken.originalChicken.info.id
          : this.sortedChickens[0].id;

      const focusedId = isAutoFollowing
        ? firstChickenId
        : this.mainScene.focusedId;

      const followingClone =
        hasCk47 &&
        this.mainScene.ck47Chicken.originalChicken.info.id === focusedId;

      const focusedChicken = followingClone
        ? this.mainScene.ck47Chicken
        : this.mainScene.chickens.find((c) => c.info.id === focusedId);
      const focusedIndex = this.sortedChickens.findIndex(
        (c) => c.id === focusedId
      );

      if (
        !followingClone !== !this.followingClone ||
        this.currentFollowingId !== focusedId ||
        isAutoFollowing !== this.isAutoFollowing
      ) {
        const scrollX = this.mainScene.cameras.main.scrollX;
        this.mainScene.cameras.main.stopFollow();

        if (
          this.isAutoFollowing &&
          isAutoFollowing &&
          !followingClone === !this.followingClone
        ) {
          this.mainScene.cameras.main.startFollow(
            focusedChicken,
            true,
            1,
            1,
            isAutoFollowing ? 600 * gameScale : 0,
            0
          );
        } else {
          if (this.counter) {
            this.counter.remove();
            this.counter = undefined;
          }
          this.counter = this.tweens.addCounter({
            targets: this.mainScene.cameras.main,
            from: 0,
            to: 1,
            duration: 500 / this.mainScene.currentSpeedFactor(),
            ease: "Quad.easeInOut",
            onUpdate: (tween) => {
              const value = tween.getValue();
              const midX = !isAutoFollowing
                ? (focusedChicken.x - gameDimension.width / 2 - scrollX) *
                    value +
                  scrollX
                : (focusedChicken.x -
                    gameDimension.width / 2 -
                    600 * gameScale -
                    scrollX) *
                    value +
                  scrollX;
              this.mainScene.cameras.main.scrollX = midX;
            },
            onComplete: () => {
              this.mainScene.cameras.main.startFollow(
                focusedChicken,
                true,
                1,
                1,
                isAutoFollowing ? 600 * gameScale : 0,
                0
              );
            },
          });
        }

        this.followingClone = followingClone;
        this.currentFollowingId = focusedId;
        this.isAutoFollowing = isAutoFollowing;
      }

      this.eye
        .setY(34 * focusedIndex + 15)
        .setVisible(this.mainScene.focusedId !== undefined);
    } else {
      this.replayLabel.alpha = Math.floor(this.mainScene.elapsedFrame / 5) % 2;
    }
  }

  updateTime(elapsedFrame) {
    const elapsedTime = elapsedFrame / G_FPS;
    const sec = Math.floor(elapsedTime);
    const min = Math.floor(sec / 60);
    this.txtTime.text =
      Utils.zeroPad(min, 2) +
      ":" +
      Utils.zeroPad(sec % 60, 2) +
      ":" +
      Utils.zeroPad(Math.floor((elapsedFrame % G_FPS) * 2), 2);

    // distance bar
    if (this.distanceBarMaskGraphics) {
      const percent = elapsedTime / this.totalTime;
      this.distanceBarMaskGraphics.clear();
      this.distanceBarMaskGraphics.fillStyle(0xffffff);
      this.distanceBarMaskGraphics.fillRect(
        this.distanceBarCalValues.x,
        this.distanceBarCalValues.y,
        this.distanceBar.width * percent,
        50
      );
    }

    // update ai chat
    if (
      !this.mainScene.isReplay &&
      this.raceCommentaries &&
      this.raceCommentaries[this.conversationIndex] &&
      this.raceCommentaries[this.conversationIndex].time.elapsed < elapsedTime
    ) {
      this.setChatContent(this.conversationIndex);
      this.conversationIndex++;
    }
  }
}
