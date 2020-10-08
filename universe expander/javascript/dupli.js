function updateDupli(diff) {
  get("dupliUnl").style.display = saveFile.dupli.unlocked?"none":""
  get("duplitabbtn").style.display = saveFile.dupli.unlocked?"":"none"
  get("dupliAmt").textContent = format(saveFile.dupli.amount)
  get("dupliFood").textContent = format(saveFile.dupli.food)
  get("dfCost").textContent = format(getDFCost())
  get("dupliBoost").innerHTML = getDupliBoostDesc()+"<br>Cost: "+format(getDupliBoostCost())+" Anti-Energy"
  get("dupliBoost").style.display = ((saveFile.dupli.upgrades>=Object.keys(DUPLIBOOST_DESCS).length)&&(saveFile.dupli.upgrades<5&&!saveFile.battery.unlocked)?"none":"")
  get("dupliDescs").innerHTML = getDupliDescs()
  if (saveFile.dupli.food.gt(0) && saveFile.dupli.unlocked) {
    let speed = getDupliSpeed()
    let maxDiff = saveFile.dupli.food.div(speed)
    saveFile.dupli.food = saveFile.dupli.food.sub(OmegaNum.mul(diff, speed).div(getDupliSpendSpeed())).max(0)
    saveFile.dupli.amount = saveFile.dupli.amount.times(OmegaNum.pow(OmegaNum.pow(1.25, speed), maxDiff.min(diff)))
  }
}

function getDupliSpendSpeed() {
  let m = new OmegaNum(1)
  m = m.mul(getAntiUpgEff(24))
  if (saveFile.battery.upgrades[11]) m = m.mul(getBatteryUpgEffect(12, 0))
  return m
}

function getDupliSpeed() {
  let m = new OmegaNum(0.125)
  if (saveFile.antiquarks.upgrades.includes(21)) m = m.add(0.275)
  if (saveFile.battery.upgrades[9]) m = m.mul(getBatteryUpgEffect(10, 0))
  m = m.mul(getDupliEff(7))
  return m
}

const DUPLI_DESCS = {
  0: function() { return "Duplicators make the Anti-Gluon effect "+format(getDupliEff().sub(1).times(100))+"% stronger." },
  1: function() { return "Duplicators multiply Anti-Energy gain by "+format(getDupliEff(1))+"." },
  2: function() { return "Duplicators cheapen Duplicator Food by /"+format(getDupliEff(2))+"." },
  3: function() { return "Duplicators make the Gluon Stretch nerf start "+format(getDupliEff(3))+"x later." },
  4: function() { return "Duplicators multiply Photon gain by "+format(getDupliEff(4))+"x." },
  5: function() { return "Duplicators multiply Anti-Quark gain by "+format(getDupliEff(5))+"x." },
  6: function() { return "Duplicators boost Battery speed by "+format(getDupliEff(6))+"x." },
  7: function() { return "Duplicators boost Duplicator speed by "+format(getDupliEff(7))+"x." },
}

const DUPLIBOOST_DESCS = {
  0: "boost Anti-Energy gain",
  1: "cheapen Duplicator Food",
  2: "make the Gluon Stretch nerf start later",
  3: "boost Photon gain",
  4: "boost Anti-Quark gain",
  5: "boost Battery speed",
  6: "boost Duplicator speed",
}

function getDupliDescs() {
  let html = ""
  for (let i=0;i<=saveFile.dupli.upgrades;i++) {
    html += DUPLI_DESCS[i]()+"<br>"
  }
  return html
}

function unlDupli() {
  if (saveFile.dupli.unlocked) return
  if (saveFile.antiquarks.upgrades.length<16) return
  saveFile.dupli.unlocked = true;
  saveFile.dupli.amount = new OmegaNum(1);
}

function getDupliEff(x=0) {
  if ((!saveFile.dupli.unlocked)||saveFile.dupli.upgrades<x) return new OmegaNum(1)
  let amt = saveFile.dupli.amount
  let ret = "test";
  switch(x) {
    case 0: 
      ret = amt.max(1).log10().sqrt().plus(1)
      if (saveFile.antiquarks.upgrades.includes(17)) ret = amt.max(1).log10().plus(1).pow(1.25).plus(1)
      return ret;
      break;
    case 1: 
      return amt.max(1).log10().plus(1).pow(20)
      break;
    case 2: 
      return amt.max(1).log10().plus(1).log10().plus(1).pow(3)
      break;
    case 3: 
      return amt.max(1).log10().plus(1).pow(2000)
      break;
    case 4: 
      return amt.max(1).log10().plus(1).pow(3)
      break;
    case 5: 
      return amt.max(1).cbrt().plus(1).log10().plus(1)
      break;
    case 6:
      ret = amt.max(1).root(15).plus(1);
      if (ret.gte(1e10)) ret = ret.log10().times(1e9);
      return ret;
      break;
    case 7: 
      return amt.max(1).logBase(2).sqrt().plus(1)
      break;
  }
}

function getDFCost() {
  let food = saveFile.dupli.totalFood
  if (food.gte(150)) food = food.pow(2).div(150);
  if (food.gte(400)) food = food.pow(4).div(Math.pow(400, 3));
  let cost = OmegaNum.pow(2, food.pow(1.4)).times(1e6)
  cost = cost.div(getDupliEff(2))
  cost = cost.div(getAntiUpgEff(18))
  cost = cost.div(getAntiUpgEff(22))
  if (saveFile.battery.upgrades[5]) cost = cost.div(getBatteryUpgEffect(6, 0).add(1))
  return cost
}

function buyDF() {
  if (!saveFile.dupli.unlocked) return
  let cost = getDFCost()
  if (saveFile.antiquarks.energy.lt(cost)) return
  saveFile.antiquarks.energy = saveFile.antiquarks.energy.sub(cost)
  saveFile.dupli.food = saveFile.dupli.food.plus(1)
  saveFile.dupli.totalFood = saveFile.dupli.totalFood.plus(1)
}

function getDupliBoostDesc() {
  let amt = saveFile.dupli.upgrades
  if (!Object.keys(DUPLIBOOST_DESCS).includes(amt.toString())) return "???"
  return "Duplicators "+DUPLIBOOST_DESCS[amt]
}

function getDupliBoostCost() {
  let u = saveFile.dupli.upgrades
  if (!Object.keys(DUPLIBOOST_DESCS).includes(u.toString())) return new OmegaNum(1/0)
  let cost = OmegaNum.pow(10, OmegaNum.pow(u, 2)).times(1e6)
  if (u > 4) cost = cost.root(1/6).div(cost.root(5/6))
  if (u > 5) cost = cost.pow(1.5)
  return cost
}

function newDupliBoost() {
  if (!saveFile.dupli.unlocked) return
  let cost = getDupliBoostCost()
  if (saveFile.antiquarks.energy.lt(cost)) return
  saveFile.antiquarks.energy = saveFile.antiquarks.energy.sub(cost)
  saveFile.dupli.upgrades++
}