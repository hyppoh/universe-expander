function unlockPhotons() {
  if (saveFile.photons.unlocked) return;
  if (saveFile.annihilation.voidPower.lt(1e10)) return;
  saveFile.photons.unlocked = true;
}

function getPhotonsMult(num) {
  let base = saveFile.photons.matter.plus(1).log(10).sqrt()
  
  base = base.div(OmegaNum.pow(2, ((num/3)+1)))
  if(num<5)base = base.mul(getPBoosterPower(num))
  if(num==0) base = base.mul(saveFile.prestige.depth.plus(1).sqrt().mul(1.5))
  if(num==1) base = base.mul(saveFile.quarks.gluon.plus(1).log(10).sqrt().max(1).log(10).pow(1.1).plus(1))
  if(num==2) base = base.mul(saveFile.annihilation.voidPower.plus(1).log(10).plus(1))
  if(num==3) base = base.mul(saveFile.annihilation.energy.plus(1).log(2).cbrt().max(1).log(10).plus(1))
  if(hasVoidUpg(9) && num==3) base = base.mul(getUnreVoidUpgEff(5))
  if(num==4) base = base.mul(saveFile.quarks.colors[0].plus(saveFile.quarks.colors[1]).plus(saveFile.quarks.colors[2]).plus(1).max(1).log(10).cbrt().plus(1))
  if(num==5) base = base.div(100)
  if(num<5) base = base.mul(getPhotonEff(5))
  if(num==5) {
    base = base.mul(getAntiUpgEff(9))
    base = base.mul(getAntiUpgEff(11))
  }
  if (saveFile.antiquarks.upgrades.includes(15)) base = base.mul(50)
  base = base.mul(getDupliEff(4))
  
  return base
}

function getPhotonEff(num) {
  let basePhotonPower = getPBoosterPower(num).cbrt()
  if (!saveFile.photons.unlocked) return new OmegaNum(num==1?0:1)
  let ret;
  switch (num) {
    case 0:
      ret = saveFile.photons.colors[0].amount.add(1).log(2).cbrt().sqrt().add(1).max(1).times(basePhotonPower)
      if (saveFile.battery.upgrades[14] && saveFile.battery.unlocked) ret = ret.plus(getBatteryUpgEffect(15, 0))
      return ret;
      break;
    case 1:
      ret = saveFile.photons.colors[1].amount.add(1).cbrt().sqrt().div(25).mul(100).times(basePhotonPower).div(700)
      if (ret.gte(0.2)) ret = ret.div(10).plus(0.18)
      if (ret.gte(0.4)) ret = ret.div(100).plus(0.396)
      return ret;
      break;
    case 2:
      return saveFile.photons.colors[2].amount.add(1).log(2).cbrt().add(1).div(5).add(1).pow(basePhotonPower)
      break;
    case 3:
      if (hasVoidUpg(9)) return saveFile.photons.colors[3].amount.add(1).pow(0.4).add(1).logBase(7.5).max(1).times(basePhotonPower)
      else return saveFile.photons.colors[3].amount.add(1).cbrt().add(1).log10().max(1).times(basePhotonPower)
      break;
    case 4:
      return saveFile.photons.colors[4].amount.add(1).sqrt().pow(basePhotonPower.sqrt())
      break;
    case 5: 
      let base = saveFile.photons.colors[5].amount.plus(1).log10().plus(1).pow(2)
      if (saveFile.battery.upgrades[4]) base = base.pow(getBatteryUpgEffect(5, 0).add(1))
      return base
      break;
  }
}

function getMatterMult() {
  let base = saveFile.prestige.depth.plus(1).sqrt()
  base = base.mul(saveFile.annihilation.spaceTime.plus(1).sqrt().plus(1).log(10).cbrt().plus(1))
  base = base.div(100)
  base = base.mul(getPBoosterPower(5))
  if(hasVoidUpg(8)) base = base.mul(getUnreVoidUpgEff(4))
  if(hasVoidUpg(10)) base = base.mul(getUnreVoidUpgEff(7))
  if (saveFile.antiquarks.unlocked) base = base.mul(getAntigluonEff())
  if (hasZetaUpg(10)) base = base.mul(100)
  return base
}

function getPhotonBoosterCostMult(num) {
  let mul = new OmegaNum(1)
  if (saveFile.antiquarks.unlocked && num==0) mul = mul.div(getAntiUpgEff(6))
  if (saveFile.antiquarks.upgrades.includes(15)) mul = mul.div(100)
  return mul
}

function getPhotonBoosterCost(num) {
  let b = saveFile.photons.colors[num].boosters
  if (b.gte(8)) b = OmegaNum.pow(2.5, b.sub(7)).times(5)
  else if (b.gte(6)) b = OmegaNum.pow(1.2, b.sub(5)).times(6)
  let base = b.add(1).mul(50)
  base = base.pow(1.2)
  if(num>2 && num<5) base = base.div(10).pow(1.6)
  if(num==5) base = base.div(25).pow(2)
  base = base.times(getPhotonBoosterCostMult(num))
  return base
}

