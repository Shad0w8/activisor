import { Form, Navigate } from "react-router-dom";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { useState } from "react";

export default function Createnewpost() {
    const [title,setTitle] = useState('');
    const [summary,setSummary] = useState('');
    const [content,setContent] = useState('');
    const [files,setFiles] = useState('');
    const [redirect,setRedirect] = useState(false);
    const modules = {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image'],
          ['clean']
        ],
      };
      const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
      ];

      async function Cnpost(ev){
        const data = new FormData();
        data.set('title',title);
        data.set('summary',summary);
        data.set('content',content);
        data.set('file',files[0]);
        ev.preventDefault();
        const response = await fetch('http://localhost:4000/post', {
            method:'POST',
            body: data,
            credentials: "include"
        });
        if(response.ok){
            setRedirect(true);
        }
      }


    if(redirect){
        return <Navigate to={'/'} />
    }
    return (
        <form className="create" onSubmit={Cnpost}>
            <input type="title" 
            placeholder="Title" 
            value={title} 
            onChange={ev=>setTitle(ev.target.value)}
            />
            <input type="summary" 
            placeholder="Summary" 
            value={summary} 
            onChange={ev=>setSummary(ev.target.value)}
            />
            <input type="file" 
            onChange={ev => setFiles(ev.target.files)}
            />
            <ReactQuill value={content} 
            onChange={newV=>setContent(newV)}
            modules={modules} 
            formats={formats}/>
            <button>Create Post</button>
        </form>
    )
}