var saveFile;

load()

function getFreePrestigeUpgs() {
  let x = new OmegaNum(0)
  if (hasVoidUpg(7)) x = x.plus(getUnreVoidUpgEff(4))
  return x
}

function getPrestigeUpgradeEffect(num) {
  let x;
  switch (num) {
    case 1:
      return saveFile.prestige.upgrades[0].plus(getFreePrestigeUpgs()).times(PU1Each())
      break; 
    case 2:
      return saveFile.prestige.upgrades[1].plus(getFreePrestigeUpgs()).plus(hasAnnihilationUpg(10) ? annihilateUpgEff(10) : 0).div(5).add(1)
      break;
    case 3:
      return saveFile.prestige.upgrades[2].plus(getFreePrestigeUpgs()).add(getPrestigeUpgradeEffect(9)).add(1).pow(0.05)
      break;
    case 4:
      return OmegaNum.pow(1.1, saveFile.prestige.upgrades[3].plus(getFreePrestigeUpgs()))
      break;
    case 5:
      return OmegaNum.pow(1.5, saveFile.prestige.upgrades[4].plus(getFreePrestigeUpgs()))
      break;
    case 6: 
      return OmegaNum.mul(0.2, saveFile.prestige.upgrades[5].plus(getFreePrestigeUpgs()).sqrt()).plus(1)
      break;
    case 7:
      return saveFile.hadrons.hadrons.plus(1).log10().plus(1).pow(saveFile.prestige.upgrades[6].plus(getFreePrestigeUpgs()).sqrt()).sqrt()
      break;
    case 8:
      x = saveFile.hadrons.boosters
      if (x.gte(45)) x = x.cbrt().times(OmegaNum.pow(45, 2/3)).div(2).plus(2.5)
      return x.plus(1).plus(1).pow(saveFile.prestige.upgrades[7].plus(getFreePrestigeUpgs()).sqrt()).sqrt()
      break;
    case 9:
      x = saveFile.prestige.upgrades[8].plus(getFreePrestigeUpgs())
      if (x.gte(5)) x = x.cbrt().times(OmegaNum.pow(5, 2/3)).div(2).plus(2.5)
      return saveFile.quarks.colors[0].plus(1).log10().plus(1).pow(x.sqrt()).sub(1)
      break;
    case 10:
      x = saveFile.prestige.upgrades[9].plus(getFreePrestigeUpgs())
      if (x.gte(5)) x = x.cbrt().times(OmegaNum.pow(5, 2/3)).div(2).plus(2.5)
      return saveFile.quarks.colors[1].plus(1).log10().plus(1).pow(x.pow(0.2))
      break;
    case 11:
      x = saveFile.prestige.upgrades[10].plus(getFreePrestigeUpgs())
      if (x.gte(5)) x = x.cbrt().times(OmegaNum.pow(5, 2/3)).div(2).plus(2.5)
      return saveFile.quarks.colors[2].plus(1).logBase(200).plus(1).pow(x.div(10))
      break;
    case 12: 
      x = saveFile.prestige.upgrades[11].plus(getFreePrestigeUpgs())
      if (x.gte(5)) x = x.cbrt().times(OmegaNum.pow(5, 2/3)).div(2).plus(2.5)
      return saveFile.quarks.gluon.plus(1).log10().plus(1).log10().div(25).times(x)
      break;
  }
}

function getPrestigeUpgradeDesc(num) {
  let eff = getPrestigeUpgradeEffect(num);
  switch(num) {
    case 1:
      return "-"+format(eff)
      break;
    case 2:
      return "x"+format(eff)
      break;
    case 3:
      return "^"+format(eff)
      break;
    case 4:
      return "x"+format(eff)
      break;
    case 5:
      return "x"+format(eff)
      break;
    case 6: 
      return "^"+format(eff)
      break;
    case 7:
      return "x"+format(eff)
      break;
    case 8:
      return "x"+format(eff)
      break;
    case 9:
      return "+"+format(eff)
      break;
    case 10:
      return "x"+format(eff)
      break;
    case 11:
      return "^"+format(eff)
      break;
    case 12:
      return "+"+format(eff)
      break;
  }
}

function unlockQuarks() {
  if (saveFile.quarks.unlocked) return;
  if (saveFile.prestige.depth.lt(8)) return;
  saveFile.quarks.unlocked = true;
}

function getQuarkMult(num) {
  let eff = new OmegaNum(1)
  if(num>0) eff = eff.add(saveFile.quarks.colors[num-1].add(1).log10().pow(2))
  else if(num==0) eff = eff.add(saveFile.quarks.colors[2].add(1).log10().pow(2))
  eff = eff.pow(getBoosterPower())
  eff = eff.root(1 + (num/0.05))
  eff = eff.mul(getPrestigeUpgradeEffect(4))
  if (hasAnnihilationUpg(7)) eff = eff.mul(annihilateUpgEff(7))
  eff = eff.mul(getVoidUpgEff(2))
  if (hasDeltaUpg(4)) eff = eff.times(getDeltaUpgEff(4))
  return eff.div(10)
}

function getGluonGain() {
  var gluonGain = new OmegaNum(0);
  for (var i in saveFile.quarks.colors) {
      gluonGain = gluonGain.add(saveFile.quarks.colors[i].add(1).log10().div(i+1/3).pow(2))
  }
  gluonGain = gluonGain.mul(getPrestigeUpgradeEffect(5))
  gluonGain = gluonGain.mul(getPrestigeUpgradeEffect(7))
  if (hasAnnihilationUpg(4)) gluonGain = gluonGain.mul(10);
  if (hasVoidUpg(6)) gluonGain = gluonGain.mul(getUnreVoidUpgEff(3))
  if (saveFile.photons.unlocked) gluonGain = gluonGain.times(getPhotonEff(4))
  if (hasDeltaUpg(2)) gluonGain = gluonGain.times(getDeltaUpgEff(2))
  return gluonGain;
}

