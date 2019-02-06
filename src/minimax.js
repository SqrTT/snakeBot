
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
function AlphaBeta(depth, isMax, state, enemyIdx, alpha, beta, scorePlayer, scoreEnemy) {

    if (depth < 1) {
        return ['NO', scorePlayer + scoreEnemy];
    } else if (isMax) {
        var playerSteps = state.player.nextSteps;

        for (var playerStepsIdx = playerSteps.length - 1; playerStepsIdx >= 0; playerStepsIdx--) {
            var emulationStep = state.playerStep(playerSteps[playerStepsIdx]);
            var next = AlphaBeta(
                depth - 1,
                !isMax,
                emulationStep.newState,
                enemyIdx,
                alpha,
                beta,
                scorePlayer + (emulationStep.playerScore * depth / 10),
                scoreEnemy
            );

            if (next[SCORE] > alpha[SCORE]) {
                alpha = [playerSteps[playerStepsIdx], next[SCORE]];
            }

            if (alpha[SCORE] >= beta[SCORE]) {
                break;
            }
        }
        return alpha;
    } else {
        if (state.enemies && state.enemies.length) {
            var enemySteps = state.enemies[enemyIdx].nextSteps;

            for (var enemyStepsIdx = enemySteps.length - 1; enemyStepsIdx >= 0; enemyStepsIdx--) {
                var enemyEmulationStep = state.enemyStep(enemySteps[enemyStepsIdx], enemyIdx);
                var next = AlphaBeta(
                    depth - 1,
                    !isMax,
                    enemyEmulationStep.newState,
                    enemyIdx,
                    alpha,
                    beta,
                    scorePlayer,
                    ((enemyEmulationStep.enemiesScore * depth / 10) - scoreEnemy)
                );

                if (next[SCORE] < beta[SCORE]) {
                    beta = [enemySteps[enemyStepsIdx], next[SCORE]];
                }

                if (alpha[SCORE] >= beta[SCORE]) {
                    break;
                }
            }
        }
        return beta;
    }
}


/**
 * @param {number} depth
 * @param {State} state
 * @param {number} enemyIdx
 *
 * @returns {[string, number]}
 */
function AlphaBetaMulti(depth, state, enemyIdx, alpha, beta, scorePlayer, scoreEnemy) {

    if (depth < 1) {
        return ['NO', scorePlayer + scoreEnemy];
    } else {
        var playerSteps = state.player.nextSteps;

        for (var playerStepsIdx = playerSteps.length - 1; playerStepsIdx >= 0; playerStepsIdx--) {
            if (state.enemies && state.enemies.length) {
                var enemySteps = state.enemies[enemyIdx].nextSteps;

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
                        (emulationStep.playerScore * depth / 10) + scorePlayer,
                        (emulationStep.enemiesScore * depth / 10 + scoreEnemy)
                    );
                    if (next[SCORE] > alpha[SCORE]) {
                        alpha = [playerSteps[playerStepsIdx], next[SCORE]];
                    }

                    if (next[SCORE] < beta[SCORE]) {
                        beta = [enemySteps[enemyStepsIdx], next[SCORE]];
                    }

                    if (alpha[SCORE] >= beta[SCORE]) {
                        break;
                    }
                }
            }
        }
        return alpha;
    }
}

exports.AlphaBetaMulti = AlphaBetaMulti;
exports.AlphaBeta = AlphaBeta;
