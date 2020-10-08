const ANTI_UPG_COSTS = {
  1: new OmegaNum(250),
  2: new OmegaNum(1000),
  3: new OmegaNum(1750),
  4: new OmegaNum(2500),
  5: new OmegaNum(4000),
  6: new OmegaNum(7000),
  7: new OmegaNum(25000),
  8: new OmegaNum(14000),
  9: new OmegaNum(45000),
  10: new OmegaNum(32000),
  11: new OmegaNum(70000),
  12: new OmegaNum(1.2e5),
  13: new OmegaNum(1e5),
  14: new OmegaNum(2e5),
  15: new OmegaNum(4e5),
  16: new OmegaNum(7e5),
  17: new OmegaNum(1e10),
  18: new OmegaNum(4e11),
  19: new OmegaNum(1e12),
  20: new OmegaNum(5e13),
  21: new OmegaNum(2e14),
  22: new OmegaNum(5e15),
  23: new OmegaNum(1e18),
  24: new OmegaNum(1e19),
  25: new OmegaNum(1e20)
}

const ANTI_UPG_TYPES = {
  1: "Qrk",
  2: "Hdr",
  3: "Qrk",
  4: "Qrk",
  5: "Pht",
  6: "Void",
  7: "Pht",
  8: "Qrk",
  9: "Qrk",
  10: "Ann",
  11: "Pht",
  12: "Ann", // this should be prestige or smt, but we don't have css for that heh
  13: "Void",
  14: "Qrk",
  15: "Pht",
  16: "Qrk",
  17: "Dup",
  18: "Void",
  19: "Pht",
  20: "Qrk",
  21: "Dup",
  22: "Pht",
  23: "Void",
  24: "Dup",
  25: "Void"
}

function updateAntiquarks(diff) {
  get("antiquarkUnl").style.display = saveFile.antiquarks.unlocked?"none":""
  get("antiquarkstabbtn").style.display = saveFile.antiquarks.unlocked?"":"none"
  let colors = ["Red","Green","Blue"]
  for (let i=0;i<colors.length;i++) {
    let color = colors[i]
    get("antiquarks"+color).textContent = format(saveFile.antiquarks.colors[i])
    get("antiquarks"+color+"Mult").textContent = format(getAntiquarkEff(i))
    if (saveFile.antiquarks.unlocked) saveFile.antiquarks.colors[i] = saveFile.antiquarks.colors[i].plus(getAntiquarkGain(i).times(diff))
  }
  get("antigluonLength").innerHTML = meterFormat(saveFile.antiquarks.gluon)
  get("antigluonPower").textContent = format(getAntigluonEff())
  get("antienergy").textContent = format(saveFile.antiquarks.energy)
  for (let i=1;i<=25;i++) {
    get("antiUpg"+i).style.display = antiUpgUnl(i)?"":"none"
    get("antiUpg"+i).className = (saveFile.antiquarks.upgrades.includes(i)?"antiEnergyBought"+ANTI_UPG_TYPES[i]:(saveFile.antiquarks.energy.gte(ANTI_UPG_COSTS[i])?"antiEnergyUpg"+ANTI_UPG_TYPES[i]:"antiEnergyLocked"+ANTI_UPG_TYPES[i]))+" antiEnergyUpgBase"
    get("antiUpg"+i+"cost").textContent = format(ANTI_UPG_COSTS[i])
    if (get("antiUpg"+i+"eff")) {get("antiUpg"+i+"eff").textContent = format(getAntiUpgEff(i, true))}
  }
  if (saveFile.antiquarks.unlocked) {
    saveFile.antiquarks.gluon = saveFile.antiquarks.gluon.plus(getAntigluonGain().times(diff))
    saveFile.antiquarks.energy = saveFile.antiquarks.energy.plus(getAntiEnergyGain().times(diff))
  }
}

function getAntiquarkGain(num) {
  let gain = getAntiquarkEff((num+1)%3)
  gain = gain.times(getAntiUpgEff(4))
  if (saveFile.dupli.unlocked && saveFile.dupli.upgrades>=5) gain = gain.times(getDupliEff(5))
  gain = gain.times(getAntiUpgEff(23))
  return gain
}