function getGluonReducStart() {
  let start = new OmegaNum("1e2000")
  if (saveFile.dupli.unlocked) start = start.times(getDupliEff(3))
  return start
}

function getGluonReduc() {
  let start = getGluonReducStart();
  let reduc = getGluonEff(true).div(start).max(1).root(4)
  if (reduc.gte(start.sqrt())) reduc = reduc.pow(2).div(start.sqrt())
  if (reduc.gte(start)) reduc = reduc.pow(1.75).div(start.pow(0.75))
  if (saveFile.antiquarks.unlocked) reduc = reduc.div(getAntiUpgEff(16))
  return reduc.max(1)
}

function getGluonEff(base=false) {
  let eff = saveFile.quarks.gluon.plus(1).logBase(2).cbrt().plus(1)
  eff = eff.times(getPrestigeUpgradeEffect(10))
  eff = eff.pow(getPrestigeUpgradeEffect(6))
  eff = eff.pow(getBoosterPower())
  if (!base) if (eff.gte(getGluonReducStart())) eff = eff.div(getGluonReduc())
  return eff;
}

function getHadronPow() {
  let eff = saveFile.hadrons.hadrons.add(1).logBase(15).cbrt().plus(1)
  if (hasAnnihilationUpg(6)) eff = eff.add(annihilateUpgEff(6))
  return eff;
}

function unlockHadrons() {
    if (saveFile.quarks.gluon.lt(10000)) return;
    saveFile.hadrons.unlocked = true
}

function getHadronGain() {
  var hadronGain = new OmegaNum(0);
  hadronGain = hadronGain.add(saveFile.quarks.gluon.add(1).pow(0.01))
  hadronGain = hadronGain.mul(saveFile.prestige.depth.div(4))
  hadronGain = hadronGain.mul(getPrestigeUpgradeEffect(7))
  hadronGain = hadronGain.pow(getPrestigeUpgradeEffect(11))
  if (hasAnnihilationUpg(4)) hadronGain = hadronGain.mul(10);
  hadronGain = hadronGain.mul(getVoidUpgEff(3))
  if (hasDeltaUpg(3)) hadronGain = hadronGain.mul(getDeltaUpgEff(3))
  return hadronGain;
}

function getBoosterCost() {
  let cost = new OmegaNum(125)
  let boosters = saveFile.hadrons.boosters
  if (boosters.gte(12)) boosters = boosters.pow(2).div(12)
  if (boosters.gte(2000)) boosters = OmegaNum.pow(1.01, boosters.sub(2000)).times(2000)
  cost = cost.pow(boosters.add(1).sqrt())
  return cost.pow(getBoosterCostExp());
}

function getBoosterCostExp() {
  let exp = new OmegaNum(1)
  if (hasAnnihilationUpg(18)) exp = exp.sub(0.2)
  if (hasVoidUpg(4)) exp = exp.div(1.05)
  return exp
}

function getBoosterPower() {
  let pow = saveFile.hadrons.boosters.plus(hasAnnihilationUpg(15) ? annihilateUpgEff(15) : 0).plus(hasVoidUpg(5) ? getUnreVoidUpgEff(2) : 0).add(1).pow(0.5)
  if (hasAnnihilationUpg(2)) pow = pow.mul(annihilateUpgEff(2));
  if (pow.gte(8.5)) pow = pow.sqrt().times(Math.sqrt(8.5))
  return pow
}

function buyBooster() {
  if (saveFile.hadrons.hadrons.lt(getBoosterCost())) return;
  saveFile.hadrons.hadrons = saveFile.hadrons.hadrons.sub(getBoosterCost())
  saveFile.hadrons.boosters = saveFile.hadrons.boosters.plus(1)
}

function getMaxBoosters() {
  let target = saveFile.hadrons.hadrons.pow(getBoosterCostExp().pow(-1)).max(1).logBase(125).pow(2).add(1);
  if (target.gte(2000)) target = target.div(2000).logBase(1.01).plus(2000)
  if (target.gte(12)) target = target.times(12).sqrt()
  return target.sub(1).floor();
}

function maxBoosters() {
  if (saveFile.hadrons.hadrons.lt(getBoosterCost())) return;
  let target = getMaxBoosters().max(saveFile.hadrons.boosters.plus(1))
  saveFile.hadrons.hadrons = saveFile.hadrons.hadrons.sub(getBoosterCost())
  saveFile.hadrons.boosters = saveFile.hadrons.boosters.max(target)
}

function updateHadrons(diff) {
  get("hadrontabbtn").style.display = saveFile.hadrons.unlocked?"inline-block":"none"
  get("prestUpgrs7").style.display = saveFile.hadrons.unlocked?"inline-block":"none"
  get("prestUpgrs8").style.display = saveFile.hadrons.unlocked?"inline-block":"none"
  get("prestUpgrs9").style.display = saveFile.hadrons.unlocked?"inline-block":"none"
  get("prestUpgrs10").style.display = (saveFile.hadrons.boosters.gt(1)||hasAnnihilationUpg(5))?"inline-block":"none"
  get("prestUpgrs11").style.display = (saveFile.hadrons.boosters.gt(1)||hasAnnihilationUpg(5))?"inline-block":"none"
  get("prestUpgrs12").style.display = (saveFile.hadrons.boosters.gt(1)||hasAnnihilationUpg(5))?"inline-block":"none"
  get("unlockHadrons").style.display = (saveFile.hadrons.unlocked||!saveFile.quarks.unlocked)?"none":"inline-block"
  get("hadronAmt").textContent = format(saveFile.hadrons.hadrons)
  get("hadronPower").textContent = format(getHadronPow())
  get("boosterAmt").textContent = format(saveFile.hadrons.boosters)
  get("boosterCost").textContent = format(getBoosterCost())
  get("boosterPower").textContent = format(getBoosterPower())
  if(saveFile.hadrons.unlocked) saveFile.hadrons.hadrons = saveFile.hadrons.hadrons.add(getHadronGain().mul(diff))
  if (saveFile.hadrons.auto) maxBoosters();
}

