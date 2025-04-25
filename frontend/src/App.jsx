import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CodeEditor from './CodeEditor'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div style={{ padding: "2rem"}}>
        <h1 className='heading'>AI Code Assistant</h1>
        <CodeEditor />
      </div>
    </>
  );
}

export default App
