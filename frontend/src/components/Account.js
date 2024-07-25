import { useAuth } from "../context/Auth";

export default function Account() {
    const { user } = useAuth();

    if (!user || !user.isLoggedIn) {
        return (
            <div className="container mx-auto mt-5">
                <h1 className="text-3xl font-bold text-center">Account</h1>
                <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 text-center rounded">
                    User is not logged in.
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto mt-5">
            <h1 className="text-3xl font-bold text-center">Account</h1>
            <div className="mt-4 p-4 bg-white shadow rounded">
                <p className="text-lg"><strong>Username:</strong> {user.account.username}</p>
                <p className="text-lg"><strong>Email:</strong> {user.account.email}</p>
                <p className="text-lg"><strong>Role:</strong> {user.account.role}</p>
            </div>
        </div>
    );
}
