import React, {useState} from 'react'
import { Button } from '@material-ui/core'
import { storage, db } from './firebase'
import firebase from 'firebase'
import './ImageUpload.css'

function ImageUpload({username}) {

    const [caption, setCaption] = useState('')
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)

    const handleUpload = (e) => {
        e.preventDefault()
        const uploadTask = storage.ref(`images/${image.name}`).put(image)
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress bar
                const progress = Math.round(
                    (snapshot.bytesTransferred/snapshot.totalBytes)*100
                )
                setProgress(progress)
                console.log(progress)
            }, 
            (error) => {
                console.log(error)
                alert(error.message)
            },
            () => {
                // complete function
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url=>{
                    // post image inside db
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(), // UTC
                        caption: caption,
                        imageUrl: url,
                        username: username
                    })
                })
                setProgress(0)
                setCaption('')
                setImage(null)
            }
        )

    }

    const handleChange = (e) => {
        if (e.target.files[0]){
            setImage(e.target.files[0])
        }
    }

    return (
        <div className="imageupload">
            <progress className="imageupload__progress" value={progress} max="100"></progress>
            <input 
                type="text" 
                onChange={(e)=>setCaption(e.target.value)}
                placeholder="write something..."
                value={caption}/>
            <input type="file" onChange={handleChange}/>
            <Button type="submit"
                onClick={handleUpload}
            >Upload</Button>
        </div>
    )
}

export default ImageUpload