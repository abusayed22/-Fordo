import React from 'react'
import Nav from './Nav'

function GenaralLayout({children}) {
  return (
    <div>
        <Nav />
        {children}
        
    </div>
  )
}

export default GenaralLayout
