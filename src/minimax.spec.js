const { State } = require('./state');
const {
    COMMANDS, ELEMENT
} = require('./constants');
const { AlphaBetaMulti } = require('./minimax');

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
            // var newState = state.enemyStep(COMMANDS.RIGHT, 0);
           // debugger;
            var res = AlphaBetaMulti(6, state, 0, ['NO', -Infinity], ['NO', Infinity], 0, 0);

            expect(res[0]).toEqual(COMMANDS.UP);
        });

        it("case2", () => {
            const board =
                '☼☼☼☼☼☼☼☼☼☼' +
                '☼        ☼' +
                '☼        ☼' +
                '☼        ☼' +
                '☼        ☼' +
                '☼        ☼' +
                '#        ☼' +
                '☼ ×──♣   ☼' +
                '☼╘══►    ☼' +
                '☼☼☼☼☼☼☼☼☼☼';
            //æ──>
            //debugger;
            var state = State.getState(board);
            const move = AlphaBetaMulti(6, state, 0, ['NO', -Infinity], ['NO', Infinity], 0, 0);
            expect(move[0]).toEqual(COMMANDS.RIGHT);
        });

        it('case3', () => {
            const board = "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
                "☼☼                           ☼" +
                "☼#   ┌ö                      ☼" +
                "☼☼   ˅                       ☼" +
                "☼☼    ◄══╕                   ☼" +
                "☼☼                    ●      ☼" +
                "☼☼     ☼☼☼☼☼                 ☼" +
                "☼☼     ☼                     ☼" +
                "☼#     ☼☼☼        ☼☼☼☼#      ☼" +
                "☼☼     ☼          ☼   ☼  ●   ☼" +
                "☼☼     ☼☼☼☼#      ☼☼☼☼#      ☼" +
                "☼☼                ☼          ☼" +
                "☼☼                ☼     ©   $☼" +
                "☼☼    ●                      ☼" +
                "☼#             æ             ☼" +
                "☼☼             │             ☼" +
                "☼☼        ☼☼☼  │             ☼" +
                "☼☼       ☼  ☼  └>            ☼" +
                "☼☼      ☼☼☼☼#     ☼☼   ☼#    ☼" +
                "☼☼      ☼   ☼     ☼ ☼ ☼ ☼    ☼" +
                "☼#      ☼   ☼     ☼  ☼  ☼    ☼" +
                "☼☼       ●        ☼     ☼    ☼" +
                "☼☼                ☼     ☼$   ☼" +
                "☼☼                           ☼" +
                "☼☼    ●                    ○ ☼" +
                "☼☼                           ☼" +
                "☼#   ○                 ©     ☼" +
                "☼☼                           ☼" +
                "☼☼                       ●   ☼" +
                "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼";

                var state = State.getState(board);
                //debugger;
                const move = AlphaBetaMulti(6, state, 0, ['NO', -Infinity], ['NO', Infinity], 0, 0);
                expect(move[0]).not.toEqual(COMMANDS.LEFT);
        });

        it("should keep away form evil enemy", () => {
            const board =
                '☼☼☼☼☼☼☼☼☼☼' +
                '☼        ☼' +
                '☼        ☼' +
                '☼        ☼' +
                '☼        ☼' +
                '☼        ☼' +
                '#        ☼' +
                '☼╘══►    ☼' +
                '☼ ×──♣   ☼' +
                '☼☼☼☼☼☼☼☼☼☼';
            //æ──>
            //debugger;
            var state = State.getState(board);
            state.enemies[0].furyCount = 5;
            const move = AlphaBetaMulti(6, state, 0, ['NO', -Infinity], ['NO', Infinity], 0, 0);
            expect(move[0]).not.toEqual(COMMANDS.UP);

        });

    });
});
