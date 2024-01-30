import { useContext, useEffect, useState } from "react"
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useNavigate } from "react-router-dom";
import { RoomContext, UserContext } from "../../context";
import toast from "react-hot-toast";
import Playground from "../playground";
import GameState from "./enum";
import PlayerNotStartedPage from "./playerNotStartedPage";
import PlayerQuestionAnswer from "./PlayerQuestionAnswer";
import PlayerResultsPage from "./PlayerResultsPage";
import PlayerEndGamePage from "./PlayerEndGamePage";
import CONFIG from "../../config";

const PlayerDash = ({ client }) => {
    const { user } = useContext(UserContext);
    const { room, setRoom } = useContext(RoomContext);
    const [currentState, setCurrentState] = useState(GameState.NOT_STARTED);
    const [stateData, setStateData] = useState(null);
    const nav = useNavigate();

    useEffect(() => {
        if(user == null){
            nav("/join");
        }
        var client = new W3CWebSocket(CONFIG.SOCKET_URL);

        client.onerror = (e) => {
            console.log("Connection Error!");
            console.log(e);
        }

        client.onopen = () => {
            console.log("connected!");
            client.send(JSON.stringify({
                type: "join-room",
                room: room.id,
                username: user.username,
                clientId: user.id,
                roomId: room.id,
            }));
        }

        client.onmessage = (msg) => {
            console.log("got a message! " + msg);
            const data = JSON.parse(msg.data);
            if(data.type == "start-game"){
                // maybe unnecessary
            }
            if(data.type == "show-question"){
                console.log("showing question!");
                setCurrentState(GameState.SHOW_QUESTION);
                setStateData(data);
                // question, username
                // show question (3 seconds of just question, then appear the answer box)
                // host: show question
            }
            if(data.type == "show-results"){
                console.log("showing results!");
                setCurrentState(GameState.SHOW_RESULTS);
                setStateData(data);
                // points given, rank
                // host: show top 5
            }
            if(data.type == "game-end"){
                setCurrentState(GameState.GAME_END);
                setStateData(data);
                // rank, points total
                // host: show top 3
            }
        };
    }, []);

    if(currentState == GameState.NOT_STARTED){
        return <PlayerNotStartedPage user={user} room={room} />
    }

    if(currentState == GameState.SHOW_QUESTION){
        return <PlayerQuestionAnswer player={user} room={room} data={stateData} />
    }

    if(currentState == GameState.SHOW_RESULTS){
        return <PlayerResultsPage data={stateData} player={user} room={room} />
    }

    if(currentState == GameState.GAME_END){
        return <PlayerEndGamePage data={stateData} player={user} room={room} />
    }
};

export default PlayerDash;