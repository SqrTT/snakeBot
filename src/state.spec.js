const { State } = require('./state');
const {
    COMMANDS, ELEMENT
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
            expect(state.player.elements.length).toEqual(4);
            expect(state.enemies[0].elements.length).toEqual(4);
            var nextState = state.step(COMMANDS.DOWN, COMMANDS.RIGHT, 0)

            expect(nextState.playerScore).toEqual(-State.SCORE_FOR_DEATH);
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
                '☼×──>®   ☼' +
                '☼☼☼☼☼☼☼☼☼☼';
            //æ──>
            //debugger;
            var state = State.getState(board);
            var newState = state.step(COMMANDS.RIGHT, COMMANDS.RIGHT, 0);
            var score = newState.state.step(COMMANDS.RIGHT, COMMANDS.UP, 0);
            expect(score.enemiesScore).toEqual(-State.SCORE_FOR_DEATH);
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
                '☼ ╘══►   ☼' +
                '☼  ×──♣  ☼' +
                '☼☼☼☼☼☼☼☼☼☼';
            //æ──>
            var state = State.getState(board);
            var nextState = state.step(COMMANDS.DOWN, COMMANDS.RIGHT, 0);
            expect(nextState.playerScore).toEqual(-State.SCORE_FOR_DEATH);
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
                '☼×──>®   ☼' +
                '☼☼☼☼☼☼☼☼☼☼';
            //æ──>
            var state = State.getState(board);
            var res = state.step(COMMANDS.RIGHT, COMMANDS.RIGHT, 0);
            var enemyState = res.state.step(COMMANDS.UP, COMMANDS.UP, 0);
            expect(enemyState.enemiesScore).toEqual(-State.SCORE_FOR_DEATH);
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
            expect(state.boardMatrix.length).toEqual(10);

            var res = state.step(COMMANDS.UP, COMMANDS.RIGHT, 0);

            expect(res.playerScore).toEqual(0);
            // move whole body
            expect(res.state.player.elements[0].getX()).toEqual(2);
            expect(res.state.player.elements[0].getY()).toEqual(7);


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
                '☼  ×──>  ☼' +
                '☼   ╘══► ☼' +
                '☼☼☼☼☼☼☼☼☼☼';
            //æ──>
            //debugger;
            var state = State.getState(board);
            var res = state.step(COMMANDS.RIGHT, COMMANDS.DOWN, 0);

            expect(res.enemiesScore).toEqual(State.SCORE_FOR_DEATH);
        });

        it("should find head correctly", () => {

            const board =
                '☼☼☼☼☼☼☼☼☼☼' +
                '#        ☼' +
                '☼        ☼' +
                '☼        ☼' +
                '☼        ☼' +
                "☼  ╔╕    ☼" +
                "☼  ╚╗    ☼" +
                "☼   ▼    ☼" +
                "☼   $    ☼" +
                "☼☼☼☼☼☼☼☼☼☼";

            var state = State.getState(board);
            expect(state.player.elements.length).toEqual(5);
            expect(state.player.head.type).toEqual(ELEMENT.HEAD_DOWN);
            expect(state.player.head.getX()).toEqual(4);
            expect(state.player.head.getY()).toEqual(7);
        });

        it("should find head correctly event for short size", () => {
            const board =
                '☼☼☼☼☼☼☼☼☼☼' +
                '#        ☼' +
                '☼        ☼' +
                '☼        ☼' +
                '☼        ☼' +
                '☼        ☼' +
                '☼        ☼' +
                '☼   ╘►   ☼' +
                '☼  ×──>  ☼' +
                '☼☼☼☼☼☼☼☼☼☼';

            var state = State.getState(board);
            expect(state.player.elements.length).toEqual(2);
            expect(state.player.head.type).toEqual(ELEMENT.HEAD_RIGHT);
            expect(state.player.head.getX()).toEqual(5);
            expect(state.player.head.getY()).toEqual(7);
        });

        it("should find head correctly event for short size", () => {
            const board =
                "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
                "☼☼                           ☼" +
                "☼#                           ☼" +
                "☼☼                           ☼" +
                "☼☼                 ●         ☼" +
                "☼☼                           ☼" +
                "☼☼     ☼☼☼☼☼                 ☼" +
                "☼☼     ☼                     ☼" +
                "☼#     ☼☼☼        ☼☼☼☼#  ©   ☼" +
                "☼☼     ☼          ☼   ☼  ●   ☼" +
                "☼☼     ☼☼☼☼#      ☼☼☼☼# ○   ©☼" +
                "☼☼                ☼          ☼" +
                "☼☼                ☼●●        ☼" +
                "☼☼                           ☼" +
                "☼#                           ☼" +
                "☼☼                           ☼" +
                "☼☼        ☼☼☼  ●×──┐         ☼" +
                "☼☼       ☼  ☼╔►<───┘         ☼" +
                "☼☼      ☼☼☼☼#║    ☼☼ ○ ☼#  ○ ☼" +
                "☼☼      ☼   ☼║    ☼ ☼ ☼ ☼    ☼" +
                "☼#      ☼   ☼║    ☼  ☼  ☼    ☼" +
                "☼☼          ╘╝    ☼     ☼    ☼" +
                "☼☼                ☼     ☼    ☼" +
                "☼☼                           ☼" +
                "☼☼                           ☼" +
                "☼☼                           ☼" +
                "☼#                           ☼" +
                "☼☼                           ☼" +
                "☼☼                           ☼" +
                "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼";
            var state = State.getState(board);
            expect(state.player.elements.length).toEqual(7);

            var resPlay = state.step(COMMANDS.RIGHT, COMMANDS.LEFT, 0);
            expect(resPlay.playerScore).toEqual(-State.SCORE_FOR_DEATH);
            expect(resPlay.enemiesScore).toEqual(-70);



        });


    });
});
