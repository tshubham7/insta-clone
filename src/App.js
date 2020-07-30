import React, {useState, useEffect} from 'react';
import './App.css';
import Post from './post';
import {db, auth} from './firebase'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50; 
  const left = 50; 

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}



const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {

  const [posts, setPosts] = useState([]); 
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
 
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
 
  useEffect(()=>{
    // runs the code when page opens
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => (
        {
          id: doc.id,
          post: doc.data()}
        )))
    })
  }, []); // specify the name of props, if you want to run this code when there is a change in a props, for now it run only once

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser) =>{
      if (authUser) {
        // user has logged in... 
        console.log(authUser);
        setUser(authUser);
      }else{
        // user has logged out...
        setUser(null);
      }

    })
    return () => {
      // perform some cleanup actions
      unsubscribe();
    }
  },[user, username])

  const onSignUp = (e) =>{
    e.preventDefault();
    // creating firebase user with email and pass
    auth.createUserWithEmailAndPassword(email, password)
    .catch(error => alert(error.message)) //catching error
    .then((authUser)=>{
      if (authUser == undefined){
        return
      }
      return authUser.user.updateProfile({
        displayName: username
      })
    }) // handling response
    setUsername('')
    setEmail('')
    setPassword('')
    setOpen(false);
  }
  
  const onSignIn = (e) => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
    .catch(error => alert(error))
    
    setUsername('')
    setEmail('')
    setPassword('')
    setOpenSignIn(false);
  }


  return (
    <div className="app">
      

      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
          // <src/>
        />
        {user ? (
            <Button onClick={()=>auth.signOut()}>Logout</Button>
          ): (
            <div className="app_logincontainer">
              <Button onClick={()=>setOpenSignIn(true)}>Sign in</Button>
              <Button onClick={()=>setOpen(true)}>Sign up</Button>

            </div>
          )
        }
      </div> 


      <Modal
        open={open}
        onClose={()=>{setOpen(false)}}
      >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img
            className="app_headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""
            // <src/>
          />
          </center>

          <form className="app__signup">
            <Input 
              type="text" 
              placeholder="username"
              value={username}
              onChange={(e)=>setUsername(e.target.value)} />
            <Input 
              type="text" 
              placeholder="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)} />
            <Input 
              type="text" 
              placeholder="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)} />
            <Button onClick={onSignUp}>Sign up</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={()=>{setOpenSignIn(false)}}
      >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img
            className="app_headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""
            // <src/>
          />
          </center>

          <form className="app__signup">
            <Input 
              type="text" 
              placeholder="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)} />
            <Input 
              type="text" 
              placeholder="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)} />
            <Button onClick={onSignIn}>Sign in</Button>
          </form>
        </div>
      </Modal>
      <div className="app__posts">
        <div className="app__postLeft">
          {
            posts.map(({id, post}) => (
              <Post username={post.username} 
              avatar={post.avatar}
              caption={post.caption}
              imageUrl={post.imageUrl}
              user={user} 
              key={id} postId={id}/>
            ))
          }
        </div>
        <div className="app__postRight">
          <InstagramEmbed
            url='https://www.instagram.com/p/CDBotydnhuq/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
        
      </div>
      {
        user?.displayName ? (
          <ImageUpload username={user.displayName}/>
        ) : (
          <p>login to upload</p>
        )
      }
    </div>
  );
}

export default App;
