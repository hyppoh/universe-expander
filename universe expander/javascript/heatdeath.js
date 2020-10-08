// placeholder file

function getDepthGoal() {
  let goal = new OmegaNum(100)
  let deaths = saveFile.heat.deaths
  if (deaths.gte(3)) deaths = deaths.pow(2).div(3)
  goal = goal.mul(deaths.add(1).root(5))
  return goal.floor().max(100)
}

function canDie() {
  return saveFile.prestige.depth.gte(getDepthGoal())
}

function heatDeath(force=false) {
  if (!force) {
    if (!canDie()) return
    saveFile.heat.deaths = saveFile.heat.deaths.plus(1);
  }
  let prev = JSON.parse(JSON.stringify(saveFile)) // deep copy
  saveFile.annihilation = getSaveFile().annihilation
  saveFile.photons = getSaveFile().photons
  saveFile.antiquarks = getSaveFile().antiquarks
  saveFile.battery = getSaveFile().battery
  saveFile.dupli = getSaveFile().dupli
  saveFile.hadrons = getSaveFile().hadrons
  saveFile.quarks = getSaveFile().quarks
  saveFile.prestige = getSaveFile().prestige
  if (hasThetaUpg(5)) {
    saveFile.quarks.unlocked = true
    saveFile.hadrons.unlocked = true
  }
  if(hasDeltaUpg(5)) {
    saveFile.battery.unlocked = true
    saveFile.photons.unlocked = true
  }
  if (hasZetaUpg(5)) {
    saveFile.annihilation.upgrades = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]
    saveFile.antiquarks.unlocked = true
    saveFile.prestige.auto = prev.prestige.auto
    saveFile.hadrons.auto = prev.prestige.auto
    saveFile.annihilation.auto = prev.annihilation.auto
    saveFile.annihilation.autoVal = prev.annihilation.autoVal
  }
  if (hasZetaUpg(7)) {
    saveFile.annihilation.voidUnl = true
    saveFile.annihilation.voidUpgs = [4,5,6,7,8,9,10,11,12]
  }
  annihilate(true)
  updateBatteryUpgrades()
}

function getBaseParticleMult(type) {
  let mult = saveFile.heat.deaths
  switch(type) {
    case "theta":
      mult = mult.pow(2).div(50)
      mult = mult.mul(getZetaPEff("theta"))
      return mult
    case "delta":
      mult = mult.pow(1.2).mul(4).sqrt().div(10)
      mult = mult.mul(getThetaBoostersPow())
      mult = mult.mul(getZetaPEff("delta"))
      return mult
    case "zeta":
      mult = mult.pow(2).div(2000)
      mult = mult.mul(getThetaBoostersPow())
      if (hasDeltaUpg(3)) mult = mult.mul(getDeltaUpgEff(3))
      if (hasZetaUpg(2)) mult = mult.mul(getZetaUpgEff(2))
      return mult
    case "zetaP":
      mult = saveFile.heat.zeta.amount
      mult = mult.sqrt()
      if(hasDeltaUpg(2)) mult = saveFile.heat.zeta.amount.pow(0.65).div(2)
      if (hasThetaUpg(1)) mult = mult.mul(getThetaUpgEff(1))
      if (hasZetaUpg(9)) mult = mult.mul(getZetaUpgEff(9))
      return mult
  }
}

function getThetaBoosters() {
  let amount = saveFile.heat.theta.amount.root(8)
  if(hasDeltaUpg(2)) amount = saveFile.heat.theta.amount.root(4).div(1.45).pow(1.1)
  return amount.floor()
}

function getThetaBoostersPow() {
  let amount = getThetaBoosters().add(1)
  amount = amount.pow(1.21)
  return amount
}

let DELTA_UPG_COSTS = {
  1: new OmegaNum(5),
  2: new OmegaNum(50),
  3: new OmegaNum(100),
  4: new OmegaNum(500),
  5: new OmegaNum(1000)
}

function getDeltaUpgEff(x) {
  switch(x) {
    case 1:
      return saveFile.heat.delta.amount.pow(1.54).plus(1)
    case 2:
      return saveFile.heat.zeta.amount.root(2).plus(1)
    case 3:
      return saveFile.heat.theta.amount.root(7).plus(1)
    case 4:
      return saveFile.heat.zeta.amount.root(5).plus(1)
  }
}

function canBuyDeltaUpg(x) {
  return saveFile.heat.delta.amount.gte(DELTA_UPG_COSTS[x])
}

function hasDeltaUpg(x) {
  return saveFile.heat.delta.upgrades.includes(x)
}

function buyDeltaUpg(x) {
  if (hasDeltaUpg(x) || !canBuyDeltaUpg(x)) return;
  saveFile.heat.delta.upgrades.push(x)
  saveFile.heat.delta.amount = saveFile.heat.delta.amount.sub(DELTA_UPG_COSTS[x])
  if (x==5) {
    saveFile.battery.unlocked = true
    saveFile.photons.unlocked = true
  }
}