function getAntiquarkEff(num) {
  let ret = saveFile.antiquarks.colors[num].plus(1).pow(0.1/(num+1));
  if (saveFile.antiquarks.upgrades.includes(3)) ret = ret.pow(2);
  return ret;
}

function unlockAntiquarks() {
  if (saveFile.prestige.depth.lt(60)) return;
  if (saveFile.antiquarks.unlocked) return;
  saveFile.antiquarks.unlocked = true;
}

function getAntigluonGain() {
  let gain = new OmegaNum(0)
  for (let i=0;i<3;i++) {
    gain = gain.plus(saveFile.antiquarks.colors[i].plus(1).log10())
  }
  gain = gain.times(getAntiUpgEff(2))
  gain = gain.times(getAntiUpgEff(7))
  return gain
}

function getAntigluonEff() {
  if (!saveFile.antiquarks.unlocked) return;
  let g = saveFile.antiquarks.gluon
  let eff = g.max(1).pow(0.2)
  if (eff.gte(1e5)) eff = eff.times(1e5).sqrt()
  if (saveFile.dupli.unlocked) eff = eff.times(getDupliEff())
  return eff
}

function getAntiEnergyGain() {
  let gain = new OmegaNum(0);
  for (let i=0;i<3;i++) {
    gain = gain.plus(saveFile.antiquarks.colors[i].plus(1).pow(0.1+i/20))
  }
  gain = gain.times(getAntiUpgEff(1))
  gain = gain.times(getAntiUpgEff(8))
  gain = gain.times(getAntiUpgEff(19))
  gain = gain.times(getAntiUpgEff(20))
  if (saveFile.battery.unlocked) gain = gain.times(getBatteryEnergyPower())
  if (saveFile.dupli.unlocked && saveFile.dupli.upgrades>=1) gain = gain.times(getDupliEff(1))
  return gain
}

function antiUpgUnl(x) {
  switch(x) {
    case 1:
      return true;
      break;
    case 2:
      return saveFile.antiquarks.upgrades.includes(1);
      break;
    case 3:
      return saveFile.antiquarks.upgrades.includes(2);
      break;
    case 4:
      return saveFile.antiquarks.upgrades.includes(2);
      break;
    case 5: 
      return saveFile.antiquarks.upgrades.includes(3) || saveFile.antiquarks.upgrades.includes(4);
      break;
    case 6: 
      return saveFile.antiquarks.upgrades.includes(3) && saveFile.antiquarks.upgrades.includes(4);
      break;
    case 7:
      return saveFile.antiquarks.upgrades.includes(6) && saveFile.antiquarks.upgrades.includes(5);
      break;
    case 8: 
      return saveFile.antiquarks.upgrades.includes(4) && saveFile.antiquarks.upgrades.includes(5);
      break;
    case 9:
      return saveFile.antiquarks.upgrades.includes(5);
      break;
    case 10: 
      return saveFile.antiquarks.upgrades.includes(5) && saveFile.antiquarks.upgrades.includes(8);
      break;
    case 11: 
      return saveFile.antiquarks.upgrades.includes(10) && saveFile.antiquarks.upgrades.includes(6);
      break;
    case 12:
      return saveFile.antiquarks.upgrades.includes(11)
      break;
    case 13:
      return saveFile.antiquarks.upgrades.includes(8)
      break;
    case 14:
      return saveFile.antiquarks.upgrades.includes(12)
      break;
    case 15:
      return saveFile.antiquarks.upgrades.includes(12) && saveFile.antiquarks.upgrades.includes(13) && saveFile.antiquarks.upgrades.includes(9)
      break;
    case 16: 
      return saveFile.antiquarks.upgrades.includes(14) || saveFile.antiquarks.upgrades.includes(15)
      break;
    case 17: 
      return saveFile.dupli.unlocked
      break;
    case 18: 
      return saveFile.antiquarks.upgrades.includes(17)
      break;
    case 19: 
      return saveFile.antiquarks.upgrades.includes(18)
      break;
    case 20: 
      return saveFile.antiquarks.upgrades.includes(19)
      break;
    case 21: 
      return saveFile.antiquarks.upgrades.includes(20)
      break;
    case 22: 
      return saveFile.antiquarks.upgrades.includes(21)
      break;
    case 23: 
      return saveFile.antiquarks.upgrades.includes(22)
      break;
    case 24: 
      return saveFile.antiquarks.upgrades.includes(23)
      break;
    case 25: 
      return saveFile.antiquarks.upgrades.includes(24)
      break;
  }
  return false;
}

