import User from './User';


export default class UserManager {
    static _users: Set<User> = new Set();
    /**
     * registerNewUser
     */
    static registerNewUser(): User {
        const user = new User();
        UserManager._users.add(user);
        return user;
    }

    /**
     * removeUser
     */
    static removeUser(user: User) {
        UserManager._users.delete(user);
    }

    static get users() {
        return Array.from(this._users);
    }

    static clearAllUserCommands() {
        for(const user of this._users) {
            user.clearCommands();
        }
    }

    static userCommandCount() {
        //this.users.reduce((acc, currentUser) => acc + currentUser.commands.values().reduce((acc, current) => acc + (curr)), 0)
    }
}