function updateQuarks(diff) {
  get("unlockQuarks").style.display = (saveFile.quarks.unlocked||!saveFile.prestige.unlockedUpgrades)?"none":"inline-block"
  get("quarktabbtn").style.display = saveFile.quarks.unlocked?"inline-block":"none"
  get("prestUpgrs4").style.display = saveFile.quarks.unlocked?"inline-block":"none"
  get("prestUpgrs5").style.display = saveFile.quarks.unlocked?"inline-block":"none"
  get("prestUpgrs6").style.display = saveFile.quarks.unlocked?"inline-block":"none"
  for (var i in saveFile.quarks.colors) {
    if (saveFile.quarks.unlocked) {
      saveFile.quarks.colors[i] = saveFile.quarks.colors[i].add(OmegaNum.mul(diff, getQuarkMult(i)))
    }
  }
  saveFile.quarks.gluon = saveFile.quarks.gluon.add(getGluonGain().mul(diff))
  get("quarksRed").textContent = format(saveFile.quarks.colors[0])
  get("quarksBlue").textContent = format(saveFile.quarks.colors[1])
  get("quarksGreen").textContent = format(saveFile.quarks.colors[2])
  get("quarksRedMult").textContent = format(saveFile.quarks.colors[0].add(1).log10().pow(2).pow(getBoosterPower()))
  get("quarksBlueMult").textContent = format(saveFile.quarks.colors[1].add(1).log10().pow(2).root(1.05).pow(getBoosterPower()))
  get("quarksGreenMult").textContent = format(saveFile.quarks.colors[2].add(1).log10().pow(2).root(1.1).pow(getBoosterPower()))
  get("gluonLength").innerHTML = meterFormat(saveFile.quarks.gluon)
  get("gluonPower").textContent = format(getGluonEff())
  get("gluonSC").textContent = getGluonEff(true).gte(getGluonReducStart())?("(divided by "+format(getGluonReduc())+" due to Gluon Stretching)"):""
}

function getSubbedPrestigeDepths() {
  let d = new OmegaNum(0);
  d = d.plus(getPrestigeUpgradeEffect(1));
  if (hasZetaUpg(6)) d = d.plus(getZetaUpgEff(6))
  return d;
}

function getPrestigeEff() {
  let eff = saveFile.prestige.depth.plus(1).cbrt();
  eff = eff.pow(getPrestigeUpgradeEffect(3));
  eff = eff.pow(getAnnihilationEnergyEff());
  return eff
}

function getGrowthSpeed() {
  let speed = getPrestigeEff(); 
  if (saveFile.quarks.unlocked) speed = speed.times(getGluonEff())
  speed = speed.times(getAnnihilationEnergyEff2())
  speed = speed.times(getAntiUpgEff(14))
  if (saveFile.antiquarks.unlocked) speed = speed.times(getAntiUpgEff(14))
  if (hasDeltaUpg(1)) speed = speed.times(getDeltaUpgEff(1))
  if (hasZetaUpg(14)) speed = speed.times(getZetaUpgEff(14))
  
  // Leave till the end
  if (speed.gte(getUniverseSlowdownStart())) speed = speed.pow(OmegaNum.pow(getUniverseSlowdownPower(), -1))
  return speed;
}

function respecPrestUpgs() {
  let s = false
  saveFile.prestige.upgrades.map(a => s = (s || OmegaNum.gte(a, 1)))
  if (!s) return;
  if (saveFile.prestigeRespecConf) if (!confirm("Are you sure you want to reset your Prestige Upgrades?")) return
  saveFile.prestige.upgrades = getSaveFile().prestige.upgrades
  saveFile.prestige.points = saveFile.prestige.points.plus(saveFile.prestige.spent)
  saveFile.prestige.spent = new OmegaNum(0);
}

function getPrestigeGoal() {
  let mainDepth = saveFile.prestige.depth
  if (mainDepth.gte(60)) mainDepth = OmegaNum.pow(1+1/60, mainDepth.sub(59)).times(60)
  if (mainDepth.gte(20)) mainDepth = mainDepth.pow(4).div(Math.pow(20, 3))
  else if (mainDepth.gte(15)) mainDepth = mainDepth.pow(2).div(15);
  let goal = new OmegaNum(1.1).pow(mainDepth.sub(getSubbedPrestigeDepths()).div(3).add(1).pow(3).plus(1));
  return goal;
}

function getPrestigeDepthBulk() {
  let depth = saveFile.size.max(1).logBase(1.1).sub(1).cbrt().sub(1).times(3).plus(getSubbedPrestigeDepths())
  if (depth.gte(20)) depth = depth.times(Math.pow(20, 3)).root(4)
  else if (depth.gte(15)) depth = depth.times(15).sqrt()
  if (depth.gte(60)) depth = depth.div(60).logBase(1+1/60).add(59)
  return depth.plus(1).floor()
}

function getPrestigeDepthName(adj=0) {
  let d = saveFile.prestige.depth.plus(adj)
  if (d.gte(60)) return " obscure"
  else if (d.gte(15)) return " isolated"
  else return ""
}

