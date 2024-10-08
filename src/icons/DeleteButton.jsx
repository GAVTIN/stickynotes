/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Trash from "../icons/Trash";
import { useContext } from "react";
import { db } from "../appwrite/databases";
import { NoteContext } from "../context/NoteContext";
 
const DeleteButton = ({ noteId }) => {
    const { setNotes } = useContext(NoteContext);
    const handleDelete = async (e) => {
        db.notes.delete(noteId);
        setNotes((prevState) =>
            prevState.filter((note) => note.$id !== noteId)
        );
    };
 
    return (
        <div onClick={handleDelete}>
            <Trash />
        </div>
    );
};

export default DeleteButton