let THETA_UPG_COSTS = {
  1: new OmegaNum(250),
  2: new OmegaNum(1500),
  3: new OmegaNum(2500),
  4: new OmegaNum(5000),
  5: new OmegaNum(10000)
}

function getThetaUpgEff(x) {
  switch(x) {
    case 1:
      return getThetaBoosters().pow(1.54).plus(1)
    case 4:
      return getThetaBoosters().cbrt().plus(1)
  }
}

function canBuyThetaUpg(x) {
  return saveFile.heat.theta.amount.gte(THETA_UPG_COSTS[x])
}

function hasThetaUpg(x) {
  return saveFile.heat.theta.upgrades.includes(x)
}

function buyThetaUpg(x) {
  if (hasThetaUpg(x) || !canBuyThetaUpg(x)) return;
  saveFile.heat.theta.upgrades.push(x)
  saveFile.heat.theta.amount = saveFile.heat.theta.amount.sub(DELTA_UPG_COSTS[x])
  if (x==5) {
    saveFile.quarks.unlocked = true
    saveFile.hadrons.unlocked = true
  }
}

function getZetaPEff(x) {
  let eff = new OmegaNum(1)
  switch(x) {
    case "theta":
     return saveFile.heat.zeta.power.pow(hasZetaUpg(3)?0.6:0.5).plus(1);
     break;
    case "delta":
     return saveFile.heat.zeta.power.pow(hasZetaUpg(3)?0.5:0.25).plus(1);
     break;
  }
  return eff
}

let ZETA_UPG_COSTS = {
  1: new OmegaNum(25),
  2: new OmegaNum(50),
  3: new OmegaNum(200),
  4: new OmegaNum(1000),
  5: new OmegaNum(2500),
  6: new OmegaNum(1.5e7),
  7: new OmegaNum(5e9),
  8: new OmegaNum(1e11),
  9: new OmegaNum(5e11),
  10: new OmegaNum(1e18),
  11: new OmegaNum(1e21),
  12: new OmegaNum(1e24),
  13: new OmegaNum(1e30),
  14: new OmegaNum(1e33),
  15: new OmegaNum(5e33),
  16: new OmegaNum(1e37)
}

function getZetaUpgEff(x) {
  let eff;
  switch(x) {
    case 1:
      return saveFile.heat.zeta.power.plus(1).pow(0.2)
      break;
    case 2:
      return saveFile.heat.zeta.power.plus(1).pow(0.4)
      break;
    case 6:
      eff = saveFile.heat.zeta.power.plus(1).pow(0.19)
      if (eff.gte(1e5)) eff = eff.log10().times(1e5/5)
      return eff;
      break;
    case 9:
      eff = OmegaNum.pow(1.2, saveFile.prestige.depth)
      if (eff.gte(1e9)) eff = eff.log10().times(1e9/9)
      return eff;
      break;
    case 11:
      return saveFile.heat.zeta.power.plus(1).log10().pow(1.5).plus(1)
      break;
    case 13:
      return saveFile.heat.zeta.power.plus(1).log10().pow(1.5).plus(1)
      break;
    case 14:
      return saveFile.heat.zeta.power.plus(saveFile.heat.theta.amount.mul(100)).plus(saveFile.heat.delta.amount.div(100)).plus(1).pow(1500).plus(1)
      break;
    case 15:
      return getThetaBoosters().root(150).plus(1)
      break;
    case 16:
      return saveFile.heat.deaths.plus(1).pow(3)
      break;
  }
}

function canBuyZetaUpg(x) {
  return saveFile.heat.zeta.amount.gte(ZETA_UPG_COSTS[x])
}

function hasZetaUpg(x) {
  return saveFile.heat.zeta.upgrades.includes(x)
}

function buyZetaUpg(x) {
  if (hasZetaUpg(x) || !canBuyZetaUpg(x)) return;
  saveFile.heat.zeta.upgrades.push(x)
  saveFile.heat.zeta.amount = saveFile.heat.zeta.amount.sub(ZETA_UPG_COSTS[x])
  if (x==5) {
    saveFile.annihilation.upgrades = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]
    saveFile.antiquarks.unlocked = true
  }
  if (x==7) {
    saveFile.annihilation.voidUnl = true
    saveFile.annihilation.voidUpgs = [4,5,6,7,8,9,10,11,12]
  }
}

function toggleAutoVoid() {
  if (hasZetaUpg(7)) saveFile.heat.autoVoid = !saveFile.heat.autoVoid
}

function toggleAutoPhotons() {
  if (hasZetaUpg(10)) saveFile.heat.autoPhotons = !saveFile.heat.autoPhotons
}

