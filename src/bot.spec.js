
const {
    getNextSnakeMove, resetState
} = require('./bot');
const {
    COMMANDS
} = require('./constants');
const mockLogger = (a) => {
    // console.log(a);
};

describe("bot", () => {
    describe('ENEMIES', () => {
        beforeEach(() => {
            resetState();
        })
        it("should avoid enemy potential step", () => {
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
            //æ──>
            //debugger;
            const move = getNextSnakeMove(board, mockLogger);
            expect(move).not.toEqual(COMMANDS.RIGHT);
        });
        it("should attack enemy close path", () => {
            const board =
                '☼☼☼☼☼☼☼☼☼☼' +
                '☼        ☼' +
                '☼        ☼' +
                '☼        ☼' +
                '☼        ☼' +
                '☼        ☼' +
                '#        ☼' +
                '☼  ╘══►  ☼' +
                '☼×──>    ☼' +
                '☼☼☼☼☼☼☼☼☼☼';
            //æ──>
            const move = getNextSnakeMove(board, mockLogger);
            expect(move).not.toEqual(COMMANDS.UP);
        });

        it("should attack enemy close path #2", () => {
            const board =
                '☼☼☼☼☼☼☼☼☼☼' +
                '☼        ☼' +
                '☼        ☼' +
                '☼        ☼' +
                '☼        ☼' +
                '#        ☼' +
                '☼  ╘══►  ☼' +
                '☼        ☼' +
                '☼×──>    ☼' +
                '☼☼☼☼☼☼☼☼☼☼';
            //æ──>
            const move = getNextSnakeMove(board, mockLogger);
            expect(move).toEqual(COMMANDS.DOWN);
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
            const move = getNextSnakeMove(board, mockLogger);
            expect(move).toEqual(COMMANDS.UP);
        });

        it("should not kill itself", () => {
            const board =
                '☼☼☼☼☼☼☼☼☼☼' +
                '☼        ☼' +
                '☼        ☼' +
                '☼        ☼' +
                '☼        ☼' +
                '☼        ☼' +
                '#        ☼' +
                '☼ ×──>   ☼' +
                '☼╘══►    ☼' +
                '☼☼☼☼☼☼☼☼☼☼';
            //æ──>
            //debugger;
            const move = getNextSnakeMove(board, mockLogger);
            expect(move).toEqual(COMMANDS.RIGHT);
        });

        it("should not kill itself", () => {
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
            const move = getNextSnakeMove(board, mockLogger);
            expect(move).toEqual(COMMANDS.RIGHT);
        });


        it("should not kill itself #2", () => {
            const board = "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
                "☼☼                           ☼" +
                "☼#             ○             ☼" +
                "☼☼       ●                   ☼" +
                "☼☼                           ☼" +
                "☼☼           ●     ○         ☼" +
                "☼☼     ☼☼☼☼☼                 ☼" +
                "☼☼     ☼              ●      ☼" +
                "☼#     ☼☼☼        ☼☼☼☼#      ☼" +
                "☼☼    $☼          ☼   ☼  ●   ☼" +
                "☼☼     ☼☼☼☼#      ☼☼☼☼#      ☼" +
                "☼☼                ☼          ☼" +
                "☼☼                ☼          ☼" +
                "☼☼   ○●                      ☼" +
                "☼#                           ☼" +
                "☼☼                           ☼" +
                "☼☼        ☼☼☼                ☼" +
                "☼☼       ☼  ☼           ○    ☼" +
                "☼☼      ☼☼☼☼#     ☼☼   ☼#    ☼" +
                "☼☼      ☼   ☼   ● ☼ ☼ ☼ ☼    ☼" +
                "☼#      ☼   ☼     ☼  ☼  ☼    ☼" +
                "☼☼   ●            ☼     ☼    ☼" +
                "☼☼     ●          ☼     ☼    ☼" +
                "☼☼                       ©   ☼" +
                "☼☼                  ┌┐       ☼" +
                "☼☼ ○    ○           ¤└┐      ☼" +
                "☼#                   ●└─┐    ☼" +
                "☼☼                      └> ▲ ☼" +
                "☼☼                     ╘═══╝ ☼" +
                "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼"
            //æ──>
            // debugger;
            const move = getNextSnakeMove(board, mockLogger);
            expect(move).not.toEqual(COMMANDS.LEFT);
        });

        it("should attack enemy in fury", () => {
            const board =
                '☼☼☼☼☼☼☼☼☼☼' +
                '☼        ☼' +
                '☼        ☼' +
                '☼        ☼' +
                '☼        ☼' +
                '☼        ☼' +
                '#        ☼' +
                '☼    ╘♥  ☼' +
                '☼  ×──>  ☼' +
                '☼☼☼☼☼☼☼☼☼☼';
            //æ──>

            const move = getNextSnakeMove(board, mockLogger);
            expect(move).toEqual(COMMANDS.DOWN);
        });
    })

    describe("getNextSnakeMove", () => {

        it("should define method", () => {
            expect(getNextSnakeMove).toBeDefined();
        });
        it("should avoid horizontal wall", () => {
            const board =
                '☼☼☼☼☼' +
                '#   ☼' +
                '☼   ☼' +
                '☼ ╘►☼' +
                '☼☼☼☼☼';
            const move = getNextSnakeMove(board, mockLogger);
            expect(move).toContain(COMMANDS.UP);
        });
        it("should avoid wall", () => {
            const board =
                '☼☼☼☼☼' +
                '☼ ╘►☼' +
                '☼   ☼' +
                '#   ☼' +
                '☼☼☼☼☼';

            const move = getNextSnakeMove(board, mockLogger);
            expect(move).toEqual(COMMANDS.DOWN);
        });

        it("should try to catch apples DOWN", () => {
            const board =
                '☼☼☼☼☼☼' +
                '☼ ╘► ☼' +
                '☼  ○ ☼' +
                '☼    ☼' +
                '#    ☼' +
                '☼☼☼☼☼☼';

            const move = getNextSnakeMove(board, mockLogger);
            expect(move).toEqual(COMMANDS.DOWN);
        });

        // it('strange head', () => {
        //     const board = "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼                           ☼☼#                           ☼☼☼       ●                   ☼☼☼                      ○    ☼☼☼           ●           ╘══╗☼☼☼     ☼☼☼☼☼              ╔═╝☼☼☼     ☼                  ♥  ☼☼#     ☼☼☼  ○     ☼☼☼☼#      ☼☼☼     ☼    ●     ☼   ☼  ●$  ☼☼☼     ☼☼☼☼#      ☼☼☼☼#      ☼☼☼                ☼          ☼☼☼                ☼         $☼☼☼        ●                  ☼☼#                           ☼☼☼                          ©☼☼☼        ☼☼☼                ☼☼☼       ☼○ ☼                ☼☼☼      ☼☼☼☼#     ☼☼  ©☼#    ☼☼☼      ☼   ☼  ○● ☼ ☼ ☼ ☼ ○  ☼☼#      ☼   ☼     ☼  ☼  ☼    ☼☼☼                ☼     ☼    ☼☼☼ ●              ☼    ○☼    ☼☼☼             ˄             ☼☼☼             ¤    ○        ☼☼☼                       ○   ☼☼#                           ☼☼☼               ●           ☼☼☼                           ☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼";

        //     const move = getNextSnakeMove(board, mockLogger);
        //     expect(move).toEqual(COMMANDS.DOWN);
        // })



        it("should try to catch apples UP", () => {
            const board =
                '☼☼☼☼☼☼' +
                '☼    ☼' +
                '☼  ○ ☼' +
                '☼ ╘► ☼' +
                '#    ☼' +
                '☼☼☼☼☼☼';
            const move = getNextSnakeMove(board, mockLogger);
            expect(move).toEqual(COMMANDS.UP);
        });

        it("should try to catch apples RIGHT", () => {
            const board =
                '☼☼☼☼☼☼' +
                '☼    ☼' +
                '☼ ►○ ☼' +
                '☼ ╘  ☼' +
                '#    ☼' +
                '☼☼☼☼☼☼';

            const move = getNextSnakeMove(board, mockLogger);
            expect(move).toEqual(COMMANDS.RIGHT);
        });

        it("should see 2 step ahead  RIGHT", () => {
            const board =
                '☼☼☼☼☼☼' +
                '☼    ☼' +
                '☼ ► ○☼' +
                '☼ ╘  ☼' +
                '#    ☼' +
                '☼☼☼☼☼☼';
            const move = getNextSnakeMove(board, mockLogger);
            expect(move).toEqual(COMMANDS.RIGHT);
        });
        it("should see 3 step ahead  RIGHT", () => {
            const board =
                '☼☼☼☼☼☼' +
                '☼    ☼' +
                '☼►  ○☼' +
                '☼╘   ☼' +
                '#    ☼' +
                '☼☼☼☼☼☼';
            const move = getNextSnakeMove(board, mockLogger);
            expect(move).toEqual(COMMANDS.RIGHT);
        });

        it("should try to catch apples LEFT", () => {
            const board =
                '☼☼☼☼☼☼' +
                '☼    ☼' +
                '☼ ○► ☼' +
                '☼  ╘ ☼' +
                '#    ☼' +
                '☼☼☼☼☼☼';
            const move = getNextSnakeMove(board, mockLogger);
            expect(move).toEqual(COMMANDS.LEFT);
        });

        it("should choose gold in favor of apple RIGHT", () => {
            const board =
                '☼☼☼☼☼☼' +
                '☼    ☼' +
                '☼ ○►$☼' +
                '☼  ╘ ☼' +
                '#    ☼' +
                '☼☼☼☼☼☼';
            // debugger;
            const move = getNextSnakeMove(board, mockLogger);
            expect(move).toEqual(COMMANDS.RIGHT);
        });

        it("should not cross itself", () => {
            const board =
                '☼☼☼☼☼☼☼☼☼☼' +
                '☼        ☼' +
                '☼        ☼' +
                '☼        ☼' +
                '☼        ☼' +
                '☼   ╔═►  ☼' +
                '☼   ╚═══╕☼' +
                '#     $  ☼' +
                '☼        ☼' +
                '☼☼☼☼☼☼☼☼☼☼';
            //æ──>
            const move = getNextSnakeMove(board, mockLogger);
            expect(move).not.toEqual(COMMANDS.DOWN);
        });

        it("should not cross itself if food is away", () => {
            const board =
                '☼☼☼☼☼☼☼☼☼☼' +
                '#       $☼' +
                '☼        ☼' +
                '☼        ☼' +
                '☼        ☼' +
                '☼        ☼' +
                '☼        ☼' +
                '☼  ╔═══╕ ☼' +
                '☼  ╚═►   ☼' +
                '☼☼☼☼☼☼☼☼☼☼';
            //æ──>

            const move = getNextSnakeMove(board, mockLogger);
            expect(move).toEqual(COMMANDS.RIGHT);
        });
        it("should avoid dead ends", () => {
            const board =
            "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
            "☼☼       ○               ►  $☼" +
            "☼#                       ╚══╗☼" +
            "☼☼       ●                  ║☼" +
            "☼☼                          ║☼" +
            "☼☼                          ║☼" +
            "☼☼     ☼☼☼☼☼                ╙☼" +
            "☼☼     ☼                     ☼" +
            "☼#     ☼☼☼        ☼☼☼☼#      ☼" +
            "☼☼     ☼          ☼   ☼      ☼" +
            "☼☼     ☼☼☼☼#      ☼☼☼☼#      ☼" +
            "☼☼                ☼          ☼" +
            "☼☼                ☼         $☼" +
            "☼☼    ●  ○                   ☼" +
            "☼#   ©                ○      ☼" +
            "☼☼                           ☼" +
            "☼☼        ☼☼☼                ☼" +
            "☼☼   ○   ☼  ☼                ☼" +
            "☼☼      ☼☼☼☼#     ☼☼   ☼#○   ☼" +
            "☼☼     ©☼   ☼   ● ☼ ☼ ☼ ☼ ○○ ☼" +
            "☼#      ☼   ☼     ☼  ☼  ☼    ☼" +
            "☼☼     ○          ☼     ☼    ☼" +
            "☼☼     ●       $  ☼     ☼    ☼" +
            "☼☼                           ☼" +
            "☼☼                  ○        ☼" +
            "☼☼ ○    ○      ●         ○   ☼" +
            "☼#                           ☼" +
            "☼☼               ○           ☼" +
            "☼☼                           ☼" +
            "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼";
            //debugger;
            const move = getNextSnakeMove(board, mockLogger);
            expect(move).toEqual(COMMANDS.LEFT);
        });


        it("should leave home floor", () => {
            const board =

                `☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼
☼☼                   ●   ●   ☼
☼#                       ○   ☼
☼☼       ●                   ☼
☼☼                           ☼
☼☼           ●               ☼
☼☼     ☼☼☼☼☼                 ☼
☼☼     ☼                     ☼
☼#     ☼☼☼        ☼☼☼☼ø      ☼
☼☼     ☼®         ☼   ☼  ●   ☼
☼☼     ☼☼☼☼#      ☼☼☼☼#      ☼
☼☼                ☼          ☼
☼☼                ☼          ☼
☼☼                           ☼
☼ø                           ☼
☼☼                           ☼
☼☼        ☼☼☼                ☼
☼☼       ☼  ☼        ○  ●    ☼
☼☼      ☼☼☼☼ø     ☼☼   ☼#    ☼
☼☼      ☼   ☼     ☼®☼ ☼ ☼    ☼
☼#   ©  ☼   ☼     ☼  ☼  ☼    ☼
☼☼                ☼     ☼    ☼
☼☼                ☼     ☼    ☼
☼☼○                     ○    ☼
☼☼                           ☼
☼☼             ●          ●  ☼
╘►     <──┐   æ              ☼
☼☼        │   │         ○    ☼
☼☼        └───┘          ©   ☼
☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼`;

            const move = getNextSnakeMove(board.replace(/\n/g, ''), mockLogger);
            expect(move).toEqual(COMMANDS.RIGHT);
        })

        it("wired scenario", () => {
            const board =

                "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
                "☼☼  ○                        ☼" +
                "☼#                           ☼" +
                "☼☼ ○                         ☼" +
                "☼☼                           ☼" +
                "☼☼                           ☼" +
                "☼☼     ☼☼☼☼☼                 ☼" +
                "☼☼     ☼                     ☼" +
                "☼#     ☼☼☼        ☼☼☼☼#      ☼" +
                "☼☼     ☼          ☼   ☼      ☼" +
                "☼☼     ☼☼☼☼#  ○ ○ ☼☼☼☼#      ☼" +
                "☼☼                ☼          ☼" +
                "☼☼                ☼          ☼" +
                "☼☼    ●                  ●   ☼" +
                "☼#            ●              ☼" +
                "☼☼     ○            ●    ●   ☼" +
                "☼☼      ˄ ☼☼☼                ☼" +
                "☼☼     ┌┘☼  ☼    <ö          ☼" +
                "☼☼     ¤☼☼☼☼#     ☼☼   ☼#    ☼" +
                "☼☼      ☼   ☼  ▲● ☼ ☼ ☼®☼    ☼" +
                "☼#      ☼   ☼  ╚═╕☼  ☼  ☼    ☼" +
                "☼☼                ☼     ☼    ☼" +
                "☼☼                ☼     ☼    ☼" +
                "☼☼              ○            ☼" +
                "☼☼                           ☼" +
                "☼☼                           ☼" +
                "☼#                           ☼" +
                "☼☼                           ☼" +
                "☼☼                           ☼" +
                "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼";

            const move = getNextSnakeMove(board, mockLogger);
            expect(move).not.toEqual(COMMANDS.RIGHT);
        })


    });
});
