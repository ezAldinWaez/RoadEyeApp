import React from 'react'
import './Header.css'

function Header() {
  return (
    <div className='header'>
      <div className="logo">  
        <img src={'/assets/logo.png'} alt="Logo"/>
      </div>  
      <nav className="nav">  
        <ul>  
          <li><a href="#uploadf">Try It</a></li>  
          <li><a href="#about">About</a></li>  
          <li><a href="#contact">Contact</a></li>  
        </ul>  
      </nav>    
    </div>
  )
}

export default Header