function PU1Each() {
  let eff = new OmegaNum(0.1);
  eff = eff.plus(getPrestigeUpgradeEffect(12))
  if(saveFile.photons.unlocked) eff = eff.mul(getPhotonEff(0))
  return eff;
}

function togglePrestRespecConf() {
  saveFile.prestigeRespecConf = !saveFile.prestigeRespecConf
}

function updatePrestige(diff) {
  get("PU1each").textContent = format(PU1Each())
  get("prestigeGoal").innerHTML = meterFormat(getPrestigeGoal())
  get("prestigeDepth").innerHTML = format(saveFile.prestige.depth.add(1))
  get("prestigeDiv").style.display = (saveFile.prestige.depth.gt(0)||saveFile.quarks.unlocked||saveFile.hadrons.unlocked)?"inline-block":"none"
  get("prestigeDepths").textContent = format(saveFile.prestige.depth)
  get("prestigeDepthName").textContent = getPrestigeDepthName()
  get("prestigeEff").textContent = format(getPrestigeEff())
  get("prestigePoints").textContent = format(saveFile.prestige.points)
  get("unlockPrestUpgrs").style.display = (saveFile.prestige.unlockedUpgrades||saveFile.prestige.depth.eq(0))?"none":"inline-block"
  get("prestigeUpgrs").style.display = saveFile.prestige.unlockedUpgrades?"inline-block":"none"
  for (let i=1;i<=12;i++) {
    get("prestUpgrs"+i+"Cost").textContent = format(getPrestUpgrCost(i))
    get("prestUpgrs"+i+"Desc").textContent= getPrestigeUpgradeDesc(i)
    get("prestUpgrs"+i+"Lvl").textContent= format(saveFile.prestige.upgrades[i-1])
  }
  get("respecConf").textContent = "Respec Confirm: "+(saveFile.prestigeRespecConf?"ON":"OFF")
  //get("maxAllPU").style.display = saveFile.hadrons.boosters.gte(2)?"":"none"
  if (saveFile.prestige.auto) prestige();
  if (saveFile.antiquarks.unlocked) saveFile.prestige.points = saveFile.prestige.points.plus(getAntiUpgEff(12).times(diff))
}

function getPrestUpgrCost(num, amt=saveFile.prestige.upgrades[num-1]) {
  if (amt.gte(10)) amt = OmegaNum.pow(amt, 2).times(10) // yay cost scaling
  if (amt.gte(4000)) amt = OmegaNum.pow(1.0015, amt.sub(3999)).times(4000) // yay more cost scaling
  let cost = new OmegaNum(num).mul(new OmegaNum(amt).add(1).sqrt());
  if (saveFile.battery.upgrades[15] && saveFile.battery.upgrades[15].gt(1)) cost = cost.div(getBatteryUpgEffect(16, 0))
  return cost.round();
}

function getPrestUpgrTarget(num, adj=1) {
  let amt = saveFile.prestige.points.times(adj).div(num).pow(2).sub(1)
  if (amt.gte(4000)) amt = amt.div(4000).logBase(1.0015).add(3999)
  if (amt.gte(10)) amt = amt.div(10).sqrt()
  return amt.floor().plus(1);
}

function buyPrestUpgrs(num) {
  if(saveFile.prestige.points.lt(getPrestUpgrCost(num))) return;
  let cost = getPrestUpgrCost(num)
  saveFile.prestige.upgrades[num-1] = saveFile.prestige.upgrades[num-1].add(1)
  saveFile.prestige.points = saveFile.prestige.points.sub(cost).max(0)
  saveFile.prestige.spent = saveFile.prestige.spent.plus(cost)
}

function maxAllPUs(spend=true) {
  for (let i=1;i<=12;i++) {
    let cost = getPrestUpgrCost(i)
    if (saveFile.prestige.points.lt(cost)) continue;
    let target = getPrestUpgrTarget(i, 1/12).max(saveFile.prestige.upgrades[i-1].plus(1))
    cost = getPrestUpgrCost(i, target.sub(1))
    saveFile.prestige.upgrades[i-1] = saveFile.prestige.upgrades[i-1].max(target)
    saveFile.prestige.points = saveFile.prestige.points.sub(cost).max(0)
    saveFile.prestige.spent = saveFile.prestige.spent.plus(cost)
  }
}

function unlockPrestigeUpgrades() {
    if (saveFile.prestige.points.lt(10)) return;
    if (!confirm("Are you sure you want to unlock Prestige Upgrades? You won't be able to get back your Prestige Points immediately!")) return;
    saveFile.prestige.points = saveFile.prestige.points.sub(10)
    saveFile.prestige.unlockedUpgrades = true
}

function getPPMult() {
  let mult = new OmegaNum(1)
  if (hasAnnihilationUpg(1)) mult = mult.times(2)
  if (saveFile.antiquarks.unlocked) mult = mult.times(getAntiUpgEff(10))
  if (hasZetaUpg(16)) mult = mult.times(getZetaUpgEff(16))
  return mult
}

function prestige() {
  if(saveFile.size.lt(getPrestigeGoal())) return;
  saveFile.prestige.depth = hasVoidUpg(4)?saveFile.prestige.depth.max(getPrestigeDepthBulk()):saveFile.prestige.depth.add(1)
  if(saveFile.prestige.done.lte(saveFile.prestige.depth) || hasAnnihilationUpg(13)) saveFile.prestige.points = saveFile.prestige.points.add(saveFile.prestige.depth.times(getPPMult()))
  if (!hasAnnihilationUpg(14)) {
    saveFile.size = new OmegaNum(1)
    saveFile.quarks.gluon = new OmegaNum(0)
  }
  saveFile.size = saveFile.size.max(1)
  saveFile.prestige.done = saveFile.prestige.done.max(saveFile.prestige.depth)
}

