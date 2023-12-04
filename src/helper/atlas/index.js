import atlas4x from "./4x";

const chickenAssets = {
  baseBody: {
    Eggshell: "ChickenDerby_Animation_15",
    Black: "ChickenDerby_Animation_16",
    "Orange Will": "ChickenDerby_Animation_17",
    "Bald Chicken": "ChickenDerby_Animation_18",
    "English Mustard": "ChickenDerby_Animation_19",
    "Joker's Jade": "ChickenDerby_Animation_20",
    "Manic Mint": "ChickenDerby_Animation_21",
    "Screamin Green": "ChickenDerby_Animation_22",
    "Wild Moss": "ChickenDerby_Animation_23",
    Plucked: "ChickenDerby_Animation_24",
    Classic: "ChickenDerby_Animation_25",
    Robot: "ChickenDerby_Animation_26",
    Runic: "ChickenDerby_Animation_27",

    "Cherry Dusk": "ChickenDerby_Animation_28",
    "Shocking Pink": "ChickenDerby_Animation_29",

    "Merah Red": "ChickenDerby_Animation_30",
    Rose: "ChickenDerby_Animation_31",
    Sapphire: "ChickenDerby_Animation_32",

    Istanblue: "ChickenDerby_Animation_33",

    "Purple Wine": "ChickenDerby_Animation_34",

    "Royal Violet": "ChickenDerby_Animation_35",

    "Translucent Purple": "ChickenDerby_Animation_36",
    "Translucent Green": "ChickenDerby_Animation_37",

    "Translucent Yellow": "ChickenDerby_Animation_38",
    "Translucent Red": "ChickenDerby_Animation_39",
  },
  excludes: [
    "ChickenDerby_Animation_10",
    "ChickenDerby_Animation_13",
    "ChickenDerby_Animation_14",
    "ChickenDerby_Animation_71",
    "ChickenDerby_Animation_67",
    "ChickenDerby_Animation_66",
    "ChickenDerby_Animation_65",
    "ChickenDerby_Animation_64",
    "ChickenDerby_Animation_62",
    "ChickenDerby_Animation_61",
    "ChickenDerby_Animation_60",
    "ChickenDerby_Animation_59",
    "ChickenDerby_Animation_58",
    "ChickenDerby_Animation_57",
    "ChickenDerby_Animation_56",
    "ChickenDerby_Animation_53",
    "ChickenDerby_Animation_52",
    "ChickenDerby_Animation_51",
    "ChickenDerby_Animation_48",

    "ChickenDerby_Animation_47",
    "ChickenDerby_Animation_46",

    "ChickenDerby_Animation_43",
    "ChickenDerby_Animation_42",
    "ChickenDerby_Animation_41",
  ],
};

function replaceFilenames(text, basePath) {
  // Create a regular expression pattern to match PNG filenames
  const regex = /([\w.-]+\.png)/g;

  // Replace the PNG filenames with the base path attached
  const updatedText = text.replace(regex, (match) => {
    return basePath + match;
  });

  return updatedText;
}

const getAtlas = (chickens) => {
  console.log(chickens);

  const baseUrl = "/img/4x/spine/";
  let text = replaceFilenames(atlas4x, "/img/4x/spine/");

  // loads only used bodies
  Object.keys(chickenAssets.baseBody).forEach((bodyName) => {
    const texture = chickenAssets.baseBody[bodyName];
    const isUsed = chickens.some((e) => e.info.baseBody === bodyName);
    if (!isUsed) {
      text = text.replace(`${baseUrl}${texture}.png`, `${baseUrl}1x1.png`);
    }
  });
  // exclude (TODO: we can consider it after getting full info for the talents)
  chickenAssets.excludes.forEach((texture) => {
    text = text.replace(`${baseUrl}${texture}.png`, `${baseUrl}1x1.png`);
  });

  const blob = new Blob([text], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  console.log(url);

  return url;
};

export default getAtlas;
