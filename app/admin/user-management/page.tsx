import { getUsers } from "./users";
import UserListClient from "./user-list-client";



export default async function usersManagement() {
    const users = await getUsers();
    return <UserListClient initialUsers={users} />;
}
