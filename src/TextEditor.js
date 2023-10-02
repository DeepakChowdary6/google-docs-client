import {useCallback, useEffect, useRef, useState} from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { io } from "socket.io-client"
import {useParams} from "react-router-dom";

const SAVE_INTERVAL_MS=2000;

const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
]

export default function TextEditor() {
    const {id:documentId}=useParams();
    const socket = useRef(io("http://localhost:3001"))
    const [quill, setQuill] = useState()
    const wrapperRef = useCallback(wrapper => {
        if (wrapper == null) return

        wrapper.innerHTML = ""
        const editor = document.createElement("div")
        wrapper.append(editor)
        const q = new Quill(editor, {
            theme: "snow",
            modules: { toolbar: TOOLBAR_OPTIONS },
        })
        setQuill(q)
    }, [])

    useEffect(() => {
        if(socket.current===null || quill===null)return ;
        let interval;
         try{
              interval=setInterval( () => {
              socket.current.emit('save-document',quill.getContents());
     },SAVE_INTERVAL_MS)}
        catch (e){
             console.log(e);
        }
        return ()=>{
             clearInterval(interval);
        };
    }, [socket.current,quill])


    useEffect(() => {
        if (socket.current == null || quill == null) return
        const handler = delta => {
            quill.updateContents(delta)
        }
        socket.current.on("receive-changes", handler)
        quill.on("text-change", (delta, oldDelta, source) => {
            if (source !== "user") return
            socket.current.emit("send-changes", delta)

        })
        return () => {
            socket.current.disconnect()
            socket.current.off("receive-changes",delta => {
                quill.updateContents(delta)
            })
            quill.off("text-change",(delta, oldDelta, source) => {
                if (source !== "user") return
                socket.current.emit("send-changes", delta)

            })
        }
    }, [socket.current, quill])

    useEffect(()=>{
        if(socket.current===null || quill===null)return;

        socket.current.on('load-document',document=>{
            try {
                quill.setContents(document);
                quill.enable();
            } catch (error) {
                console.error('Error setting contents or enabling Quill:', error);
            }
        })
        socket.current.emit('get-document',documentId);


    },[quill,documentId,socket.current])

    return <div className="container" ref={wrapperRef}></div>
}