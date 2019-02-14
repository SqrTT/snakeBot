
var { State, getValAt, Snake } = require('./state');

const ANSWER = 0,
    SCORE = 1,
    COMMENT = 2;

/**
 * @param {number} depth
 * @param {State} state
 * @param {number} enemyIdx
 *
 * @returns {[string, number]}
 */
function AlphaBetaMulti(depth, state, enemyIdx, alpha, beta, score) {

    if (depth < 1) {
        return ['NO', score];
    } else {
        var playerSteps = state.player.nextSteps;

        var playerBetter = alpha;
        for (var playerStepsIdx = playerSteps.length - 1; playerStepsIdx >= 0; playerStepsIdx--) {

            var enemySteps = state.enemies[enemyIdx].nextSteps;
            var enemyBetter = ['NO', 0];;

            for (var enemyStepsIdx = enemySteps.length - 1; enemyStepsIdx >= 0; enemyStepsIdx--) {

                var emulationStep = state.step(
                    playerSteps[playerStepsIdx],
                    enemySteps[enemyStepsIdx],
                    enemyIdx
                );

                var next = AlphaBetaMulti(
                    depth - 1,
                    emulationStep.state,
                    enemyIdx,
                    alpha,
                    beta,
                    (emulationStep.score * Math.pow(depth, 2)) + score
                );

                enemyBetter = [enemySteps[enemyStepsIdx], next[SCORE] + enemyBetter[SCORE]];
            }
            if (enemyBetter[SCORE] > playerBetter[SCORE]) {
                playerBetter = [playerSteps[playerStepsIdx], enemyBetter[SCORE]];
            }

            // if (alpha[SCORE] >= beta[SCORE]) {
            //     break;
            // }

        }
        //console.table({ enem: enemyBetter, player: playerBetter });
        return playerBetter;
    }
}

exports.AlphaBetaMulti = AlphaBetaMulti;

