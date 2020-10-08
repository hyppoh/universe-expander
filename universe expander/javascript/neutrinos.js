const TOOLTIPS = { // use const so it doesn't get redefined by accident
  0: () => ("All production ^"+getNeutrinoChallengeNerf(1)+"."),
  1: () => ("All production ^"+getNeutrinoChallengeNerf(1)+"."),
  2: () => ("All production ^"+getNeutrinoChallengeNerf(1)+"."),
  3: () => ("All production ^"+getNeutrinoChallengeNerf(1)+"."),
  4: () => ("All production ^"+getNeutrinoChallengeNerf(1)+"."),
  5: () => ("All production ^"+getNeutrinoChallengeNerf(1)+"."),
  6: () => ("All production ^"+getNeutrinoChallengeNerf(1)+"."),
}

function unlockNeutrinos() {
  if (saveFile.neutrinos.unlocked) return
  if (saveFile.heat.deaths.lt(5)) return
  saveFile.neutrinos.unlocked = true;
}

function getNeutrinoChallengeNerf(number) {
  switch(number) {
    case 1:
      return OmegaNum.pow(0.8, saveFile.neutrinos.challenges[1].max(1).cbrt())
  }
}

function updateNeutrinoChallenges() {
  for (var i in saveFile.neutrinos.challenges) {
    let stuff = ["1", "2", "3", "4", "5", "6"]
    get("neutChall"+stuff[i]).tooltip = TOOLTIPS[i]()
  }
}

function updateNeutrinos(diff) {
  get("neutrinoUnl").style.display = saveFile.neutrinos.unlocked?"none":""
  get("neutrinotabbtn").style.display = saveFile.neutrinos.unlocked?"":"none"
  updateNeutrinoChallenges()
}