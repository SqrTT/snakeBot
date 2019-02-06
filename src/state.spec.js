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

            var nextState = state.playerStep(COMMANDS.DOWN)

            expect(nextState.playerScore).toEqual(-50);
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
                '☼×──>®   ☼' +
                '☼☼☼☼☼☼☼☼☼☼';
            //æ──>
            //debugger;
            var state = State.getState(board);
            var newState = state.enemyStep(COMMANDS.RIGHT, 0);

            var score = newState.newState.enemyStep(COMMANDS.UP, 0);
            expect(score.enemiesScore).toEqual(-40);
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
            var nextState = state.playerStep(COMMANDS.DOWN);
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
                '☼×──>®   ☼' +
                '☼☼☼☼☼☼☼☼☼☼';
            //æ──>
            var state = State.getState(board);
            var newState = state.enemyStep(COMMANDS.RIGHT, 0);
            var res = newState.newState.playerStep(COMMANDS.RIGHT);

            var enemyState = res.newState.enemyStep(COMMANDS.UP, 0);

            expect(enemyState.enemiesScore).toEqual(-40);
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

            var res = state.playerStep(COMMANDS.UP);

            expect(res.playerScore).toEqual(0);
            // move whole body
            expect(res.newState.player.elements[0].getX()).toEqual(2);
            expect(res.newState.player.elements[0].getY()).toEqual(7);


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
            var res = state.enemyStep(COMMANDS.DOWN, 0);

            expect(res.enemiesScore).toEqual(-50);
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


            var resPlay = state.playerStep(COMMANDS.RIGHT);
            expect(resPlay.playerScore).toEqual(-50);

            var resEnemy = state.enemyStep(COMMANDS.LEFT,0 );
            expect(resEnemy.enemiesScore).toEqual(-70);



        });


    });
});