function getUniverseSlowdownStart() {
  let me = new OmegaNum(2)
  
  me = me.mul(getPrestigeUpgradeEffect(2))
  if (saveFile.hadrons.unlocked) me = me.mul(getHadronPow())
  
  return me
}

function getUniverseSlowdownPower() {
  let pow = new OmegaNum(1.5)
  return pow;
}

function getSuperCompactionStart() {
  let start = OmegaNum.pow(4.4e26, 200)
  return start;
}

function getSuperCompactionRoot() {
  let d = new OmegaNum(0.1)
  
  if (hasZetaUpg(15)) d = d.div(getZetaUpgEff(15))

  return d.add(1)
}

function getCompactedStart() {
  let hi = new OmegaNum(10000)
  
  if (saveFile.hadrons.unlocked) hi = hi.mul(getHadronPow().pow(2))
  if (hasAnnihilationUpg(11)) hi = hi.mul(4)
  
  return hi
}

function getNewSize(diff) {
  let projected = saveFile.size.mul(OmegaNum.pow(OmegaNum.pow(1.01, getGrowthSpeed()), diff)); // base x1.01/sec
  if (projected.lt(getCompactedStart())) return projected.max(1)
  else {
    let newProj = saveFile.size.plus(OmegaNum.mul(getGrowthSpeed(), diff/20)).max(getCompactedStart()).max(1) // base +0.05m/sec
    if (newProj.lt(getSuperCompactionStart())) return newProj.max(1);
    else return saveFile.size.plus(OmegaNum.mul(getGrowthSpeed().root(getSuperCompactionRoot()), diff/20)).max(getSuperCompactionStart()).max(1)
  }
}

function updateTabs() {
  let tabs = document.getElementsByClassName("tab")
  for (let i=0;i<tabs.length;i++) {
    let tab = tabs[i];
    tab.style.display = saveFile.tab==tab.id?"inline-block":"none"
  }
  let metatabs = document.getElementsByClassName("metatab")
  for (let i=0;i<metatabs.length;i++) {
    let metatab = metatabs[i];
    metatab.style.display = saveFile.chapter==metatab.id?"inline-block":"none"
  }
}

function loop() {
  var diff = (Date.now() - saveFile.lastTick) / 1000
  saveFile.size = getNewSize(diff)
  get("universeType").textContent = saveFile.size.gt(getSuperCompactionStart())?"supercompacted ":(saveFile.size.gt(getCompactedStart())?"compacted ":"")
  get("universeSize").innerHTML = meterFormat(saveFile.size)
  get("universeSlowDown").textContent = getGrowthSpeed().gte(getUniverseSlowdownStart())?("The growth of the universe has slowed down beyond the growth rate of x"+format(getUniverseSlowdownStart())+"/sec"):""
  get("autosave").textContent = "Autosave: "+(saveFile.autosave?"ON":"OFF")
  saveFile.lastTick = Date.now()
  updateAchievements()
  updateTabs()
  updatePrestige(diff)
  updateQuarks(diff)
  updateHadrons(diff)
  updateAnnihilation(diff)
  updateVoid(diff)
  updatePhotons(diff)
  updateAntiquarks(diff)
  updateDupli(diff)
  updateBattery(diff)
  updateHeatDeath(diff)
  updateNeutrinos(diff)
}

function canAnnihilate() {
  return saveFile.prestige.depth.gte(14)&&getAnnihilateGain().gt(0)
}

function getAnnihilateSoftcap() {
  let m = new OmegaNum(1e14)
  return m
}

function getAnnihilateGain() {
  let gain = OmegaNum.pow(1.2, saveFile.prestige.depth.sub(14)).plus(saveFile.prestige.depth.sub(14).div(2)).max(0)
  if (hasAnnihilationUpg(16)) gain = gain.times(annihilateUpgEff(16))
  gain = gain.mul(getVoidUpgEff(3))
  if (hasZetaUpg(1)) gain = gain.mul(getZetaUpgEff(1))
  if (gain.gt(getAnnihilateSoftcap())) gain = gain.cbrt().mul(OmegaNum.cbrt(getAnnihilateSoftcap())).add(getAnnihilateSoftcap()).cbrt().mul(OmegaNum.cbrt(getAnnihilateSoftcap())).add(getAnnihilateSoftcap())
  return gain.floor();
}

function annihilate(force=false) {
  if (!force) {
    if (!canAnnihilate()) return
    saveFile.annihilation.energy = saveFile.annihilation.energy.plus(getAnnihilateGain());
  }
  saveFile.size = new OmegaNum(1)
  saveFile.prestige = {
    points: hasAnnihilationUpg(12)?saveFile.prestige.points:new OmegaNum(0),
    spent: hasAnnihilationUpg(12)?saveFile.prestige.spent:new OmegaNum(0),
    done: hasAnnihilationUpg(12)?saveFile.prestige.done:new OmegaNum(0),
    depth: new OmegaNum(0),
    unlockedUpgrades: hasAnnihilationUpg(3),
    upgrades: hasAnnihilationUpg(12)?saveFile.prestige.upgrades:[new OmegaNum(0),new OmegaNum(0),new OmegaNum(0),new OmegaNum(0),new OmegaNum(0),new OmegaNum(0),new OmegaNum(0),new OmegaNum(0),new OmegaNum(0),new OmegaNum(0),new OmegaNum(0),new OmegaNum(0)],
    auto: saveFile.prestige.auto,
  }
  if(!hasVoidUpg(10)) {
    saveFile.quarks = {
      unlocked: hasAnnihilationUpg(5),
      colors: [new OmegaNum(0),new OmegaNum(0),new OmegaNum(0)],
      gluon: new OmegaNum(1)
    }
  } else {
    saveFile.quarks = {
      unlocked: hasAnnihilationUpg(5),
      colors: [new OmegaNum(0),new OmegaNum(0),new OmegaNum(0)],
      gluon: saveFile.quarks.gluon
    }
  }
  saveFile.hadrons = {
    unlocked: hasAnnihilationUpg(5),
    hadrons: new OmegaNum(0),
    boosters: new OmegaNum(0),
    auto: saveFile.hadrons.auto,
  }
}

