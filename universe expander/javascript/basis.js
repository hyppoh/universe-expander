/* Get the basis for stuff. */

function get(get) {
  return document.getElementById(get)
}

function getSaveFile() {
  return {
    size: new OmegaNum(1),
    lastTick: Date.now(),
    autosave: true,
    chapter: "main",
    prestigeRespecConf: true,
    tab: "main",
    achievements: [],
    prestige: {
      points: new OmegaNum(0),
      spent: new OmegaNum(0),
      done: new OmegaNum(0),
      depth: new OmegaNum(0),
      unlockedUpgrades: false,
      upgrades: [new OmegaNum(0),new OmegaNum(0),new OmegaNum(0),new OmegaNum(0),new OmegaNum(0),new OmegaNum(0),new OmegaNum(0),new OmegaNum(0),new OmegaNum(0),new OmegaNum(0),new OmegaNum(0),new OmegaNum(0)],
      auto: false,
    },
    quarks: {
      unlocked: false,
      colors: [new OmegaNum(0),new OmegaNum(0),new OmegaNum(0)],
      gluon: new OmegaNum(1)
    },
    hadrons: {
      unlocked: false,
      hadrons: new OmegaNum(0),
      boosters: new OmegaNum(0),
      auto: false,
    },
    annihilation: {
      energy: new OmegaNum(0),
      upgrades: [],
      auto: false,
      autoVal: "1",
      voidPower: new OmegaNum(0),
      voidUsed: new OmegaNum(0),
      voidUnl: false,
      spaceTime: new OmegaNum(0),
      voidRebuyableUpgs: [new OmegaNum(0), new OmegaNum(0), new OmegaNum(0)],
      voidUpgs: [],
    },
    photons: {
      unlocked: false,
      colors: [
        {amount: new OmegaNum(0), boosters: new OmegaNum(0)},
        {amount: new OmegaNum(0), boosters: new OmegaNum(0)},
        {amount: new OmegaNum(0), boosters: new OmegaNum(0)},
        {amount: new OmegaNum(0), boosters: new OmegaNum(0)},
        {amount: new OmegaNum(0), boosters: new OmegaNum(0)},
        {amount: new OmegaNum(0), boosters: new OmegaNum(0)}
      ],
      matter: new OmegaNum(0)
    },
    antiquarks: {
      unlocked: false,
      colors: [new OmegaNum(0),new OmegaNum(0),new OmegaNum(0)],
      gluon: new OmegaNum(1),
      energy: new OmegaNum(0),
      upgrades: [],
    },
    dupli: {
      unlocked: false,
      amount: new OmegaNum(0),
      food: new OmegaNum(0),
      totalFood: new OmegaNum(0),
      upgrades: 0,
    },
    battery: {
      unlocked: false,
      energy: new OmegaNum(0),
      fluid: new OmegaNum(0),
      upgrades: []
    },
    options: {
      theme: "style",
    },
    heat: {
      deaths: new OmegaNum(0),
      autoVoid: false,
      autoPhotons: false,
      autoBattery: false,
      theta: {
        amount: new OmegaNum(0),
        boosts: new OmegaNum(0),
        upgrades: []
      },
      delta: {
        amount: new OmegaNum(0),
        upgrades: []
      },
      zeta: {
        amount: new OmegaNum(0),
        power: new OmegaNum(0),
        upgrades: []
      }
    },
    neutrinos: {
      unlocked: false,
      challenge: "none",
      challenges: [new OmegaNum(0), new OmegaNum(0), new OmegaNum(0), new OmegaNum(0), new OmegaNum(0), new OmegaNum(0)],
      neutrinos: [
      {amount: new OmegaNum(0), upgrades: [new OmegaNum(0), new OmegaNum(0), new OmegaNum(0), new OmegaNum(0)]},
      {amount: new OmegaNum(0), upgrades: [new OmegaNum(0), new OmegaNum(0), new OmegaNum(0), new OmegaNum(0)]},
      {amount: new OmegaNum(0), upgrades: [new OmegaNum(0), new OmegaNum(0), new OmegaNum(0), new OmegaNum(0)]},
      {amount: new OmegaNum(0), upgrades: [new OmegaNum(0), new OmegaNum(0), new OmegaNum(0), new OmegaNum(0)]},
      {amount: new OmegaNum(0), upgrades: [new OmegaNum(0), new OmegaNum(0), new OmegaNum(0), new OmegaNum(0)]},
      {amount: new OmegaNum(0), upgrades: [new OmegaNum(0), new OmegaNum(0), new OmegaNum(0), new OmegaNum(0)]}],
      boosts: new OmegaNum(0)
    }
  }
}

