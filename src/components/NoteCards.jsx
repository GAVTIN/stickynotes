// import { fakeData as notes } from "../assets/fakeData.js";
import { useContext } from "react";
import { NoteContext } from "../context/NoteContext";
import NoteCard from "../components/NoteCard";
import Controls from "./Controls";
 
const NotesPage = () => {
    const { notes, setNotes } = useContext(NoteContext);
    // const [notes, setNotes] = useState([]);
    // useEffect(() => {
    //     init();
    // }, [])
    // const init = async () => {
    //     const response = await db.notes.list();
    //     setNotes(response.documents);
    //     console.log("response", response)
    // }
    return (
        <div>
            {notes.map((note) => (
                <NoteCard note={note} key={note.$id} setNotes={setNotes} />
            ))}
            <Controls />
        </div>
    );
};

export default NotesPage;