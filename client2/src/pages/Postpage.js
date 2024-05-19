import { formatISO9075 } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function Postpage() {
    const [postInfo,setPostInfo] = useState('');
    const {userInfo} = useContext(UserContext);
    const {id} = useParams();
    useEffect(()=> {
        fetch('http://localhost:4000/post/'+ id)
        .then(response  => {
            response.json().then(postInfo => {
                setPostInfo(postInfo);
            });
        })
    }, []);
    if(!postInfo) return '';
    // console.log(postInfo);
    return (
        <div className="post-page">
            <h1>{postInfo.title}</h1>
            <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
            <div className="author">{postInfo.author.username}</div>
            {userInfo.id === postInfo.author._id && (
                <div className="edit-row">
                    <Link className="edit-button" to={'/edit/' + postInfo._id}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-pen" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                        </svg>
                        Edit This Post
                    </Link>
                </div>
            )}
            <div className="image">
                <img src={"http://localhost:4000/"+postInfo.cover} alt="cover photo"/>
            </div> 
            <div className="content" dangerouslySetInnerHTML={{__html:postInfo.content}}/>
            
        </div>
    );
}