function getAnnihilationEnergyEff() {
  let energy = saveFile.annihilation.energy
  if (energy.gte(100)) energy = energy.sqrt().times(10)
  let eff = energy.plus(1).log10().plus(1).pow(2)
  return eff;
}

function getAnnihilationEnergyEff2() {
  if (saveFile.annihilation.energy.lt(1)) return new OmegaNum(1)
  let energy = saveFile.annihilation.energy
  if (energy.gte(200)) energy = energy.sqrt().times(Math.sqrt(200))
  let eff = energy.plus(1).times(saveFile.prestige.depth.div(10).plus(1).sqrt()).pow(OmegaNum.add(1.75, OmegaNum.mul(0.05, saveFile.prestige.depth)))
  return eff
}

const ANNIHILATE_UPG_COSTS = {
  1: new OmegaNum(1),
  2: new OmegaNum(1),
  3: new OmegaNum(1),
  4: new OmegaNum(2),
  5: new OmegaNum(2),
  6: new OmegaNum(2),
  7: new OmegaNum(4),
  8: new OmegaNum(4),
  9: new OmegaNum(4),
  10: new OmegaNum(6),
  11: new OmegaNum(6),
  12: new OmegaNum(10),
  13: new OmegaNum(12),
  14: new OmegaNum(25),
  15: new OmegaNum(100),
  16: new OmegaNum(160),
  17: new OmegaNum(250),
  18: new OmegaNum(500),
}

function annihilateUpgEff(x) {
  switch(x) {
    case 2:
      let eff = saveFile.annihilation.energy.plus(1).root(5);
      if (eff.gte(3.2e3)) eff = eff.log10().times(3.2e3/3.5)
      return eff;
      break;
    case 6: 
      let b = saveFile.hadrons.boosters
      if (b.gte(10)) b = b.sqrt().times(Math.sqrt(10));
      return b.times(1/3);
      break;
    case 7: 
      return saveFile.quarks.gluon.plus(1).sqrt().pow(0.2)
      break;
    case 10:
      return saveFile.hadrons.hadrons.plus(1).log10().div(3).times(getPhotonEff(3))
      break;
    case 15: 
      return saveFile.prestige.spent.plus(1).log10().sqrt().div(2)
      break;
    case 16:
      let ret = saveFile.size.sqrt().plus(1).pow(0.01)
      if (ret.gte(1e15)) ret = ret.log10().times(1e15/15)
      return ret;
      break;
  }
  return false
}

function buyAnnihilateUpg(x) {
  if (saveFile.annihilation.upgrades.includes(x)) return;
  let cost = ANNIHILATE_UPG_COSTS[x]
  if (saveFile.annihilation.energy.lt(cost)) return;
  saveFile.annihilation.energy = saveFile.annihilation.energy.sub(cost)
  saveFile.annihilation.upgrades.push(x)
  switch(x) {
    case 3: 
      saveFile.prestige.unlockedUpgrades = true;
      break;
    case 5: 
      saveFile.quarks.unlocked = true;
      saveFile.hadrons.unlocked = true;
      break;
  }
}

function hasAnnihilationUpg(x) {
  return saveFile.annihilation.upgrades.includes(x)
}

function updateAnnihilation(diff) {
  get("annihilationtabbtn").style.display = (canAnnihilate()||saveFile.annihilation.energy.gt(0)||saveFile.annihilation.upgrades.length>0)?"":"none"
  get("annihilate").textContent = canAnnihilate()?("Annihilate your universe to gain "+format(getAnnihilateGain())+" Annihilation Energy."):"Reach Prestige Depth 14 to Annihilate your universe."
  get("annihilateContent").style.display = (saveFile.annihilation.energy.gt(0)||saveFile.annihilation.upgrades.length>0)?"":"none"
  get("annEnergy").textContent = format(saveFile.annihilation.energy)
  get("annEnergyEff").textContent = format(getAnnihilationEnergyEff())
  get("annEnergyEff2").textContent = format(getAnnihilationEnergyEff2())
  for (let i=1;i<=18;i++) {
    get("annihilateUpg"+i).className = (hasAnnihilationUpg(i)?"annihilateBought":(saveFile.annihilation.energy.gte(ANNIHILATE_UPG_COSTS[i])?"annihilate":"annihilateLocked"))+" annihilateUpgBase"
    get("annihilateUpg"+i+"Cost").textContent = format(ANNIHILATE_UPG_COSTS[i])
    if (annihilateUpgEff(i)) get("annihilateUpg"+i+"Current").textContent = format(annihilateUpgEff(i))
  }
  get("autoLayer").style.display = hasAnnihilationUpg(8)?"":"none"
  get("autoLayer").textContent = "Auto: "+(saveFile.prestige.auto?"ON":"OFF")
  get("autoHadBoost").style.display = hasAnnihilationUpg(9)?"":"none"
  get("autoHadBoost").textContent = "Auto: "+(saveFile.hadrons.auto?"ON":"OFF")
  get("autoAnn").style.display = hasAnnihilationUpg(17)?"":"none"
  get("autoAnn").textContent = "Auto: "+(saveFile.annihilation.auto?"ON":"OFF")
  get("aRow3").style.display = hasAnnihilationUpg(12)?"":"none"
  get("voidUnl").style.display = saveFile.annihilation.voidUnl?"none":""
  get("annihilateCap").textContent = (getAnnihilateGain().gte(getAnnihilateSoftcap()))?("The universe has hit an energy slowdown, beginning at "+format(getAnnihilateSoftcap())+"..."):""
  if (saveFile.annihilation.auto && getAnnihilateGain().gte(saveFile.annihilation.autoVal)) annihilate();
}