function transformToON(obj) {
  obj.size = new OmegaNum(obj.size)
  obj.prestige.points = new OmegaNum(obj.prestige.points)
  obj.prestige.depth = new OmegaNum(obj.prestige.depth)
  obj.prestige.spent = new OmegaNum(obj.prestige.spent)
  obj.prestige.done = new OmegaNum(obj.prestige.done)
  for (i in obj.prestige.upgrades) {
    obj.prestige.upgrades[i] = new OmegaNum(obj.prestige.upgrades[i])
  }
  if (obj.quarks) {
    for (i in obj.quarks.colors) {
      obj.quarks.colors[i] = new OmegaNum(obj.quarks.colors[i])
    }
    obj.quarks.gluon = new OmegaNum(obj.quarks.gluon)
  }
  if (obj.hadrons) {
    obj.hadrons.hadrons = new OmegaNum(obj.hadrons.hadrons)
    obj.hadrons.boosters = new OmegaNum(obj.hadrons.boosters)
  }
  if (obj.annihilation!==undefined) {
    obj.annihilation.energy = new OmegaNum(obj.annihilation.energy)
    obj.annihilation.voidPower = new OmegaNum(obj.annihilation.voidPower) 
    obj.annihilation.spaceTime = new OmegaNum(obj.annihilation.spaceTime||0)
    for (i in obj.annihilation.voidRebuyableUpgs) {
      obj.annihilation.voidRebuyableUpgs[i] = new OmegaNum(obj.annihilation.voidRebuyableUpgs[i])
    }
    obj.annihilation.voidUsed = new OmegaNum(obj.annihilation.voidUsed)
  }
  if(obj.photons!==undefined) {
    for (i in obj.photons.colors) {
      obj.photons.colors[i].amount = new OmegaNum(obj.photons.colors[i].amount)
      obj.photons.colors[i].boosters = new OmegaNum(obj.photons.colors[i].boosters)
    }
    obj.photons.matter = new OmegaNum(obj.photons.matter)
  }
  if (obj.antiquarks!==undefined) {
    for (i in obj.antiquarks.colors) {
      obj.antiquarks.colors[i] = new OmegaNum(obj.antiquarks.colors[i])
    }
    obj.antiquarks.gluon = new OmegaNum(obj.antiquarks.gluon)
    obj.antiquarks.energy = new OmegaNum(obj.antiquarks.energy)
  }
  if (obj.dupli!==undefined) {
    obj.dupli.amount = new OmegaNum(obj.dupli.amount)
    obj.dupli.food = new OmegaNum(obj.dupli.food)
    obj.dupli.totalFood = new OmegaNum(obj.dupli.totalFood)
  }
  if (obj.battery!==undefined) {
    obj.battery.energy = new OmegaNum(obj.battery.energy)
    obj.battery.fluid = new OmegaNum(obj.battery.fluid)
    for (var i in obj.battery.upgrades) {
      obj.battery.upgrades[i] = new OmegaNum(obj.battery.upgrades[i])
    }
  }
  if (obj.heat!==undefined) {
    obj.heat.deaths = new OmegaNum(obj.heat.deaths)
    obj.heat.theta.amount = new OmegaNum(obj.heat.theta.amount)
    obj.heat.theta.boosts = new OmegaNum(obj.heat.theta.boosts)
    obj.heat.delta.amount = new OmegaNum(obj.heat.delta.amount)
    obj.heat.zeta.amount = new OmegaNum(obj.heat.zeta.amount)
    obj.heat.zeta.power = new OmegaNum(obj.heat.zeta.power)
  }
  if (obj.neutrinos!== undefined) {
    for (var i in obj.neutrinos.challenges) {
      obj.neutrinos.challenges[i] = new OmegaNum(obj.neutrinos.challenges[i])
    }
    for (var i in obj.neutrinos.neutrinos) {
      obj.neutrinos.neutrinos[i].amount = new OmegaNum(obj.neutrinos.neutrinos[i].amount)
      for (var j in obj.neutrinos.neutrinos[i].upgrades) {
        obj.neutrinos.neutrinos[i].upgrades[j] = new OmegaNum(obj.neutrinos.neutrinos[i].upgrades[j])
      }
    }
    obj.neutrinos.boosts = new OmegaNum(obj.neutrinos.boosts)
  }
  return obj
}

