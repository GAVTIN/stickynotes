import { NoteContext } from "../context/NoteContext";
import { useContext } from "react";
/* eslint-disable react/prop-types */
const Color = ({ color }) => {
    const {selectedNote} = useContext(NoteContext);
    const changeColor = () => {
        console.log("Change color clicked:", selectedNote);
    };
 
    return (
        <div
            onClick={changeColor}
            className="color"
            style={{ backgroundColor: color.colorHeader }}
        ></div>
    );
};

export default Color