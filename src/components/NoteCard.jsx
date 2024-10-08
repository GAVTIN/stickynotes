/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useRef, useEffect, useState, useContext } from 'react';
import {setNewOffset, autoGrow, setZIndex, bodyParser} from '../utils.js'
import { NoteContext } from '../context/NoteContext.jsx';
import Spinner from '../icons/Spinner.jsx';
import DeleteButton from '../icons/DeleteButton.jsx';
import { db } from '../appwrite/databases';
import Trash from '../icons/Trash'
const NoteCard = ({ note, setNotes }) => {
    // let position = JSON.parse(note.position);
    let mouseStartPos = { x: 0, y: 0 };
    const cardRef = useRef(null);
    const [position, setPositon] = useState(JSON.parse(note.position));
    const [saving, setSaving] = useState(false);
    const colors = JSON.parse(note.colors);
    const body = bodyParser(note.body);
    const textAreaRef = useRef(null);
    const keyUpTimer = useRef(null);
    const { setSelectedNote } = useContext(NoteContext);
    const mouseDown = (e) => {
        if (e.target.className === "card-header") {
 
            setZIndex(cardRef.current);
     
            mouseStartPos.x = e.clientX;
            mouseStartPos.y = e.clientY;
     
            document.addEventListener("mousemove", mouseMove);
            document.addEventListener("mouseup", mouseUp);
            setSelectedNote(note);
        }
    };

    const saveData = async (key, value) => {
        const payload = { [key]: JSON.stringify(value) };
        try {
            await db.notes.update(note.$id, payload);
        } catch (error) {
            console.error(error);
        }
        setSaving(false);
    };

    const handleKeyUp = async () => {
        //1 - Initiate "saving" state
        setSaving(true);
     
        //2 - If we have a timer id, clear it so we can add another two seconds
        if (keyUpTimer.current) {
            clearTimeout(keyUpTimer.current);
        }
     
        //3 - Set timer to trigger save in 2 seconds
        keyUpTimer.current = setTimeout(() => {
            saveData("body", textAreaRef.current.value);
        }, 2000);
    };

    const mouseMove = (e) => {
        //1 - Calculate move direction
        let mouseMoveDir = {
            x: mouseStartPos.x - e.clientX,
            y: mouseStartPos.y - e.clientY,
        };
     
        //2 - Update start position for next move.
        mouseStartPos.x = e.clientX;
        mouseStartPos.y = e.clientY;

        const newPosition = setNewOffset(cardRef.current, mouseMoveDir);
        setPositon(newPosition);

    };

    const mouseUp = () => {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);

        const newPosition = setNewOffset(cardRef.current); //{x,y}
        saveData("position", newPosition);
    };

    useEffect(() => {
        autoGrow(textAreaRef);
        setZIndex(cardRef.current);
    }, []);
    return (
        <div
            className="card"
            style={{
                backgroundColor: colors.colorBody,
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
            ref={cardRef}
        >
            <div
                className="card-header"
                style={{ backgroundColor: colors.colorHeader }}
                onMouseDown = { mouseDown }
            >
                {saving && (
                    <div className="card-saving">
                        <Spinner color={colors.colorText} />
                        <span style={{ color: colors.colorText }}>
                            Saving...
                        </span>
                    </div>
                )}
                <DeleteButton noteId={note.$id} setNotes={setNotes} />
            </div>
            <div className="card-body">
                <textarea
                    ref={textAreaRef}
                    onKeyUp={handleKeyUp}
                    style={{ color: colors.colorText }}
                    defaultValue={body}
                    onInput={() => {
                        autoGrow(textAreaRef);
                    }}
                    onFocus={() => {
                        setZIndex(cardRef.current);
                        setSelectedNote(note);
                    }}
                ></textarea>
            </div>
        </div>
    );
};

export default NoteCard