function checkForVars() { // put new variables here whenever defined
  if (saveFile.prestige.unlockedUpgrades === undefined) saveFile.prestige.unlockedUpgrades = false;
  if (saveFile.tab === undefined) saveFile.tab = "main"
  if (saveFile.chapter === undefined) saveFile.chapter = "main"
  if (saveFile.achievements === undefined) saveFile.achievements = []
  if (saveFile.prestige.upgrades[3]===undefined || saveFile.prestige.upgrades[4]===undefined || saveFile.prestige.upgrades[5]===undefined) {
    saveFile.prestige.upgrades[3] = new OmegaNum(0)
    saveFile.prestige.upgrades[4] = new OmegaNum(0)
    saveFile.prestige.upgrades[5] = new OmegaNum(0)
  }
  if (saveFile.prestigeRespecConf===undefined) saveFile.prestigeRespecConf = true;
  if (saveFile.prestige.upgrades[6]===undefined || saveFile.prestige.upgrades[7]===undefined || saveFile.prestige.upgrades[8]===undefined) {
    saveFile.prestige.upgrades[6] = new OmegaNum(0)
    saveFile.prestige.upgrades[7] = new OmegaNum(0)
    saveFile.prestige.upgrades[8] = new OmegaNum(0)
  }
  if (saveFile.prestige.upgrades[9]===undefined || saveFile.prestige.upgrades[10]===undefined || saveFile.prestige.upgrades[11]===undefined) {
    saveFile.prestige.upgrades[9] = new OmegaNum(0)
    saveFile.prestige.upgrades[10] = new OmegaNum(0)
    saveFile.prestige.upgrades[11] = new OmegaNum(0)
  }
  if (saveFile.prestige.auto===undefined) saveFile.prestige.auto = false;
  if (saveFile.hadrons.auto===undefined) saveFile.hadrons.auto = false;
  if (saveFile.prestige.spent===undefined) {
    alert("Because your save is older, you should hard reset in order to fix an issue with respeccing prestige upgrades properly.")
    saveFile.prestige.spent = new OmegaNum(0);
  }
  if (saveFile.prestige.done===undefined||saveFile.prestige.done.isNaN()) saveFile.prestige.done = new OmegaNum(saveFile.prestige.depth)
  if (saveFile.quarks === undefined) {
    saveFile.quarks = {};
    saveFile.quarks.unlocked = false;
    saveFile.quarks["colors"] = [];
    for (let i = 0; i < 3; i++) {
      saveFile.quarks.colors[i] = new OmegaNum(0)
    }
    saveFile.quarks.gluon = new OmegaNum(0)
  } else {
    if (saveFile.quarks.gluon===undefined || saveFile.quarks.gluon.isNaN()) saveFile.quarks.gluon = new OmegaNum(0);
  }
  if(saveFile.hadrons === undefined) {
    saveFile.hadrons = {};
    saveFile.hadrons.unlocked = false;
    saveFile.hadrons.hadrons = new OmegaNum(0);
    saveFile.hadrons.boosters = new OmegaNum(0);
  }
  if (saveFile.autosave === undefined) saveFile.autosave = true;
  if (saveFile.annihilation === undefined) saveFile.annihilation = getSaveFile().annihilation
  if (saveFile.annihilation.voidUnl === undefined) saveFile.annihilation.voidUnl = false
  if (saveFile.annihilation.voidUpgs === undefined) {
    saveFile.annihilation.spaceTime = new OmegaNum(0)
    saveFile.annihilation.voidRebuyableUpgs = [new OmegaNum(0), new OmegaNum(0), new OmegaNum(0)]
    saveFile.annihilation.voidUpgs = []
  }
  if (saveFile.photons === undefined) {
    saveFile.photons = {};
    saveFile.photons.unlocked = false;
    saveFile.photons["colors"] = [];
    for (let i = 0; i < 7; i++) {
      saveFile.photons.colors[i] = {amount: new OmegaNum(0), boosters: new OmegaNum(0)}
    }
    saveFile.photons.matter = new OmegaNum(0)
  } else {
    if (saveFile.photons.matter===undefined || saveFile.photons.matter.isNaN()) saveFile.photons.matter = new OmegaNum(0);
  }
  if (saveFile.annihilation.auto === undefined) saveFile.annihilation.auto = false
  if (saveFile.annihilation.autoVal === undefined) saveFile.annihilation.autoVal = "1"
  if (saveFile.annihilation.voidUsed === undefined||saveFile.annihilation.voidUsed.isNaN()) saveFile.annihilation.voidUsed = new OmegaNum(0)
  if (saveFile.antiquarks === undefined) {
    saveFile.antiquarks = getSaveFile().antiquarks
  }
  if (saveFile.dupli === undefined) saveFile.dupli = getSaveFile().dupli
  if (saveFile.dupli.totalFood === undefined) saveFile.dupli.totalFood = new OmegaNum(0)
  if (saveFile.dupli.upgrades instanceof Array) saveFile.dupli.upgrades = 0
  if (saveFile.options === undefined) saveFile.options = getSaveFile().options
  if (saveFile.battery === undefined) saveFile.battery = getSaveFile().battery
  if (saveFile.heat === undefined) saveFile.heat = getSaveFile().heat
  if (saveFile.heat.theta.upgrades === undefined) saveFile.heat.theta.upgrades = getSaveFile().heat.theta.upgrades
  if (saveFile.heat.zeta.upgrades === undefined) saveFile.heat.zeta.upgrades = getSaveFile().heat.zeta.upgrades
  if (saveFile.heat.autoVoid === undefined) saveFile.heat.autoVoid = false
  if (saveFile.heat.autoPhotons === undefined) saveFile.heat.autoPhotons = false
  if (saveFile.heat.autoBattery === undefined) saveFile.heat.autoBattery = false
  if (saveFile.neutrinos === undefined) {
      saveFile.neutrinos = {
        unlocked: false,
        challenges: [new OmegaNum(0), new OmegaNum(0), new OmegaNum(0), new OmegaNum(0), new OmegaNum(0), new OmegaNum(0)],
        neutrinos: [
        {amount: new OmegaNum(0), upgrades: [new OmegaNum(0), new OmegaNum(0), new OmegaNum(0), new OmegaNum(0)]},
        {amount: new OmegaNum(0), upgrades: [new OmegaNum(0), new OmegaNum(0), new OmegaNum(0), new OmegaNum(0)]},
        {amount: new OmegaNum(0), upgrades: [new OmegaNum(0), new OmegaNum(0), new OmegaNum(0), new OmegaNum(0)]},
        {amount: new OmegaNum(0), upgrades: [new OmegaNum(0), new OmegaNum(0), new OmegaNum(0), new OmegaNum(0)]},
        {amount: new OmegaNum(0), upgrades: [new OmegaNum(0), new OmegaNum(0), new OmegaNum(0), new OmegaNum(0)]},
        {amount: new OmegaNum(0), upgrades: [new OmegaNum(0), new OmegaNum(0), new OmegaNum(0), new OmegaNum(0)]}],
        boosts: new OmegaNum(0)
      }
  }
  if (saveFile.neutrinos.challenge === false) saveFile.neutrinos.challenge = "none"
  if (saveFile.neutrinos.unlocked === undefined) saveFile.neutrinos.unlocked = false
}

