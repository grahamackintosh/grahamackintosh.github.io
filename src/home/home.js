import React, { useState } from 'react';
import './home.css'

function Home() {
  return (
    <div className="App">
      <section id="section1">
        <h1 id="main-header">Graham Mackintosh</h1>
        <div id="main-subtitles">
        </div>
        <div id="location-list">
          <p> Auckland, New Zealand </p>
        </div>
      </section>
      <div className="spacer" id="spacer1"></div>
    </div>
  );
}

export default Home;
