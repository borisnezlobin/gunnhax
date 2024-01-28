import { useContext } from "react"
import { RoomContext, UserContext } from "../../context";
import { Play } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

const HostNotStartedPage = ({ user, room }) => {
    const nav = useNavigate();
    console.log("host is ", user);

    const numPlayers = room.players.length - 1;

    return (
        <>
            <div className="w-full h-full min-w-screen min-h-screen gap-4 flex flex-col justify-center items-center">
                <div className="w-1/3 flex flex-row gap-4 justify-start items-center pb-8">
                    <h1 className="">{room.id}</h1>
                    <p>{room.questions.length} Question{room.questions.length == 1 ? "" : "s"} Submitted</p>
                </div>
                {numPlayers > 0 ? <hr className="w-2/3" /> : <></>}
                <p className="flex flex-wrap px-16 mt-4 gap-4">
                    {room.players.map((player) => {
                        if(player.isHost) return;
                        return <span>{player.username}</span>
                    })}
                </p>
            </div>
            <div className="absolute bottom-4 w-full flex flex-row justify-center items-center gap-4">
                <p>{numPlayers} Player{numPlayers == 1 ? "" : "s"}</p>
                <button onClick={() => {
                    fetch("http://localhost:9000/start-game", {
                        body: JSON.stringify({
                            roomId: room.id,
                        }),
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                }}>
                    Start Game
                    <Play />
                </button>
            </div>
        </>
    );
}

export default HostNotStartedPage;