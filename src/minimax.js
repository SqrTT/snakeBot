
var { State, getValAt } = require('./state');

const ANSWER = 0,
SCORE = 1,
COMMENT = 2;

function getMax(a, b) {
    return a[SCORE] > b[SCORE] ? a : b;
}
function getMin(a, b) {
    return a[SCORE] < b[SCORE] ? a : b;
}



/**
 *
 * @param {number} depth
 * @param {State} state
 * @param {number} alpha
 * @param {number} boardSize
 * @param {number} beta
 * @param {number} score
 * @returns {[string, number, string]}
 */
function minimax(depth, state, boardSize, alpha, beta, score) {
    minimaxCounter++;
    if (depth < 1 || minimaxCounter > 1000000) {
        return [COMMANDS.RIGHT, score, 'END'];
    } else if (!state.player.isDead) {
        var betterChoice = [COMMANDS.RIGHT, -Infinity, 'DEFAULT']

        for (var playerActionIDX = state.player.nextSteps.length - 1; playerActionIDX >= 0; --playerActionIDX) {
            var playerAction = state.player.nextSteps[playerActionIDX];
            var enemiesCount = state.enemies.length;

            if (true) {
                var result = evaluateMove(state, playerAction, [], depth, boardSize, alpha, beta, score);
                if (alpha < result[SCORE]) {
                    return result;
                }
                betterChoice = getMax(betterChoice, result);
            } else if (enemiesCount === 1) {
                var enemy1Steps = state.enemies[0].nextSteps;
                for (var enemyStepIdx1 = enemy1Steps.length - 1; enemyStepIdx1 >= 0; enemyStepIdx1--) {
                    var enemyAction1 = enemy1Steps[enemyStepIdx1];

                    var result = evaluateMove(state, playerAction, [enemyAction1], depth, boardSize, alpha, beta, score);
                    if (alpha < result[SCORE]) {
                        return result;
                    }
                    betterChoice = getMax(betterChoice, result);

                }
            } else if (enemiesCount === 2) {
                var enemy1Steps = state.enemies[0].nextSteps;
                for (var enemyStepIdx1 = enemy1Steps.length - 1; enemyStepIdx1 >= 0; enemyStepIdx1--) {
                    var enemyAction1 = enemy1Steps[enemyStepIdx1];

                    var enemy2Steps = state.enemies[1].nextSteps;
                    for (var enemyStepIdx2 = enemy2Steps.length - 1; enemyStepIdx2 >= 0; enemyStepIdx2--) {
                        var enemyAction2 = enemy2Steps[enemyStepIdx2];

                        var result = evaluateMove(state, playerAction, [enemyAction1, enemyAction2], depth, boardSize, alpha, beta, score);
                        if (alpha < result[SCORE]) {
                            return result;
                        }
                        betterChoice = getMax(betterChoice, result);
                    }

                }
            } else if (enemiesCount === 3) {
                var enemy1Steps = state.enemies[0].nextSteps;enemiesCount
                for (var enemyStepIdx1 = enemy1Steps.length - 1; enemyStepIdx1 >= 0; enemyStepIdx1--) {
                    var enemyAction1 = enemy1Steps[enemyStepIdx1];

                    var enemy2Steps = state.enemies[1].nextSteps;
                    for (var enemyStepIdx2 = enemy2Steps.length - 1; enemyStepIdx2 >= 0; enemyStepIdx2--) {
                        var enemyAction2 = enemy2Steps[enemyStepIdx2];

                        var enemy3Steps = state.enemies[2].nextSteps;
                        for (var enemyStepIdx3 = enemy3Steps.length - 1; enemyStepIdx3 >= 0; enemyStepIdx3--) {
                            var enemyAction3 = enemy3Steps[enemyStepIdx3];

                            var result = evaluateMove(state, playerAction, [enemyAction1, enemyAction2, enemyAction3], depth, boardSize, alpha, beta, score);
                            if (alpha < result[SCORE]) {
                                return result;
                            }
                            betterChoice = getMax(betterChoice, result);

                        }
                    }

                }
            } else if (enemiesCount === 4) {
                var enemy1Steps = state.enemies[0].nextSteps;
                for (var enemyStepIdx1 = enemy1Steps.length - 1; enemyStepIdx1 >= 0; enemyStepIdx1--) {
                    var enemyAction1 = enemy1Steps[enemyStepIdx1];

                    var enemy2Steps = state.enemies[1].nextSteps;
                    for (var enemyStepIdx2 = enemy2Steps.length - 1; enemyStepIdx2 >= 0; enemyStepIdx2--) {
                        var enemyAction2 = enemy2Steps[enemyStepIdx2];

                        var enemy3Steps = state.enemies[2].nextSteps;
                        for (var enemyStepIdx3 = enemy3Steps.length - 1; enemyStepIdx3 >= 0; enemyStepIdx3--) {
                            var enemyAction3 = enemy3Steps[enemyStepIdx3];

                            var enemy4Steps = state.enemies[3].nextSteps;
                            for (var enemyStepIdx4 = enemy4Steps.length - 1; enemyStepIdx4 >= 0; enemyStepIdx4--) {
                                var enemyAction4 = enemy4Steps[enemyStepIdx4];

                                var result = evaluateMove(state, playerAction, [enemyAction1, enemyAction2, enemyAction3, enemyAction4], depth, boardSize, alpha, beta, score);
                                if (alpha < result[SCORE]) {
                                    return result;
                                }
                                betterChoice = getMax(betterChoice, result);

                            }

                        }
                    }
                }
            }
        }
        return betterChoice;
    } else {
        return [COMMANDS.RIGHT, 0, 'NO Player'];
    }
}

/**
 *
 * @param {State} state
 * @param {string} playerAction
 * @param {string[]} enemyActions
 * @param {number} depth
 * @param {number} boardSize
 * @param {number} alpha
 * @param {number} beta
 * @param {number} score
 */
function evaluateMove(state, playerAction, enemyActions, depth, boardSize, alpha, beta, score) {
    var emulatedStep = state.step(playerAction, enemyActions);

    score = score + emulatedStep.playerScore;

    var emulatesLength = emulatedStep.enemiesScores.length;
    for (var scoreIdx = 0; emulatesLength < scoreIdx; scoreIdx++) {
        score = score + emulatedStep.enemiesScores[scoreIdx];
    }
    if (score < alpha && beta < score) {
        var value = minimax(depth - 1, emulatedStep.state, boardSize, alpha, beta, score);
        value[ANSWER] = playerAction;
        value[SCORE] = value[SCORE] / 1.1;
        return value;
    } else {
        return [playerAction, score, 'early hit'];
    }
}

