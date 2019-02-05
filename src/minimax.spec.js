const { State } = require('./state');
const {
    COMMANDS, ELEMENT
} = require('./constants');
const { AlphaBeta } = require('./minimax');

describe("MiniMax", () => {
    describe('Cases', () => {
        it('case1', () => {
            const board =
                '☼☼☼☼☼☼☼☼☼☼☼☼' +
                '☼          ☼' +
                '☼          ☼' +
                '☼          ☼' +
                '☼          ☼' +
                '☼          ☼' +
                '☼          ☼' +
                '☼          ☼' +
                '#          ☼' +
                '☼╘══►      ☼' +
                '☼×──>®     ☼' +
                '☼☼☼☼☼☼☼☼☼☼☼☼';
            //æ──>
            var state = State.getState(board);
            var newState = state.enemyStep(COMMANDS.RIGHT, 0)

            var res = AlphaBeta(12, true, newState.newState, 0, ['NO', -Infinity], ['NO', Infinity], 0, 0);

            expect(res[0]).toEqual(COMMANDS.UP);
        });

    });
});
