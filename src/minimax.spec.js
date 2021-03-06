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
            var newState = state.step(COMMANDS.RIGHT, COMMANDS.RIGHT, 0);
            // debugger;
            var res = AlphaBetaMulti(5, newState.state, 0, ['NO', -Infinity], ['NO', Infinity], 0);

            expect(res[0]).toEqual(COMMANDS.UP);
        });

        it('self cut', () => {
            const board = "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
                "☼☼                           ☼" +
                "☼#                           ☼" +
                "☼☼                           ☼" +
                "☼☼   ©                       ☼" +
                "☼☼                           ☼" +
                "☼☼     ☼☼☼☼☼                 ☼" +
                "☼☼     ☼○                    ☼" +
                "☼#     ☼☼☼        ☼☼☼☼#      ☼" +
                "☼☼     ☼   ○  ● ○ ☼   ☼      ☼" +
                "☼☼     ☼☼☼☼#   ● ○☼☼☼☼#      ☼" +
                "☼☼                ☼          ☼" +
                "☼☼                ☼  ○       ☼" +
                "☼☼    ●                      ☼" +
                "☼#        ○           ○      ☼" +
                "☼☼                           ☼" +
                "☼☼ ×───┐  ☼☼☼                ☼" +
                "☼☼     │ ☼  ☼                ☼" +
                "☼☼     │☼☼☼☼# ○   ☼☼ ○ ☼#    ☼" +
                "☼☼     │☼   ☼     ☼ ☼ ☼ ☼    ☼" +
                "☼#     │☼   ☼     ☼  ☼  ☼    ☼" +
                "☼☼     └┐         ☼○    ☼    ☼" +
                "☼☼     ●│         ☼     ☼    ☼" +
                "☼☼      ˅     ©    ●         ☼" +
                "☼☼   ╓  ®                    ☼" +
                "☼☼▲╔╗║         ●     ○       ☼" +
                "☼#╚╝║║   ●                   ☼" +
                "☼☼  ║║              ○      ○ ☼" +
                "☼☼  ╚╝                      ○☼" +
                "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼";

            var state = State.getState(board);
            var res = AlphaBetaMulti(4, state, 0, ['NO', -Infinity], ['NO', Infinity], 0);

            expect(res[0]).toEqual(COMMANDS.UP);

        })

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
            const move = AlphaBetaMulti(1, state, 0, ['NO', -Infinity], ['NO', Infinity], 0);
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
            const move = AlphaBetaMulti(6, state, 0, ['NO', -Infinity], ['NO', Infinity], 0);
            expect(move[0]).not.toEqual(COMMANDS.LEFT);
        });
        it('case33', () => {
            const board = "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
                "☼☼         ○                 ☼" +
                "☼#      ○                    ☼" +
                "☼☼       ●                   ☼" +
                "☼☼                      ○    ☼" +
                "☼☼           ●               ☼" +
                "☼☼┌──┐ ☼☼☼☼☼                 ☼" +
                "☼☼└─>¤ ☼                     ☼" +
                "☼#  ╔► ☼☼☼        ☼☼☼☼#      ☼" +
                "☼☼  ║  ☼          ☼ ○ ☼  ●   ☼" +
                "☼☼  ╙  ☼☼☼☼#      ☼☼☼☼#      ☼" +
                "☼☼                ☼   ●      ☼" +
                "☼☼                ☼         $☼" +
                "☼☼    ●                      ☼" +
                "☼#                    ○      ☼" +
                "☼☼                           ☼" +
                "☼☼        ☼☼☼                ☼" +
                "☼☼       ☼  ☼                ☼" +
                "☼☼      ☼☼☼☼#     ☼☼   ☼#    ☼" +
                "☼☼      ☼   ☼   ● ☼ ☼ ☼ ☼ ○○ ☼" +
                "☼#$     ☼   ☼     ☼  ☼  ☼    ☼" +
                "☼☼                ☼     ☼    ☼" +
                "☼☼     ●          ☼     ☼    ☼" +
                "☼☼   ○                       ☼" +
                "☼☼                  ○      ○ ☼" +
                "☼☼ ●           ●         ○   ☼" +
                "☼#                           ☼" +
                "☼☼               ○    ○      ☼" +
                "☼☼○           ○              ☼" +
                "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼";

            var state = State.getState(board);
            expect(state.enemies[0].elements.length).toEqual(8);

            const move = AlphaBetaMulti(5, state, 0, ['NO', -Infinity], ['NO', Infinity], 0);
            expect(move[0]).not.toEqual(COMMANDS.UP);
        });

        it('count on growing tail', () => {
            const board = "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
                "☼☼         ○                 ☼" +
                "☼#         ˄                 ☼" +
                "☼☼       ● │       ○         ☼" +
                "☼☼       ▲×┘          ○ ○    ☼" +
                "☼☼      ╘╝   ●    ○          ☼" +
                "☼☼     ☼☼☼☼☼                 ☼" +
                "☼☼     ☼          ●          ☼" +
                "☼#     ☼☼☼     ○  ☼☼☼☼#      ☼" +
                "☼☼     ☼          ☼   ☼  ●   ☼" +
                "☼☼     ☼☼☼☼#      ☼☼☼☼#      ☼" +
                "☼☼                ☼          ☼" +
                "☼☼                ☼         $☼" +
                "☼☼    ●  ○              ®    ☼" +
                "☼#             ○      ○      ☼" +
                "☼☼           ○               ☼" +
                "☼☼        ☼☼☼                ☼" +
                "☼☼   ○   ☼  ☼                ☼" +
                "☼☼      ☼☼☼☼#     ☼☼   ☼#    ☼" +
                "☼☼      ☼   ☼   ● ☼ ☼ ☼ ☼ ○  ☼" +
                "☼#      ☼   ☼     ☼  ☼  ☼    ☼" +
                "☼☼                ☼     ☼    ☼" +
                "☼☼     ●          ☼     ☼  ● ☼" +
                "☼☼                           ☼" +
                "☼☼                  ○        ☼" +
                "☼☼ ○    ○    ○ ●         ○   ☼" +
                "☼#                           ☼" +
                "☼☼               ○           ☼" +
                "☼☼                           ☼" +
                "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼";

            var state = State.getState(board);
            expect(state.enemies[0].elements.length).toEqual(4);

            const move = AlphaBetaMulti(5, state, 0, ['NO', -Infinity], ['NO', Infinity], 0);
            expect(move[0]).not.toEqual(COMMANDS.RIGHT);
        })

        it('cut tail', () => {
            const board = "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
                "☼☼                         ○ ☼" +
                "☼#                           ☼" +
                "☼☼                           ☼" +
                "☼☼               æ           ☼" +
                "☼☼            ○  └─────────> ☼" +
                "☼☼     ☼☼☼☼☼     ○          $☼" +
                "☼☼    ©☼                     ☼" +
                "☼#     ☼☼☼        ☼☼☼☼#      ☼" +
                "☼☼     ☼          ☼   ☼  ●   ☼" +
                "☼☼     ☼☼☼☼#      ☼☼☼☼#◄╗    ☼" +
                "☼☼                ☼    ╔╝    ☼" +
                "☼☼     ○○         ☼    ║     ☼" +
                "☼☼    ●  ○             ║     ☼" +
                "☼#○                 ●  ║     ☼" +
                "☼☼                     ║     ☼" +
                "☼☼©      ○☼☼☼       ╘══╝     ☼" +
                "☼☼       ☼ ○☼               ○☼" +
                "☼☼      ☼☼☼☼#  ●  ☼☼   ☼# ○  ☼" +
                "☼☼      ☼   ☼   ● ☼ ☼ ☼ ☼○   ☼" +
                "☼#      ☼   ☼●    ☼  ☼  ☼    ☼" +
                "☼☼           ●    ☼     ☼®   ☼" +
                "☼☼   ○            ☼     ☼    ☼" +
                "☼☼                           ☼" +
                "☼☼                           ☼" +
                "☼☼                           ☼" +
                "☼#            ○              ☼" +
                "☼☼                           ☼" +
                "☼☼                         ● ☼" +
                "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼";
            var state = State.getState(board);

            const move = AlphaBetaMulti(4, state, 0, ['NO', -Infinity], ['NO', Infinity], 0);
            expect(move[0]).not.toEqual(COMMANDS.DOWN);
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
            ///debugger;
            const move = AlphaBetaMulti(4, state, 0, ['NO', -Infinity], ['NO', Infinity], 0);
            expect(move[0]).toEqual(COMMANDS.UP);

        });

        it('skips fury if danger', () => {
            const board = "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
                "☼☼                           ☼" +
                "☼#                           ☼" +
                "☼☼       ●                   ☼" +
                "☼☼ $                         ☼" +
                "☼☼           ●    ○  ○       ☼" +
                "☼☼     ☼☼☼☼☼                 ☼" +
                "☼☼     ☼                     ☼" +
                "☼#     ☼☼☼        ☼☼☼☼#      ☼" +
                "☼☼     ☼          ☼   ☼  ●   ☼" +
                "☼☼     ☼☼☼☼#     ○☼☼☼☼#      ☼" +
                "☼☼          $     ☼○         ☼" +
                "☼☼                ☼    ○    $☼" +
                "☼☼    ●                      ☼" +
                "☼#            æ       ○      ☼" +
                "☼☼            │              ☼" +
                "☼☼    ○   ☼☼☼ │○             ☼" +
                "☼☼       ☼  ☼ │              ☼" +
                "☼☼      ☼☼☼☼#╓│   ☼☼   ☼#    ☼" +
                "☼☼      ☼   ☼║│ ● ☼ ☼ ☼ ☼ ○  ☼" +
                "☼#    ○ ☼   ☼║│   ☼  ☼© ☼    ☼" +
                "☼☼           ║│○  ☼     ☼    ☼" +
                "☼☼     ●     ║│   ☼     ☼    ☼" +
                "☼☼ ○©        ║˅      ●○    ○ ☼" +
                "☼☼           ▼®     ○        ☼" +
                "☼☼             ●$    ○   ○   ☼" +
                "☼#   ○                       ☼" +
                "☼☼               ○          ○☼" +
                "☼☼                           ☼" +
                "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼";

            var state = State.getState(board);

            ///debugger;
            const move = AlphaBetaMulti(5, state, 0, ['NO', -Infinity], ['NO', Infinity], 0);
            expect(move[0]).not.toEqual(COMMANDS.RIGHT);
        })

        it('wired case111', () => {
            const board = "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
                "☼☼                           ☼" +
                "☼#                           ☼" +
                "☼☼       ●                   ☼" +
                "☼☼        ®                  ☼" +
                "☼☼           ●               ☼" +
                "☼☼     ☼☼☼☼☼                 ☼" +
                "☼☼     ☼                 ○   ☼" +
                "☼# ○●  ☼☼☼        ☼☼☼☼#     ○☼" +
                "☼☼     ☼          ☼   ☼  ●   ☼" +
                "☼☼     ☼☼☼☼#      ☼☼☼☼#      ☼" +
                "☼☼                ☼    ○     ☼" +
                "☼☼                ☼          ☼" +
                "☼☼    ●                      ☼" +
                "☼#           æ               ☼" +
                "☼☼           │               ☼" +
                "☼☼        ☼☼☼│               ☼" +
                "☼☼       ☼○ ☼│        ●      ☼" +
                "☼☼    ® ☼☼☼☼#│┌─> ☼☼   ☼#    ☼" +
                "☼☼      ☼   ☼││ ● ☼ ☼ ☼ ☼    ☼" +
                "☼#      ☼   ☼││ ╔►☼  ☼  ☼    ☼" +
                "☼☼           ││╓║ ☼     ☼    ☼" +
                "☼☼     ●     ││║║ ☼     ☼    ☼" +
                "☼☼           ││║╚╗           ☼" +
                "☼☼      ●    ││║ ║         $ ☼" +
                "☼☼           ││║ ║           ☼" +
                "☼#○          ││║ ║           ☼" +
                "☼☼           └┘║ ║           ☼" +
                "☼☼             ╚═╝           ☼" +
                "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼"
            var state = State.getState(board);

            ///debugger;
            const move = AlphaBetaMulti(3, state, 0, ['NO', -Infinity], ['NO', Infinity], 0);
            expect(move[0]).not.toEqual(COMMANDS.UP);
        })
        it('dont eat apply if danger', () => {
            const board = "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
                "☼☼       ○                   ☼" +
                "☼#                           ☼" +
                "☼☼       ●    ○○             ☼" +
                "☼☼                        ●○ ☼" +
                "☼☼           ●            ○  ☼" +
                "☼☼    ○☼☼☼☼☼             ○   ☼" +
                "☼☼     ☼       ●             ☼" +
                "☼#○○○○ ☼☼☼        ☼☼☼☼#      ☼" +
                "☼☼     ☼          ☼   ☼  ●   ☼" +
                "☼☼     ☼☼☼☼#      ☼☼☼☼#      ☼" +
                "☼☼   ○        ○   ☼          ☼" +
                "☼☼              ○ ☼         ●☼" +
                "☼☼    ●  ○                   ☼" +
                "☼#            ®              ☼" +
                "☼☼    ▲○  ○                  ☼" +
                "☼☼    ║˄  ☼☼☼                ☼" +
                "☼☼   ╔╝│ ☼  ☼                ☼" +
                "☼☼○  ║ │☼☼☼☼#     ☼☼   ☼#    ☼" +
                "☼☼   ╙ │☼   ☼   ● ☼ ☼ ☼ ☼    ☼" +
                "☼#     │☼   ☼     ☼  ☼  ☼    ☼" +
                "☼☼     └┐┌┐       ☼     ☼    ☼" +
                "☼☼     ●└┘│       ☼     ☼    ☼" +
                "☼☼        │     ●            ☼" +
                "☼☼        │           ○      ☼" +
                "☼☼        └┐                 ☼" +
                "☼#         │                 ☼" +
                "☼☼         │             $   ☼" +
                "☼☼         ¤                 ☼" +
                "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼";

            var state = State.getState(board);

            const move = AlphaBetaMulti(5, state, 0, ['NO', -Infinity], ['NO', Infinity], 0);
            expect(move[0]).not.toEqual(COMMANDS.RIGHT);
        })

        it('should not kill isteslf in enemyes tail', () => {
            const board = "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
                "☼☼○        ○               ○ ☼" +
                "☼#○                          ☼" +
                "☼☼       ●                   ☼" +
                "☼☼                           ☼" +
                "☼☼           ●               ☼" +
                "☼☼     ☼☼☼☼☼                 ☼" +
                "☼☼     ☼                     ☼" +
                "☼#     ☼☼☼        ☼☼☼☼#      ☼" +
                "☼☼     ☼          ☼   ☼  ●   ☼" +
                "☼☼    ©☼☼☼☼#      ☼☼☼☼#      ☼" +
                "☼☼                ☼ ○        ☼" +
                "☼☼                ☼  ●       ☼" +
                "☼☼    ●                      ☼" +
                "☼#                           ☼" +
                "☼☼                 ©         ☼" +
                "☼☼  ○     ☼☼☼                ☼" +
                "☼☼       ☼  ☼         ╘═════╗☼" +
                "☼☼      ☼☼☼☼#     ☼☼   ☼# ◄═╝☼" +
                "☼☼   ®  ☼ ● ☼   ● ☼ ☼ ☼ ☼ ┌─┐☼" +
                "☼#      ☼   ☼     ☼  ☼  ☼ │ │☼" +
                "☼☼                ☼     ☼ ¤ │☼" +
                "☼☼     ●       ○  ☼     ☼   │☼" +
                "☼☼                         ●│☼" +
                "☼☼                          │☼" +
                "☼☼ ○  $ ○      ●            ˅☼" +
                "☼#  ○                        ☼" +
                "☼☼ ○         ○   ○           ☼" +
                "☼☼   ○       ®               ☼" +
                "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼";
            var state = State.getState(board);

            const move = AlphaBetaMulti(5, state, 0, ['NO', -Infinity], ['NO', Infinity], 0);
            expect(move[0]).not.toEqual(COMMANDS.DOWN);

        })

        it('avoid evil enemy', () => {
            const board = "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
                "☼☼         ○                 ☼" +
                "☼#                           ☼" +
                "☼☼       ●         ○         ☼" +
                "☼☼                      ○    ☼" +
                "☼☼           ●    ○          ☼" +
                "☼☼     ☼☼☼☼☼                 ☼" +
                "☼☼     ☼                     ☼" +
                "☼#     ☼☼☼        ☼☼☼☼#      ☼" +
                "☼☼     ☼          ☼   ☼  ●   ☼" +
                "☼☼     ☼☼☼☼#      ☼☼☼☼#      ☼" +
                "☼☼                ☼          ☼" +
                "☼☼○               ☼         $☼" +
                "☼☼    ●  ○                   ☼" +
                "☼#          ●  ○      ○      ☼" +
                "☼☼           ○               ☼" +
                "☼☼        ☼☼☼                ☼" +
                "☼☼   ○   ☼  ☼                ☼" +
                "☼☼      ☼☼☼☼#×┐   ☼☼   ☼#    ☼" +
                "☼☼      ☼   ☼ ♣ ● ☼ ☼ ☼ ☼    ☼" +
                "☼#      ☼   ☼   ▲ ☼  ☼  ☼    ☼" +
                "☼☼              ║ ☼    ®☼    ☼" +
                "☼☼     ●        ║ ☼     ☼    ☼" +
                "☼☼              ║            ☼" +
                "☼☼              ╙            ☼" +
                "☼☼ ○    ○      ●             ☼" +
                "☼#                           ☼" +
                "☼☼               ○           ☼" +
                "☼☼                           ☼" +
                "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼";

            var state = State.getState(board);
            state.enemies[0].furyCount = 5;

            const move = AlphaBetaMulti(5, state, 0, ['NO', -Infinity], ['NO', Infinity], 0);
            expect(move[0]).toEqual(COMMANDS.RIGHT);
        })
        it('small enemy is still danger', () => {
            const board = "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
                "☼☼         ○                 ☼" +
                "☼#                           ☼" +
                "☼☼    ©$ ●                ○  ☼" +
                "☼☼                           ☼" +
                "☼☼           ●    ○          ☼" +
                "☼☼     ☼☼☼☼☼     ○          ○☼" +
                "☼☼     ☼ ©              ╓    ☼" +
                "☼#     ☼☼☼     ○  ☼☼☼☼# ║    ☼" +
                "☼☼     ☼          ☼   ☼ ║●   ☼" +
                "☼☼     ☼☼☼☼#      ☼☼☼☼#╔╝    ☼" +
                "☼☼                ☼    ║     ☼" +
                "☼☼           ○    ☼    ║     ☼" +
                "☼☼    ●                ║     ☼" +
                "☼#  ○        ○       ╔═╝     ☼" +
                "☼☼                   ▼       ☼" +
                "☼☼        ☼☼☼       ┌┐       ☼" +
                "☼☼       ☼  ☼  ○    │└ö      ☼" +
                "☼☼      ☼☼☼☼#     ☼☼˅  ☼# ○  ☼" +
                "☼☼      ☼   ☼   ● ☼ ☼ ☼ ☼○○  ☼" +
                "☼#      ☼   ☼     ☼ ®☼  ☼    ☼" +
                "☼☼       ○        ☼     ☼    ☼" +
                "☼☼     ●          ☼     ☼    ☼" +
                "☼☼                           ☼" +
                "☼☼                  ○     ○  ☼" +
                "☼☼ ○    ○      ●         ○   ☼" +
                "☼#                           ☼" +
                "☼☼               ○           ☼" +
                "☼☼                           ☼" +
                "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼";

                var state = State.getState(board);


                const move = AlphaBetaMulti(5, state, 0, ['NO', -Infinity], ['NO', Infinity], 0);
                expect(move[0]).not.toEqual(COMMANDS.DOWN);
        })

    });
});
