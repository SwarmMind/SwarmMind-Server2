import User from './User';

export default class UserManager {
    private users: Set<User> = new Set();
    /**
     * registerNewUser
     */
    public registerNewUser(): User {
        const user = new User();
        this.users.add(user);
        return user;
    }

    /**
     * removeUser
     */
    public removeUser(user: User) {
        this.users.delete(user);
    }
}
