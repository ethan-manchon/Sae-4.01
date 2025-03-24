import React from "react";
import User from "../../ui/user";
import { loadUsers } from "../../lib/loader";

export default function UsersList() {

    const [users, setUsers] = React.useState<Array<{ pseudo: string; email: string; roles: string }>>([]);

    React.useEffect(() => {
        loadUsers().then((fetchedUsers) => {
            setUsers(fetchedUsers);
        });
    }, []);

    return (<>
        <div className="mb-4">
            <input
                type="text"
                placeholder="Rechercher par pseudo"
                className="w-full p-2 border border-gray-300 rounded"
                onChange={(e) => {
                    const searchValue = e.target.value.toLowerCase();
                    setUsers((prevUsers) =>
                        prevUsers.filter((user) =>
                            user.pseudo.toLowerCase().includes(searchValue)
                )
            );
        }}
        />
        </div>
        <div className="max-h-96 flex flex-col gap-4 overflow-y-auto border border-border rounded p-4">
            {users.map((user, index: number) => (
                <User
                key={index}
                pseudo={user.pseudo}
                email={user.email}
                roles={user.roles}
                />
            ))}
        </div>
            </>
    );

}