const achievementData = [
  [ // row 1: 1 achievement
    ["The first one should be free", "Begin the game", (() => true), [], 0]
  ], [ // row 2: 2 achievements
    ["Digging the hole", "Reach Prestige Depth 1", (() => saveFile.prestige.depth.gt(0)), [0], 1],
    ["Inflation begins", "Reach a size of 2 m", (() => saveFile.size.sqrt().gte(2)), [0], 2]
  ], [ // row 3: 3 achievements
    ["Finally some choices", "Unlock Prestige Upgrades", (() => saveFile.prestige.unlockedUpgrades), [1], 3],
    ["Even Deeper Now", "Reach Prestige Depth 6", (() => saveFile.prestige.depth.gte(6)), [1,2], 4],
    ["Does this number seem familiar?", "Reach a size of 3.14 m", (() => saveFile.size.sqrt().gte(3.14)), [2], 5]
  ], [ // row 4: 5 achievements
    ["Microscopic", "Unlock Quarks", (() => saveFile.quarks.unlocked), [3], 6],
    ["Not so small now, huh", "Reach a Gluon size of 20 m", (() => saveFile.quarks.gluon.sqrt().gte(20)), [3, 4], 7],
    ["Deeper than The Grand Canyon", "Reach Prestige Depth 9", (() => saveFile.prestige.depth.gte(9)), [4], 8],
    ["???", "???", (() => false), [4,5], 9], // any ideas for pre-hadrons achievements?
    ["Even bigger now", "Reach a size of ??? m", (() => saveFile.size.sqrt().gte(1/0)), [5], 10] // what size are we at pre-hadrons? hyppoh: i'll figure it out hold on
  ], // row 5 will come later, once we figure out the beginning better
]

function checkIfHavePredecessors(number, row) {
  if (achievementData[row][number][3].length==0) return true;
  let thing = 0;
  for (var i in achievementData[row][number][3]) {
    if (saveFile.achievements.includes(achievementData[row][number][3][i])) {
     thing += 1;
    }
  }
  if (thing == achievementData[row][number][3].length) {
      return true;
  } else {
    return false;
  }
}

function updateAchievementDisplay() {
  var html = ''
  for (var i in achievementData) {
    html += "<tr>"
    for (var j in achievementData[i]) {
      let hasPred = checkIfHavePredecessors(j, i);
      if (achievementData[i][j][2]() && hasPred && !saveFile.achievements.includes(achievementData[i][j][4])) {
        saveFile.achievements.push(achievementData[i][j][4])
      }
      if (hasPred || saveFile.achievements.includes(achievementData[i][j][4])) {
        html += '<td><button class="achievement'+(saveFile.achievements.includes(achievementData[i][j][4])?" gotten":"")+'" tooltip="'+achievementData[i][j][1]+'" z-index="'+(1e6+achievementData[i][j][4])+'">'+achievementData[i][j][0]+'</button></td>'
      }
    }
    html += "</tr>"
  }
  get("achievements1").innerHTML = html
  return html
}

function updateAchievements() {
}

setInterval(function() { updateAchievementDisplay() }, 2500)
