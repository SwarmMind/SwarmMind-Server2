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
}
