import React from "react";
const mockArtists = [
  {
    id: 1,
    name: "Ava Stone",
    image: "https://i.pravatar.cc/150?img=1",
    tags: ["Digital Art", "Surreal"],
    viewedAt: "2 hours ago",
  },
  {
    id: 2,
    name: "Leo Walker",
    image: "https://i.pravatar.cc/150?img=2",
    tags: ["Watercolor", "Nature"],
    viewedAt: "Yesterday",
  },
  {
    id: 3,
    name: "Maya Lin",
    image: "https://i.pravatar.cc/150?img=3",
    tags: ["Sculpture", "Abstract"],
    viewedAt: "3 days ago",
  },
];

//Chưa có db nên để tạm thời là mock data
//Chưa biết theme như nào nên cứ để tạm thời là như này :)) hơi xấu

function RecentArtist() {
    return(
        <div className="RecentArtist" >
            <h1>Recently Viewed Artist</h1>
            <div className="artist-list">
                {mockArtists.map((artist) => (
                    <div key={artist.id} className="artist-card">
                        <img src={artist.image} alt={artist.name} />
                        <div className="artist-info">
                            <h2>{artist.name}</h2>
                            <p>{artist.tags.join(", ")}</p>
                            <p>{artist.viewedAt}</p>
                        </div>
                    </div>
                ))}
        </div>
        </div>
    );
}
export default RecentArtist
