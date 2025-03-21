import './App.css'
import React from 'react'

const response = await fetch('http://localhost:8080/posts?page=1');
console.log(await response.json());

function App() {


  return (
    <>

    </>
  )
}

export default App
