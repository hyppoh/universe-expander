// the battery is going to be the LAST mechanic before heat death
// please
function updateBattery(diff) {
  get("batteryUnl").style.display = (saveFile.battery.unlocked||!saveFile.dupli.unlocked)?"none":""
  get("batterytabbtn").style.display = saveFile.battery.unlocked?"":"none"
  get("batteryEnergy").textContent = format(saveFile.battery.energy)
  get("batteryFluid").textContent = format(saveFile.battery.fluid)
  get("batteryEnergyPower").textContent = format(getBatteryEnergyPower())
  get("batteryFluidPower").textContent = format(getBatteryEnergyGain())
  if (saveFile.battery.unlocked) {
    saveFile.battery.fluid = saveFile.battery.fluid.add(getBatteryFluidGain().mul(diff))
    saveFile.battery.energy = saveFile.battery.energy.add(getBatteryEnergyGain().mul(diff).mul(getBatterySpeed()))
  }
  if (saveFile.lastTick%4000 >= 3950) { // 50 ticks of padding time
    updateBatteryUpgrades()
  }
  if (saveFile.heat.autoBattery) automateBattery()
}

function unlockBattery() {
  if (saveFile.battery.unlocked) return
  if (saveFile.antiquarks.upgrades.length<25) return
  saveFile.battery.unlocked = true;
}

function getBatteryEnergyGain() {
  let a = saveFile.battery.fluid.div(saveFile.battery.energy.add(1)).root(1.4)
  if (a.isNaN) return saveFile.battery.fluid.root(1.8)
  if(saveFile.battery.upgrades[1]) a = a.pow(getBatteryUpgEffect(2, 0))
  if (saveFile.battery.upgrades[10]) a = a.pow(getBatteryUpgEffect(11, 0))
  return a
}

function getBatteryFluidGain() {
  let a = getBatterySpeed()
  if (saveFile.battery.upgrades[7]) a = a.mul(getBatteryUpgEffect(8, 0))
  return a
}

function getBatteryEnergyPower() {
  let power = saveFile.battery.energy
  power = power.sqrt()
  if(saveFile.battery.upgrades[0]) power = power.pow(getBatteryUpgEffect(1, 0).add(1))
  if(saveFile.battery.upgrades[13]) power = power.pow(getBatteryUpgEffect(14, 0).add(1))
  if(saveFile.dupli.upgrades>5) power = power.mul(getDupliEff(6))
  if (power.gt("1e600")) power = power.pow(1/100).mul(OmegaNum.pow("1e600", 99/100))
  return power.max(1);
}

function getBatterySpeed() {
  let speed = new OmegaNum(1);
  if (saveFile.battery.upgrades[2]) speed = speed.mul(getBatteryUpgEffect(3, 0))
  if (saveFile.battery.upgrades[8]) speed = speed.mul(getBatteryUpgEffect(9, 0))
  if (saveFile.dupli.upgrades > 6) speed = speed.mul(getDupliEff(6))
  if (hasZetaUpg(11)) speed = speed.mul(getZetaUpgEff(11))
  return speed;
}

function getUnlBatteryUpgradeCost() {
  let cost = new OmegaNum(saveFile.battery.upgrades.length)
  if (saveFile.battery.upgrades.length == 0) return new OmegaNum(100);
  cost = cost.add(1).mul(10).pow(2)
  if (saveFile.battery.upgrades.length >= 2) cost = cost.div(1.1+0.2*saveFile.battery.upgrades.length)
  if (saveFile.battery.upgrades.length == 4) cost = cost.times(0.85);
  if (saveFile.battery.upgrades.length >= 6) cost = cost.times(0.95);
  if (saveFile.battery.upgrades.length > 7) cost = cost.root(1/3).div(cost.root(2/3)).div(10)
  if (saveFile.battery.upgrades.length > 13) cost = cost.pow(1.25)
  if (saveFile.battery.upgrades.length > 14) cost = cost.pow(primesLTE(cost).root(5).add(1))
  if (saveFile.battery.upgrades.length > 15) return new OmegaNum(1/0);
  return cost
}