function toggleAutoBattery() {
  if (hasZetaUpg(11)) saveFile.heat.autoBattery = !saveFile.heat.autoBattery
}

function updateHeatDeath(diff) {
  get("ch1Tab").style.display = ((canDie()||saveFile.heat.deaths.gte(1))&&!(canDie() && !saveFile.heat.deaths.lt(100)))?"":"none"
  get("ch2Tab").style.display = ((canDie()||saveFile.heat.deaths.gte(1))&&!(canDie() && !saveFile.heat.deaths.lt(100)))?"":"none"
  get("doHeatDeath").innerHTML = (canDie())?"Perform a Heat Death and reset all Chapter 1 progress.":"Perform a Heat Death and reset all Chapter 1 progress at " + format(getDepthGoal()) + " depths."
  get("heatDeaths").innerHTML = format(saveFile.heat.deaths)
  get("thetaAmount").innerHTML = format(saveFile.heat.theta.amount) + " (+" + format(getBaseParticleMult("theta")) + ")/s"
  get("thetaBooster").innerHTML = format(getThetaBoosters())
  get("thetaBoosterMult").innerHTML = format(getThetaBoostersPow()) + "x"
  get("deltaAmount").innerHTML = format(saveFile.heat.delta.amount) + " (+" + format(getBaseParticleMult("delta")) + ")/s"
  get("zetaAmount").innerHTML = format(saveFile.heat.zeta.amount) + " (+" + format(getBaseParticleMult("zeta")) + ")/s"
  get("zetaPower").innerHTML = format(saveFile.heat.zeta.power) + " (+" + format(getBaseParticleMult("zetaP")) + ")/s"
  get("zetaPowerDeltaEff").textContent = format(getZetaPEff("delta"))
  get("zetaPowerThetaEff").textContent = format(getZetaPEff("theta"))
  get("autoVoid").style.display = hasZetaUpg(7)?"":"none"
  get("autoVoid").textContent = "AUTO: "+(saveFile.heat.autoVoid?"ON":"OFF")
  get("autoPhotons").style.display = hasZetaUpg(10)?"":"none"
  get("autoPhotons").textContent = "AUTO: "+(saveFile.heat.autoPhotons?"ON":"OFF")
  get("autoBattery").style.display = hasZetaUpg(12)?"":"none"
  get("autoBattery").textContent = "AUTO: "+(saveFile.heat.autoBattery?"ON":"OFF")
  if (saveFile.heat.deaths.gte(1)) {
    saveFile.heat.theta.amount = saveFile.heat.theta.amount.plus(getBaseParticleMult("theta").times(diff))
    saveFile.heat.delta.amount = saveFile.heat.delta.amount.plus(getBaseParticleMult("delta").times(diff))
    saveFile.heat.zeta.amount = saveFile.heat.zeta.amount.plus(getBaseParticleMult("zeta").times(diff))
    saveFile.heat.zeta.power = saveFile.heat.zeta.power.plus(getBaseParticleMult("zetaP").times(diff))
  }
  for (let i=1;i<=5;i++) {
    get("deltaUpg"+i).className = (hasDeltaUpg(i)?"deltaUpgBought":(canBuyDeltaUpg(i)?"deltaUpg":"deltaUpgLocked"))+" deltaUpgradesBase"
    get("deltaUpg"+i+"cost").textContent = format(DELTA_UPG_COSTS[i])
    if (getDeltaUpgEff(i)) get("deltaUpg"+i+"eff").textContent = format(getDeltaUpgEff(i))
  }
  for (let i=1;i<=5;i++) {
    get("thetaUpg"+i).className = (hasThetaUpg(i)?"thetaUpgBought":(canBuyThetaUpg(i)?"thetaUpg":"thetaUpgLocked"))+" deltaUpgradesBase"
    get("thetaUpg"+i+"cost").textContent = format(THETA_UPG_COSTS[i])
    if (getThetaUpgEff(i)) get("thetaUpg"+i+"eff").textContent = format(getThetaUpgEff(i))
  }
  for (let i=1;i<=16;i++) {
    get("zetaUpg"+i).className = (hasZetaUpg(i)?"zetaUpgBought":(canBuyZetaUpg(i)?"zetaUpg":"zetaUpgLocked"))+" deltaUpgradesBase"
    get("zetaUpg"+i+"cost").textContent = format(ZETA_UPG_COSTS[i])
    if (getZetaUpgEff(i)) get("zetaUpg"+i+"eff").textContent = format(getZetaUpgEff(i))
  }
  if (hasZetaUpg(8)) {
    saveFile.annihilation.energy = saveFile.annihilation.energy.plus(getAnnihilateGain().times(diff))
    saveFile.annihilation.voidPower = saveFile.annihilation.voidPower.plus(getVoidGain().times(diff))
  }
}