function meterFormat(number) {
  let numbah = new OmegaNum(number)
  if (numbah.lt(0.001)) return 0 + " m";
  if (numbah.sqrt().lt(1e3)) {
    return numbah.sqrt().toStringWithDecimalPlaces(3) + " m"
  } else if (numbah.sqrt().lt(1e6)) {
    return numbah.sqrt().div(1e3).toStringWithDecimalPlaces(3) + " km"
  } else if (numbah.sqrt().lt(1e9)) {
    return numbah.sqrt().div(1e6).toStringWithDecimalPlaces(3) + " Mm"
  } else if (numbah.sqrt().lt(1e12)) {
    return numbah.sqrt().div(1e9).toStringWithDecimalPlaces(3) + " Gm"
  } else if (numbah.sqrt().lt(9.461e15)) {
    return numbah.sqrt().div(1e12).toStringWithDecimalPlaces(3) + " Tm"
  } else if (numbah.sqrt().lt(4.4e26)) {
    return numbah.sqrt().div(9.461e15).toStringWithDecimalPlaces(3) + " ly"
  } else if (numbah.sqrt().sqrt().lt(4.4e26)) {
    return numbah.sqrt().div(4.4e26).toStringWithDecimalPlaces(3) + " uni"
  } else {
    return OmegaNum.pow(10, numbah.sqrt().log10().mod(Math.log10(4.4e26))).toStringWithDecimalPlaces(3) + " uni<sup>" + (numbah.sqrt().logBase(4.4e26).floor()).toStringWithDecimalPlaces(3) + "</sup>"
  }
}