function unlockBatteryUpgrade() {
  if (saveFile.battery.fluid.lt(getUnlBatteryUpgradeCost())) return;
  saveFile.battery.upgrades.push(new OmegaNum(0))
  updateBatteryUpgrades()
}

function getBatteryUpgEffect(x, amount) {
  let ret;
  switch(x) {
    case 1:
      return OmegaNum.pow(2, saveFile.battery.upgrades[0].add(amount).sqrt()).sqrt()
      break;
    case 2:
      return OmegaNum.pow(3, saveFile.battery.upgrades[1].add(amount).cbrt()).sqrt()
      break;
    case 3:
      return OmegaNum.pow(1.5, saveFile.battery.upgrades[2].add(amount).sqrt()).cbrt()
      break;
    case 4:
      return OmegaNum.mul(0.01, saveFile.battery.upgrades[3].add(amount))
      break;
    case 5:
      return OmegaNum.pow(3, saveFile.battery.upgrades[4].add(amount).add(1).log10()).cbrt()
      break;
    case 6:
      return OmegaNum.pow(5, saveFile.battery.upgrades[5].add(amount)).root(1.2)
      break;
    case 7:
      return OmegaNum.pow(1.5, saveFile.battery.upgrades[6].add(amount)).root(1.05)
      break;
    case 8:
      return OmegaNum.pow(1.5, saveFile.battery.upgrades[7].add(amount)).root(1.01)
      break;
    case 9:
      return OmegaNum.pow(4, saveFile.battery.upgrades[8].add(amount).cbrt()).sqrt()
      break;
    case 10:
      return OmegaNum.pow(5, saveFile.battery.upgrades[9].add(amount).cbrt()).cbrt()
      break;
    case 11:
      return OmegaNum.pow(3, saveFile.battery.upgrades[10].add(amount).sqrt()).sqrt()
      break;
    case 12:
      return OmegaNum.pow(1.45, saveFile.battery.upgrades[11].add(amount).sqrt())
      break;
    case 13:
      return OmegaNum.pow(2, saveFile.battery.upgrades[12].add(amount).sqrt()).sqrt()
      break;
    case 14:
      return OmegaNum.pow(2, saveFile.battery.upgrades[13].add(amount).sqrt()).sqrt()
      break;
    case 15:
      ret = saveFile.battery.upgrades[14].add(amount).pow(1.5).times(39.5)
      if (ret.gte(100)) ret = ret.sqrt().times(10)
      return ret;
      break;
    case 16:
      return saveFile.battery.upgrades[15].add(amount).pow(0.75).times(5)
      if (ret.gte(100)) ret = ret.sqrt().times(10)
  }
}

function getBatteryUpgCost(x) {
  let m = new OmegaNum(1);
  let q = saveFile.battery.upgrades[x]||new OmegaNum(0)
  switch(x) { //Get base
    case 0:
      m = new OmegaNum(10)
      break;
    case 1:
      m = new OmegaNum(12)
      break;
    case 2:
      m = new OmegaNum(14)
      break;
    case 3:
      m = new OmegaNum(20)
      break;
    case 4:
      m = new OmegaNum(45)
      break;
    case 5:
      m = new OmegaNum(80)
      break;
    case 6:
      m = new OmegaNum(75)
      break;
    case 7:
      m = new OmegaNum(50)
      break;
    case 8:
      m = new OmegaNum(100)
      break;
    case 9:
      m = new OmegaNum(135)
      break;
    case 10:
      m = new OmegaNum(95)
      break;
    case 11:
      m = new OmegaNum(110)
      break;
    case 12:
      m = new OmegaNum(135)
      break;
    case 13:
      m = new OmegaNum(240)
      break;
    case 14: 
      m = new OmegaNum(250)
      break;
    case 15: 
      m = new OmegaNum(4500)
      break;
  }
  if ((saveFile.battery.upgrades[x]||new OmegaNum(0)).gt(15)) q = q.pow(2).div(15)
  if ((saveFile.battery.upgrades[x]||new OmegaNum(0)).gt(25)) q = q.pow(3).div(OmegaNum.pow(25, 2))
  if ((saveFile.battery.upgrades[x]||new OmegaNum(0)).gt(50)) q = q.pow(4).div(OmegaNum.pow(50, 3))
  if ((saveFile.battery.upgrades[x]||new OmegaNum(0)).gt(100)) q = q.times(OmegaNum.pow(2, (saveFile.battery.upgrades[x]||new OmegaNum(0)).sub(100)).times(100))
  m = m.mul(q.add(1)).pow(2)
  if (saveFile.battery.upgrades[6] && x < 6) m = m.div(getBatteryUpgEffect(7, 0))
  if (saveFile.battery.upgrades[12] && x < 12) m = m.div(getBatteryUpgEffect(13, 0))
  if (hasZetaUpg(13)) m = m.div(getZetaUpgEff(13))
  return m
}

