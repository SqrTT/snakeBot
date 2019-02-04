const { State } = require('./state');
const {
    COMMANDS
} = require('./constants');

describe("State", () => {
    describe('States Evaluation', () => {
        it("should prevent step on enemy", () => {
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
            var state = State.getState(board);
            var nextState = state.playerStep(COMMANDS.DOWN)

            expect(nextState.playerScore).toEqual(-50);
        });

        it("should prevent step on enemy", () => {
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
            var state = State.getState(board);
            var res = state.playerStep(COMMANDS.RIGHT);

            var enemyState = res.newState.enemyStep(COMMANDS.UP, 0);

            expect(enemyState.enemiesScore).toEqual(50);
        });
        it("should prevent step on enemy", () => {
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
            var state = State.getState(board);
            var res = state.playerStep(COMMANDS.UP);

            expect(res.playerScore).toEqual(0);
        });
        it("should prevent step on enemy", () => {

            const board =
            '☼☼☼☼☼☼☼☼☼☼' +
            '#        ☼' +
            '☼        ☼' +
            '☼        ☼' +
            '☼        ☼' +
            '☼        ☼' +
            '☼        ☼' +
            '☼        ☼' +
            '☼  ×──>  ☼' +
            '☼   ╘══► ☼' +
            '☼☼☼☼☼☼☼☼☼☼';
            //æ──>
            //debugger;
            var state = State.getState(board);
            var res = state.enemyStep(COMMANDS.DOWN, 0);

            expect(res.enemiesScore).toEqual(-50);
        });
        it("should find head correctly", () => {
            const board =
            "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
            "☼☼                           ☼" +
            "☼#                ®          ☼" +
            "☼☼       ●      ○   ○        ☼" +
            "☼☼        $                  ☼" +
            "☼☼          ©●               ☼" +
            "☼☼     ☼☼☼☼☼                 ☼" +
            "☼☼     ☼                     ☼" +
            "☼#     ☼☼☼        ☼☼☼☼#      ☼" +
            "☼☼     ☼          ☼   ☼      ☼" +
            "☼☼     ☼☼☼☼#      ☼☼☼☼#      ☼" +
            "☼☼                ☼  ●       ☼" +
            "☼☼      ○         ☼          ☼" +
            "☼☼®                          ☼" +
            "☼#                           ☼" +
            "☼☼                           ☼" +
            "☼☼        ☼☼☼            ●   ☼" +
            "☼☼       ☼○ ☼æ               ☼" +
            "☼☼      ☼☼☼☼#˅    ☼☼   ☼#    ☼" +
            "☼☼      ☼   ☼     ☼ ☼ ☼ ☼    ☼" +
            "☼#      ☼   ☼     ☼  ☼  ☼    ☼" +
            "☼☼                ☼     ☼    ☼" +
            "☼☼     ●          ☼    ○☼    ☼" +
            "☼☼                           ☼" +
            "☼☼                           ☼" +
            "☼☼ ○           ╔╕            ☼" +
            "☼#             ╚╗            ☼" +
            "☼☼              ▼            ☼" +
            "☼☼              $         ©  ☼" +
            "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼";

            var state = State.getState(board);
            expect(state.player.elements.length).toEqual(5);
        });

    });
});
