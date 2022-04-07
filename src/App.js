import './App.css';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import app from './firebase.init';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import { useState } from 'react';

const auth = getAuth(app);

function App() {
  const [validated, setValidated] = useState(false);
  const [registered, setRegistered] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleEmailBlur = (event) => {
    setEmail(event.target.value)
  }

  const handlePasswordBlur = (event) => {
    setPassword(event.target.value)
  }

  const handleRegisteredChange = (event) => {
    setRegistered(event.target.checked)
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }

    if (!/(?=.*?[#?!@$%^&*-])/.test(password)) {
      setError('Password should contain at least one special character')
      return;
    }
    else {
      setError('')
    }
    setValidated(true);

    if(registered){
      signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user
        console.log(user)
      })
      .catch(error => {
        console.error(error)
        setError(error.message)
      })
    }
    else{
      createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user
        console.log(user)
        setEmail('')
        setPassword('')
        verifyEmail();
      })
      .catch(error => {
        console.error(error)
        setError(error.message)
      })
    }
    event.preventDefault()
  }

  const hnadlePasswordReset = () =>{
    sendPasswordResetEmail(auth, email)
    .then(() =>{
      console.log('Email send')
    })
  }
    const verifyEmail = () => {
      sendEmailVerification(auth.currentUser)
      .then(()=>{
        console.log('Email Verification Sent')
      })
    }
  return (
    <>
      <div className="registration w-50 mx-auto mt-5">
        <h2 className='text-primary my-3'>{registered ? 'Login' : 'Registration'} Form</h2>
        <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onBlur={handlePasswordBlur} type="password" placeholder="Password" required />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check onChange={handleRegisteredChange} type="checkbox" label="Already Registered ?" />
          </Form.Group>
          <p className='text-danger'>{error}</p>
          <Button onClick={hnadlePasswordReset} variant="link">Forgot Password ?</Button>
          <br />
          <Button variant="primary" type="submit">
            {registered ? 'Login' : 'Register'}
          </Button>
        </Form>
      </div>
    </>
  );
}

export default App;
