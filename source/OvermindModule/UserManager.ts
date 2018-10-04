import User from './User';


export default class UserManager {
    private _users: Set<User>;

    constructor(){
        this._users= new Set();
    }

    public registerNewUser(): User {
        const user = new User();
        this._users.add(user);
        return user;
    }

    public removeUser(user: User) {
        this._users.delete(user);
    }

    public get users(): User[] {
        return Array.from(this._users);
    }

    public get userCount(): number {
        return this.users.length;
    }

    public clearAllUserCommands() {
        for(const user of this._users) {
            user.clearCommands();
        }
    }

    public givenCommandCount(): number {
        return this.users.reduce((acc, user) => acc + user.givenCommandCount, 0);
    }
}