function format(number) {
  let numbah = new OmegaNum(number)
  if (numbah.lt(0.001)) return 0;
  return numbah.toStringWithDecimalPlaces(3)
}

function load() {
  saveFile = getSaveFile()
  if(localStorage.getItem('universeExpandSave') !== undefined && localStorage.getItem('universeExpandSave') !== null) saveFile = transformToON(JSON.parse(localStorage.getItem('universeExpandSave')));
  checkForVars()
  saveFile.tab = "main"
  if (saveFile.quarks.unlocked && saveFile.quarks.gluon.lt(1)) saveFile.quarks.gluon = new OmegaNum(1);
  if (saveFile.battery.unlocked) updateBatteryUpgrades()
}

function save() {
  localStorage.setItem('universeExpandSave', JSON.stringify(saveFile));
}

function hardReset() {
  if (!confirm("Are you sure you want to reset everything? You won't be able to undo this!")) return;
  saveFile = getSaveFile();
  changeTheme(true);
  save();
}

function toggleAutosave() {
  saveFile.autosave = !saveFile.autosave
}

function exportSave() {
  let str = btoa(JSON.stringify(saveFile))
  
  const el = document.createElement("textarea");
	el.value = str;
	document.body.appendChild(el);
	el.select();
  el.setSelectionRange(0, 99999);
	document.execCommand("copy");
	document.body.removeChild(el);
}

function importSave() {
  let sav = prompt("Paste your save data here")
  if (sav=="" || sav===undefined || sav===null) return
  saveFile = transformToON(JSON.parse(atob(sav)))
  save();
  load();
}

function showTab(name) {
  saveFile.tab = name
}

let metaTabStart = {
  "main": "main",
  "ch2": "heatDeath"
}

function showMetaTab(name) {
  saveFile.chapter = name
  showTab(metaTabStart[name])
}