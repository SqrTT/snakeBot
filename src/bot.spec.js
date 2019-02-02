
const {
    getNextSnakeMove,
} = require('./bot');
const {
    COMMANDS
} = require('./constants');

describe("bot", () => {
    describe("getNextSnakeMove", () => {
        const mockLogger = (a) => {
           // console.log(a);
        };

        it("should define method", () => {
            expect(getNextSnakeMove).toBeDefined();
        });
        it("should avoid horisontal wall", () => {
            const board =
                '☼☼☼☼☼' +
                '#   ☼' +
                '☼   ☼' +
                '☼ ╘►☼' +
                '☼☼☼☼☼';

            const move = getNextSnakeMove(board, mockLogger);
            expect(move).toEqual(COMMANDS.UP);
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
            const move = getNextSnakeMove(board, mockLogger);
            expect(move).toEqual(COMMANDS.RIGHT);
        });
        it("should avoid dead ends", () => {
            const board =
`☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼
☼☼       ○               ►   ☼
☼#                       ╚══╕☼
☼☼       ●                   ☼
☼☼                           ☼
☼☼                           ☼
☼☼     ☼☼☼☼☼                 ☼
☼☼     ☼                     ☼
☼#     ☼☼☼        ☼☼☼☼#      ☼
☼☼     ☼          ☼   ☼   æ  ☼
☼☼     ☼☼☼☼#      ☼☼☼☼#   ˅  ☼
☼☼                ☼          ☼
☼☼                ☼         $☼
☼☼    ●  ○                   ☼
☼#   ©                ○      ☼
☼☼                           ☼
☼☼        ☼☼☼                ☼
☼☼   ○   ☼  ☼                ☼
☼☼      ☼☼☼☼#     ☼☼   ☼#○   ☼
☼☼     ©☼   ☼   ● ☼ ☼ ☼ ☼ ○○ ☼
☼#      ☼   ☼     ☼  ☼  ☼    ☼
☼☼     ○          ☼     ☼    ☼
☼☼     ●       $  ☼     ☼    ☼
☼☼                           ☼
☼☼                  ○        ☼
☼☼ ○    ○      ●         ○   ☼
☼#                           ☼
☼☼               ○           ☼
☼☼                           ☼
☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼`;

            const move = getNextSnakeMove(board.replace(/\n/g, ''), mockLogger);
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
    });
});