function getAntiUpgEff(x, bypass=false) {
  let mod = new OmegaNum(1)
  if (!bypass) if ((!saveFile.antiquarks.unlocked) || !saveFile.antiquarks.upgrades.includes(x)) mod = new OmegaNum(0)
  switch(x) {
    case 1:
      return saveFile.photons.matter.plus(1).log10().sqrt().times(mod).plus(1)
      break;
    case 2:
      return saveFile.hadrons.boosters.plus(1).cbrt().times(mod).plus(1)
      break;
    case 4:
      return saveFile.quarks.colors[0].add(saveFile.quarks.colors[1]).add(saveFile.quarks.colors[2]).add(1).log10().cbrt().add(1).log10().times(mod).plus(1)
      break;
    case 5: 
      return saveFile.photons.colors[5].boosters.plus(1).log10().times(mod).plus(1)
      break;
    case 6: 
      return saveFile.annihilation.voidPower.plus(1).log10().pow(0.6).times(mod).plus(1)
      break;
    case 7: 
      return saveFile.photons.colors[4].amount.sqrt().div(500).plus(1).log10().pow(2).times(mod).plus(1)
      break;
    case 8: 
      return saveFile.antiquarks.gluon.pow(2).max(1).log10().times(mod).plus(1)
      break;
    case 9:
      return saveFile.antiquarks.colors[2].add(1).pow(4).log10().sqrt().times(mod).plus(1)
      break;
    case 10:
      return saveFile.annihilation.energy.plus(1).log10().plus(1).log10().pow(5).times(2).times(mod).plus(1)
      break;
    case 11:
      return OmegaNum.pow(5, saveFile.photons.colors[5].boosters.sqrt()).times(mod).max(1)
      break;
    case 12:
      return saveFile.prestige.depth.times(getPPMult()).times(10).times(mod).max(1)
      break;
    case 13:
      return saveFile.antiquarks.energy.pow(2).times(mod).plus(1)
      break;
    case 14:
      return saveFile.antiquarks.energy.pow(1000).times(mod).plus(1)
      break;
    case 16:
      return OmegaNum.pow(1.1, saveFile.prestige.depth.pow(2)).times(mod).max(1)
      break;
    case 18:
      return saveFile.annihilation.spaceTime.plus(1).log10().plus(1).log10().times(mod).plus(1)
      break;
    case 19:
      return saveFile.photons.colors[5].amount.plus(1).log10().pow(2).times(mod).plus(1)
      break;
    case 20:
      return saveFile.antiquarks.gluon.plus(1).log10().pow(3).times(mod).plus(1)
      break;
    case 22:
      return saveFile.photons.colors[5].amount.plus(1).log10().pow(2).times(mod).plus(1)
      break;
    case 23:
      return getVoidUpgEff(2).add(1).log10().pow(2).times(mod).plus(1)
      break;
    case 24:
      return saveFile.dupli.totalFood.add(1).log10().times(mod).plus(1)
      break;
  }
}

function buyAntiUpg(x) {
  if (!saveFile.antiquarks.unlocked) return
  if (saveFile.antiquarks.upgrades.includes(x)) return
  let cost = ANTI_UPG_COSTS[x]
  if (saveFile.antiquarks.energy.lt(cost)) return
  saveFile.antiquarks.energy = saveFile.antiquarks.energy.sub(cost)
  saveFile.antiquarks.upgrades.push(x)
}