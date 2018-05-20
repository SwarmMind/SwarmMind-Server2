export default interface PlayerInterface {
    // TODO: Add Command-Object as return type?
    getCommandForUnit(unitID: string): string;

    takeNewGameState(state: any): void;
}
