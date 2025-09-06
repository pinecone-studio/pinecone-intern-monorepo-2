import { useGetProfileQuery } from "@/generated";
import { useUser } from "@/contexts/UserContext";

interface MatchedUserProps {
    onUserSelect?: (user: any) => void;
    currentUserId?: string;
}

const MatchedUser: React.FC<MatchedUserProps> = ({ onUserSelect, currentUserId }) => {
    const { user } = useUser();
    const actualCurrentUserId = currentUserId || user?.id || "";

    const { data, loading, error } = useGetProfileQuery({
        variables: {
            userId: actualCurrentUserId
        }
    });

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your matches...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center text-red-500">
                <div className="text-6xl mb-4">⚠️</div>
                <p className="text-xl font-semibold mb-2">Error loading profile</p>
                <p className="text-sm">{error.message}</p>
            </div>
        </div>
    );

    return (
        <div className="p-4">

            {/* Matches Grid */}
            {data?.getProfile?.matches && data.getProfile.matches.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                    {data.getProfile.matches.map((match) => (
                        <div
                            key={match.userId}
                            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform group"
                            onClick={() => onUserSelect?.(match)}
                        >
                            <img
                                src={match.images?.[0] || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                                className="w-full h-full object-cover"
                                alt={match.name || "User"}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
                                }}
                            />
                            {/* Red dot indicator */}
                            <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></div>
                            {/* Name overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                <p className="text-white text-sm font-medium truncate">
                                    {match.name || "Unknown"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MatchedUser