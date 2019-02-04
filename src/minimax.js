
var { State, getValAt, Snake } = require('./state');

const ANSWER = 0,
    SCORE = 1,
    COMMENT = 2;



/**
 * @param {number} depth
 * @param {State} state
 * @param {numner} enemyIdx
 *
 * @returns {[string, number]}
 */
function AlphaBeta(depth, isMax, state, enemyIdx, alpha, beta, scorePlayer, scoreEnemy) {

    if (depth < 1) {
        return ['NO', scorePlayer + scoreEnemy];
    } else if (isMax) {
        var playerSteps = state.player.nextSteps;

        for (var playerStepsIdx = playerSteps.length - 1; playerStepsIdx >= 0; playerStepsIdx--) {
            var emulationStep = state.playerStep(playerSteps[playerStepsIdx]);
            var next = AlphaBeta(depth - 1, !isMax, emulationStep.newState, enemyIdx, alpha, beta, scorePlayer + emulationStep.playerScore, scoreEnemy);

            if (next[SCORE] > alpha[SCORE]) {
                alpha = [playerSteps[playerStepsIdx], next[SCORE]];
            }

            if (alpha[SCORE] >= beta[SCORE]) {
                break;
            }
        }
        return alpha;
    } else {
        var enemySteps = state.enemies[enemyIdx].nextSteps;
        for (var enemyStepsIdx = enemySteps.length - 1; enemyStepsIdx >= 0; enemyStepsIdx--) {
            var enemyEmulationStep = state.enemyStep(enemySteps[enemyStepsIdx], enemyIdx);
            var next = AlphaBeta(depth - 1, !isMax, enemyEmulationStep.newState, enemyIdx, alpha, beta, scorePlayer, enemyEmulationStep.enemiesScore - scoreEnemy);

            if (next[SCORE] < beta[SCORE]) {
                beta = [enemySteps[enemyStepsIdx], next[SCORE]];
            }

            if (alpha[SCORE] >= beta[SCORE]) {
                break;
            }
        }
        return beta;
    }
}

exports.AlphaBeta = AlphaBeta;
