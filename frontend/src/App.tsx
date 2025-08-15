import { useState } from 'react'
import TextField from '@mui/material/TextField';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button, FormControl, FormLabel } from '@mui/material';

function App() {
  const [email, setEmail] = useState("");
  
  const handleChange = (e: any) => {
    setEmail(e.target.value);
  }

  const handleAddSubscriber = async () => {
    try {
      const response = await fetch('/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email}),
      });

      if (response.ok) {
        console.log('Subscribed successfully!');
        setEmail('');
      } else {
        console.error('Unable to subscribe :(');
      }
    }
    catch (error) {
      console.error('Unable to subscribe :(');
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            label="Email"
            value={email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </FormControl> 
        <Button type="submit" fullWidth variant="contained" onClick={handleAddSubscriber}>
          Sign in
        </Button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