function toggleAutoLayers() {
  if (hasAnnihilationUpg(8)) saveFile.prestige.auto = !saveFile.prestige.auto
}

function toggleAutoHadBoosts() {
  if (hasAnnihilationUpg(9)) saveFile.hadrons.auto = !saveFile.hadrons.auto
}

function toggleAutoAnn() {
  if (hasAnnihilationUpg(17)) saveFile.annihilation.auto = !saveFile.annihilation.auto
}

function updateAutoAnn() {
  let val = get("autoAnnInput").value
  try {
    let x = new OmegaNum(val||0)
    saveFile.annihilation.autoVal = x.toString()
  } catch(e) {
    saveFile.annihilation.autoVal = new OmegaNum(0);
  }
}

function getNextTheme(style) {
  switch(style) {
    case undefined:
      alert("oops fucked up something, either way we're fixing your style")
      return "style"
      break;
    case "style":
      return "dark"
      break;
    case "dark":
      return "style"
      break;
  }
}

function changeTheme(keep=false) { // theme change function
  let theme = get("style")
  saveFile.options.style = getNextTheme(saveFile.options.style||"style")
  if (keep) saveFile.options.style = getNextTheme(saveFile.options.style)
  theme.href = "/" + saveFile.options.style + ".css"
}

function unlockVoid() {
  if (saveFile.annihilation.voidUnl || saveFile.annihilation.energy.lt(2.5e3)) return
  saveFile.annihilation.voidUnl = true
}

function getVoidGainMult() {
  let mult = getVoidUpgEff(1)
  if (hasVoidUpg(12)) mult = mult.times(getUnreVoidUpgEff(9))
  return mult
}

function getVoidGain() {
  let energy = saveFile.annihilation.energy
  if (energy.gte(1e7)) energy = energy.sqrt().times(Math.sqrt(1e7))
  let gain = energy.minus(saveFile.annihilation.voidUsed).div(2.5e3).pow(0.4).times(getVoidGainMult())
  if (gain.gte(1e10)) gain = gain.cbrt().times(Math.pow(1e10, 2/3))
  if (gain.gte(1e20)) gain = gain.cbrt().times(Math.pow(1e20, 2/3))
  return gain.max(0).floor()
}

function getNextVP() {
  let vp = saveFile.annihilation.voidPower.plus(getVoidGain())
  let next = vp.div(getVoidGainMult()).pow(2.5).times(2.5e3).plus(saveFile.annihilation.voidUsed)
  if (next.gte(1e7)) next = next.div(Math.sqrt(1e7)).pow(2)
  return next.max(saveFile.annihilation.energy)
}

function sacrificeToVoid() {
  if (getVoidGain().lt(1) || !saveFile.annihilation.voidUnl) return
  let gain = getVoidGain()
  let oldEnergy = saveFile.annihilation.energy
  if (oldEnergy.gte(1e7)) oldEnergy = oldEnergy.sqrt().times(Math.sqrt(1e7))
  if (!saveFile.antiquarks.upgrades.includes(18)) saveFile.annihilation.energy = new OmegaNum(0);
  saveFile.annihilation.voidPower = saveFile.annihilation.voidPower.plus(gain)
  saveFile.annihilation.voidUsed = saveFile.annihilation.voidUsed.max(oldEnergy)
  annihilate(true)
}

function getSpaceTimeGain() {
  let gain = saveFile.annihilation.voidPower.pow(2).times(3)
  gain = gain.mul(getVoidUpgEff(2))
  if (saveFile.antiquarks.unlocked) gain = gain.mul(getAntiUpgEff(13))
  return gain
}

function getVoidUpgCost(x) {
  let base = [100, 250, 10000][x-1]
  let bought = saveFile.annihilation.voidRebuyableUpgs[x-1]
  if (bought.gte(25)) bought = bought.pow(2).div(25)
  if (bought.gte(50)) bought = OmegaNum.pow(1.2, bought.sub(50)).times(50)
  let cost = OmegaNum.pow(OmegaNum.cbrt(base), bought.times(x)).times(base)
  if (saveFile.photons.unlocked) cost = cost.div(getPhotonEff(2))
  return cost;
}

function getVoidUpgTarg(x) {
  let base = [100, 250, 10000][x-1]
  let bulk = saveFile.annihilation.spaceTime.times(getPhotonEff(2)).div(base).max(1).logBase(OmegaNum.cbrt(base)).div(x)
  if (bulk.gte(50)) bulk = bulk.div(50).max(1).logBase(1.2).plus(50)
  if (bulk.gte(25)) bulk = bulk.sqrt().times(5)
  return bulk.plus(1).floor()
}

const VOID_UPG_COSTS = {
  1: new OmegaNum(10000),
  2: new OmegaNum(1e6),
  3: new OmegaNum(1e12),
  4: new OmegaNum(1e26),
  5: new OmegaNum(1e28),
  6: new OmegaNum(1e30),
  7: new OmegaNum(9e30),
  8: new OmegaNum(2.5e31),
  9: new OmegaNum(2.238e33),
}

function getVoidUpgPow() {
  let vam = new OmegaNum(1)
  vam = vam.add(getPhotonEff(1))
  if (saveFile.antiquarks.upgrades.includes(25)) vam = vam.mul(1.75)
  if (saveFile.battery.upgrades[3]) vam = vam.mul(getBatteryUpgEffect(4, 0).add(1))
  return vam;
}