function canGetBatteryUpg(x) {
  return saveFile.battery.energy.gte(getBatteryUpgCost(x))
}

function buyBatteryUpg(x) {
  if(!canGetBatteryUpg(x)) return "we can't buy upgrade";
  saveFile.battery.energy = saveFile.battery.energy.sub(getBatteryUpgCost(x))
  saveFile.battery.upgrades[x] = saveFile.battery.upgrades[x].add(1)
  updateBatteryUpgrades()
}

function automateBattery() {
  for (i in saveFile.battery.upgrades) {
    buyBatteryUpg(i)
  }
}

const BATTERY_UPG_DESCS = {
  0: function() { return "Battery Energy effect is "+format(getBatteryUpgEffect(1, 0).sub(1).times(100))+"% > "+format(getBatteryUpgEffect(1, 1).sub(1).times(100))+"% stronger.<br>Level: "+saveFile.battery.upgrades[0]+"<br>Cost: "+format(getBatteryUpgCost(0))+" Battery Energy" },
  1: function() { return "Battery Fluid effect is "+format(getBatteryUpgEffect(2, 0).sub(1).times(100))+"% > "+format(getBatteryUpgEffect(2, 1).sub(1).times(100))+"% stronger.<br>Level: "+saveFile.battery.upgrades[1]+"<br>Cost: "+format(getBatteryUpgCost(1))+" Battery Energy" },
  2: function() { return "Battery speed is "+format(getBatteryUpgEffect(3, 0).sub(1).times(100))+"% > "+format(getBatteryUpgEffect(3, 1).sub(1).times(100))+"% faster.<br>Level: "+saveFile.battery.upgrades[2]+"<br>Cost: "+format(getBatteryUpgCost(2))+" Battery Energy" },
  3: function() { return "Void Upgrades are "+format(getBatteryUpgEffect(4, 0).times(100))+"% > "+format(getBatteryUpgEffect(4, 1).times(100))+"% stronger.<br>Level: "+saveFile.battery.upgrades[3]+"<br>Cost: "+format(getBatteryUpgCost(3))+" Battery Energy" },
  4: function() { return "Purple Photons are "+format(getBatteryUpgEffect(5, 0).sub(1).times(100))+"% > "+format(getBatteryUpgEffect(5, 1).sub(1).times(100))+"% stronger.<br>Level: "+saveFile.battery.upgrades[4]+"<br>Cost: "+format(getBatteryUpgCost(4))+" Battery Energy" },
  5: function() { return "Duplicator Food is "+format(getBatteryUpgEffect(6, 0))+"x > "+format(getBatteryUpgEffect(6, 1))+"x cheaper.<br>Level: "+saveFile.battery.upgrades[5]+"<br>Cost: "+format(getBatteryUpgCost(5))+" Battery Energy" },
  6: function() { return "The previous Battery Upgrades are "+format(getBatteryUpgEffect(7, 0))+"x > "+format(getBatteryUpgEffect(7, 1))+"x cheaper.<br>Level: "+saveFile.battery.upgrades[6]+"<br>Cost: "+format(getBatteryUpgCost(6))+" Battery Energy" },
  7: function() { return "Battery Fluid gain is "+format(getBatteryUpgEffect(8, 0).sub(1).times(100))+"% > "+format(getBatteryUpgEffect(8, 1).sub(1).times(100))+"% faster.<br>Level: "+saveFile.battery.upgrades[7]+"<br>Cost: "+format(getBatteryUpgCost(7))+" Battery Energy" },
  8: function() { return "Battery speed is "+format(getBatteryUpgEffect(9, 0).sub(1).times(100))+"% > "+format(getBatteryUpgEffect(9, 1).sub(1).times(100))+"% faster.<br>Level: "+saveFile.battery.upgrades[8]+"<br>Cost: "+format(getBatteryUpgCost(8))+" Battery Energy" },
  9: function() { return "Duplicator speed is "+format(getBatteryUpgEffect(10, 0).sub(1).times(100))+"% > "+format(getBatteryUpgEffect(10, 1).sub(1).times(100))+"% faster.<br>Level: "+saveFile.battery.upgrades[9]+"<br>Cost: "+format(getBatteryUpgCost(9))+" Battery Energy" },
  10: function() { return "Battery Fluid effect is "+format(getBatteryUpgEffect(11, 0).sub(1).times(100))+"% > "+format(getBatteryUpgEffect(11, 1).sub(1).times(100))+"% stronger.<br>Level: "+saveFile.battery.upgrades[10]+"<br>Cost: "+format(getBatteryUpgCost(10))+" Battery Energy" },
  11: function() { return "Duplicator Food spend speed is "+format(getBatteryUpgEffect(12, 0).sub(1).times(100))+"% > "+format(getBatteryUpgEffect(12, 1).sub(1).times(100))+"% slower.<br>Level: "+saveFile.battery.upgrades[11]+"<br>Cost: "+format(getBatteryUpgCost(11))+" Battery Energy" },
  12: function() { return "The previous Battery Upgrades are "+format(getBatteryUpgEffect(13, 0))+"x > "+format(getBatteryUpgEffect(13, 1))+"x cheaper.<br>Level: "+saveFile.battery.upgrades[12]+"<br>Cost: "+format(getBatteryUpgCost(12))+" Battery Energy" },
  13: function() { return "Battery Energy effect is "+format(getBatteryUpgEffect(14, 0).sub(1).times(100))+"% > "+format(getBatteryUpgEffect(14, 1).sub(1).times(100))+"% stronger.<br>Level: "+saveFile.battery.upgrades[13]+"<br>Cost: "+format(getBatteryUpgCost(13))+" Battery Energy" },
  14: function() { return "Add "+format(getBatteryUpgEffect(15, 0))+" > "+format(getBatteryUpgEffect(15, 1))+" to the Red Photon effect.<br>Level: "+saveFile.battery.upgrades[14]+"<br>Cost: "+format(getBatteryUpgCost(14))+" Battery Energy" },
  15: function() { return "Prestige upgrades are "+format(getBatteryUpgEffect(16, 0))+" > "+format(getBatteryUpgEffect(16, 1))+"x cheaper.<br>Level: "+saveFile.battery.upgrades[15]+"<br>Cost: "+format(getBatteryUpgCost(15))+" Battery Energy" },
}

function getBatteryUpgStuff(i) {
  return (canGetBatteryUpg(i)?"batteryUpgradesReady":"batteryUpgradesLocked")
}

function getBatteryUpgDescs() {
  let html = ""
  for (let i=0;i<saveFile.battery.upgrades.length;i++) { //my fucking god this is hard
    if (i%6==0) html += '<tr>'
    html += '<td><button class="batteryUpgradesBase '+getBatteryUpgStuff(i%saveFile.battery.upgrades.length)+'" onclick="buyBatteryUpg('+i+')">'+BATTERY_UPG_DESCS[i]()+'</button></td>'
    if (i%6==5) html += '</tr>'
  }
  return html
}

function updateBatteryUpgrades() { //Yes there's going to be an entire fucking function dedicated to updating Battery Upgrades
   if (saveFile.battery.upgrades.length > 0 || saveFile.heat.deaths.gt(0)) get("batteryUpgrades").innerHTML = getBatteryUpgDescs()
   get("batteryUpgradesUnlock").innerHTML = "Get a new Battery Upgrade<br>Req: "+format(getUnlBatteryUpgradeCost())+" Battery Fluid"
}