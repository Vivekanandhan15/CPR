import React from 'react'
import { RouterProvider } from 'react-router-dom'
import Router from './routers/Router'

function App() {
  return (
    <div>
      <RouterProvider router={Router} />
    </div>
  )
}

export default App