function getUnreVoidUpgEff(x) {
  switch(x) {
    case 2:
      return saveFile.annihilation.spaceTime.add(1).log(5).cbrt().add(1)
      break;
    case 3:
      return saveFile.annihilation.spaceTime.plus(1).cbrt()
      break;
    case 4: 
      return saveFile.annihilation.voidPower.plus(1).log10().plus(1).log10().sqrt()
      break;
    case 5:
      return saveFile.photons.colors[5].amount.plus(1).cbrt()
      break;
    case 6:
      return saveFile.annihilation.spaceTime.plus(1).log10()
      break;
    case 7:
      return saveFile.quarks.gluon.cbrt().add(1).log10().sqrt()
      break;
    case 8:
      let m = saveFile.photons.colors[0].boosters.add(saveFile.photons.colors[1].boosters).add(saveFile.photons.colors[2].boosters).add(saveFile.photons.colors[3].boosters).add(saveFile.photons.colors[4].boosters).add(saveFile.photons.colors[5].boosters)
      return m.cbrt().mul(4).add(1)
      break;
    case 9: 
      return saveFile.photons.colors[1].amount.plus(1).log10().pow(2).plus(1)
      break;
  }
}

function getAddedVoidUpgs() {
  let added = new OmegaNum(0)
  if (hasZetaUpg(4)) added = added.plus(1)
  return added
}

function getVoidUpgEff(x) {
  let bought = OmegaNum.add(saveFile.annihilation.voidRebuyableUpgs[x-1], getAddedVoidUpgs())
  if (!saveFile.annihilation.voidUnl) bought = new OmegaNum(0)
  switch(x) {
    case 1:
      return OmegaNum.pow(2, bought).pow(getVoidUpgPow())
      break;
    case 2:
      return OmegaNum.pow(1.5, bought).pow(getVoidUpgPow())
      break;
    case 3:
      return OmegaNum.pow(3, bought).pow(getVoidUpgPow())
      break;
  }
}

function buyVoidUpg(x) {
  if (!saveFile.annihilation.voidUnl) return
  if (x>3) if (saveFile.annihilation.voidUpgs.includes(x)) return
  let cost = x>3?VOID_UPG_COSTS[x-3]:getVoidUpgCost(x)
  if (saveFile.annihilation.spaceTime.lt(cost)) return
  saveFile.annihilation.spaceTime = saveFile.annihilation.spaceTime.sub(cost)
  if (x>3) saveFile.annihilation.voidUpgs.push(x);
  else saveFile.annihilation.voidRebuyableUpgs[x-1] = saveFile.annihilation.voidRebuyableUpgs[x-1].plus(1)
}

function maxVoidUpg(x) {
  if (!saveFile.annihilation.voidUnl) return
  if (x>3) return // this should never happen, but just in case I forgot something it's here
  let cost = getVoidUpgCost(x)
  if (saveFile.annihilation.spaceTime.lt(x)) return 
  let target = getVoidUpgTarg(x)
  if (target.lte(saveFile.annihilation.voidRebuyableUpgs[x-1])) return
  saveFile.annihilation.spaceTime = saveFile.annihilation.spaceTime.sub(cost).max(0)
  saveFile.annihilation.voidRebuyableUpgs[x-1] = saveFile.annihilation.voidRebuyableUpgs[x-1].max(target)
}

function hasVoidUpg(x) {
  return saveFile.annihilation.voidUpgs.includes(x)
}

function updateVoid(diff) {
  get("voidtabbtn").style.display = saveFile.annihilation.voidUnl?"":"none"
  get("voidGain").textContent = format(getVoidGain())
  get("voidPower").textContent = format(saveFile.annihilation.voidPower)
  get("spaceTime").innerHTML = meterFormat(saveFile.annihilation.spaceTime)
  get("nextVP").textContent = format(getNextVP())
  for (let i=1;i<=3;i++) {
    get("voidUpg"+i).className = (saveFile.annihilation.spaceTime.gte(getVoidUpgCost(i))?"voidUpg":"voidLocked")+" voidUpgBase"
    get("voidUpg"+i+"Cost").innerHTML = meterFormat(getVoidUpgCost(i))
    get("voidUpg"+i+"Level").textContent = format(saveFile.annihilation.voidRebuyableUpgs[i-1])
    get("voidUpg"+i+"Eff").textContent = format(getVoidUpgEff(i))
    if (saveFile.heat.autoVoid && hasZetaUpg(7)) maxVoidUpg(i)
  }
  for (let i=4;i<=12;i++) {
    get("voidUpg"+i).className = (saveFile.annihilation.voidUpgs.includes(i)?"voidBought":(saveFile.annihilation.spaceTime.gte(VOID_UPG_COSTS[i-3])?"voidUpg":"voidLocked"))+" voidUpgBase"
    get("voidUpg"+i+"Cost").innerHTML = meterFormat(VOID_UPG_COSTS[i-3])
    if(get("voidUpg"+i+"Eff")) {
       get("voidUpg"+i+"Eff").textContent = format(getUnreVoidUpgEff(i-3))
    }
  }
  get("voidRow3").style.display = saveFile.photons.unlocked?"":"none"
  get("voidRow4").style.display = saveFile.photons.unlocked?"":"none"
  if (saveFile.annihilation.voidUnl) {
    saveFile.annihilation.spaceTime = saveFile.annihilation.spaceTime.plus(getSpaceTimeGain().times(diff))
  }
}

setInterval(function() {loop()}, 20)
setInterval(function() {
  if (saveFile.autosave) save();
}, 200)
let theme = get("style")
theme.href = "/" + saveFile.options.style + ".css"
updateBatteryUpgrades()