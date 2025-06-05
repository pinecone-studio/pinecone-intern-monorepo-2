interface User {
    _id: string;
    name?: string;
    clerkId?: string | null;
}

interface Match {
    _id: string;
    users: User[];
}

interface MatchListProps {
    matches: Match[];
    selectedMatchId: string | null;
    onSelect: (_id: string) => void;
    currentUserId?: string;
}

export const MatchList = ({ matches, selectedMatchId, onSelect }: MatchListProps) => (
    <div className="w-1/3 border-r p-4 overflow-y-auto bg-white">
        <h2 className="text-xl font-bold mb-4">Matches</h2>
        <ul className="space-y-2">
            {matches.map((match) => (
                <li
                    key={match._id}
                    onClick={() => onSelect(match._id)}
                    className={`cursor-pointer p-3 rounded-lg border ${selectedMatchId === match._id ? 'bg-blue-100 border-blue-400' : 'hover:bg-gray-100'
                        }`}
                >
                    {match.users.map((user) => (
                        <div key={user._id}>{user.name}</div>
                    ))
                    }
                </li>
            ))}
        </ul>
    </div>
);