function getPhotonBoosterTarg(num) {
  let bulk = saveFile.photons.matter.div(getPhotonBoosterCostMult(num))
  if (num==5) bulk = bulk.sqrt().times(25)
  if (num>2 && num<5) bulk = bulk.pow(1/1.6).times(10)
  bulk = bulk.pow(1/1.2)
  bulk = bulk.div(50).sub(1)
  if (bulk.gte(8)) bulk = bulk.div(5).max(1).logBase(2.5).add(7)
  else if (bulk.gte(6)) bulk = bulk.div(6).max(1).logBase(1.2).add(5)
  return bulk.plus(1).floor()
}

function buyPBooster(num) {
  if (saveFile.photons.matter.lt(getPhotonBoosterCost(num))) return;
  saveFile.photons.matter = saveFile.photons.matter.sub(getPhotonBoosterCost(num))
  saveFile.photons.colors[num].boosters = saveFile.photons.colors[num].boosters.add(1)
}

function maxPBooster(num) {
  if (saveFile.photons.matter.lt(getPhotonBoosterCost(num))) return;
  let targ = getPhotonBoosterTarg(num)
  if (targ.lte(saveFile.photons.colors[num].boosters)) return
  saveFile.photons.matter = saveFile.photons.matter.sub(getPhotonBoosterCost(num))
  saveFile.photons.colors[num].boosters = saveFile.photons.colors[num].boosters.max(targ)
}

function getPBoosterPower(num) {
  let base = new OmegaNum(1)
  let boosters = saveFile.photons.colors[num].boosters
  if (boosters.gte(12)) boosters = boosters.times(12).sqrt()
  base = base.add(1).pow(boosters.add(1)).sub(1)
  if(num==5) {
    base = base.sqrt().pow(1.5)
    if (saveFile.antiquarks.unlocked) base = base.times(getAntiUpgEff(5))
  }
  return base
}

function updatePhotons(diff) {
  get("photonUnl").style.display = saveFile.photons.unlocked?"none":""
  get("photontabbtn").style.display = saveFile.photons.unlocked?"inline-block":"none"
  if (saveFile.photons.unlocked) {
    for (var i in saveFile.photons.colors) {
      saveFile.photons.colors[i].amount = saveFile.photons.colors[i].amount.add(OmegaNum.mul(diff, getPhotonsMult(i)))
    }
    saveFile.photons.matter = saveFile.photons.matter.add(OmegaNum.mul(diff, getMatterMult()))
  }
  get("photonsRedAmount").textContent = format(saveFile.photons.colors[0].amount)
  get("photonsRedMultiplier").textContent = format(getPhotonEff(0))
  get("redBoosterAmt").textContent = format(saveFile.photons.colors[0].boosters)
  get("redBoosterPower").textContent = format(getPBoosterPower(0))
  get("redPhotonBoostCost").textContent = format(getPhotonBoosterCost(0))
  get("photonsOrangeAmount").textContent = format(saveFile.photons.colors[1].amount)
  get("photonsOrangeMultiplier").textContent = format(getPhotonEff(1).times(100))
  get("orangeBoosterAmt").textContent = format(saveFile.photons.colors[1].boosters)
  get("orangeBoosterPower").textContent = format(getPBoosterPower(1))
  get("orangePhotonBoostCost").textContent = format(getPhotonBoosterCost(1))
  get("photonsYellowAmount").textContent = format(saveFile.photons.colors[2].amount)
  get("photonsYellowMultiplier").textContent = format(getPhotonEff(2))
  get("yellowBoosterAmt").textContent = format(saveFile.photons.colors[2].boosters)
  get("yellowBoosterPower").textContent = format(getPBoosterPower(2))
  get("yellowPhotonBoostCost").textContent = format(getPhotonBoosterCost(2))
  get("photonsGreenAmount").textContent = format(saveFile.photons.colors[3].amount)
  get("photonsGreenMultiplier").textContent = format(getPhotonEff(3))
  get("greenBoosterAmt").textContent = format(saveFile.photons.colors[3].boosters)
  get("greenBoosterPower").textContent = format(getPBoosterPower(3))
  get("greenPhotonBoostCost").textContent = format(getPhotonBoosterCost(3))
  get("photonsBlueAmount").textContent = format(saveFile.photons.colors[4].amount)
  get("photonsBlueMultiplier").textContent = format(getPhotonEff(4))
  get("blueBoosterAmt").textContent = format(saveFile.photons.colors[4].boosters)
  get("blueBoosterPower").textContent = format(getPBoosterPower(4))
  get("bluePhotonBoostCost").textContent = format(getPhotonBoosterCost(4))
  get("photonsPurpleAmount").textContent = format(saveFile.photons.colors[5].amount)
  get("photonsPurpleMultiplier").textContent = format(getPhotonEff(5))
  get("purpleBoosterAmt").textContent = format(saveFile.photons.colors[5].boosters)
  get("purpleBoosterPower").textContent = format(getPBoosterPower(5))
  get("purplePhotonBoostCost").textContent = format(getPhotonBoosterCost(5))
  get("photonicMatter").textContent = format(saveFile.photons.matter)
  if (saveFile.heat.autoPhotons && hasZetaUpg(10)) for (let i=0;i<6;i++) maxPBooster(i);
}