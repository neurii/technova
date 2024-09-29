"use client";

import Image from "next/image";
import styles from "./page.module.css";
import * as React from 'react';
import Grid from '@mui/material/Grid';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Paper from '@mui/material/Paper';
import { Typography, Button,  } from "@mui/material";


const scrollToSection = (id) => {
  const section = document.getElementById(id);
  if (section) {
    // Proceed with scrolling logic
    const targetPosition = section.getBoundingClientRect().top + window.scrollY;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const duration = 1000; // 1 second duration
    let startTime = null;

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutQuad(progress);

      window.scrollTo(0, startPosition + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    const easeInOutQuad = (t) => {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };

    requestAnimationFrame(animation);
  } else {
    console.error(`No element found with id: ${id}`); // Log an error if the section doesn't exist
  }
};


export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Image
          className={styles.logo}
          src="/empowher.png" // Replace with your custom logo
          alt="EmpowHER logo"
          width={150}
          height={150}
          priority
        />
        <nav className={styles.nav}>
          <a onClick={() => scrollToSection('about')}>About</a>
          <a onClick={() => scrollToSection('features')}>Features</a>
          <a onClick={() => scrollToSection('contactus')}>Connect</a>
          <a href="#join">Join Us</a>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.imageBlock}>
          <Image
            src="/women.png" // Replace with your image path
            alt="A horizontal image"
            width={10000}
            height={400}
            layout="responsive"
          />
        </section>

        <section className={styles.hero}>
          <h1 className={styles.title}>Welcome to empowHER!</h1>
          <p className={styles.subtitle}>
            Committed to Excellence
          </p>
          <a href="#join" className={styles.cta}>
            Get Started
          </a>
          <div className={styles.spacer}></div> {/* Add this line for extra space */}
        </section>

        {/* Updated About Section */}
        <section id="about" className={styles.aboutContainer}>
          <div className={styles.about}>
            <h2>About</h2>
            <p>
              EmpowHER is dedicated to empowering women in STEM <br />
              by providing resources, networking opportunities, <br />
              and support to help them succeed in their careers.<br />
              Our mission is to foster a community where women <br />
              can share their experiences, learn from each other, <br />
              and build a strong foundation for their professional journey.
            </p>
            {/* Add your image here */}
            <div className={styles.imageWrapper}>
              <Image
                src="/about.jpg" // Replace with the path to your image
                alt="About Image"
                width={150} // Set width as needed
                height={150} // Set height as needed
                className={styles.aboutImage}
              />
            </div>
          </div>
        </section>
        
        {/* Features */}
        <section id="features" className={styles.featuresSection}>
          <h2>Features</h2>
          {/* <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <img src="/search.gif" alt="Job Board Feature" />
              <h3>Job Board</h3>
              <p>Find the perfect job opportunities tailored for women in STEM.</p>
              <button className={styles.cta}>Learn More</button>
            </div>

            <div className={styles.feature}>
              <img src="/resume.gif" alt="Resume Parser Feature" />
              <h3>Resume Parser</h3>
              <p>Get AI-powered resume analysis to highlight your skills and achievements.</p>
              <button className={styles.cta}>Learn More</button>
            </div>

            <div className={styles.feature}>
              <img src="/chat.gif" alt="AI Interview Prep Feature" />  
              <h3>AI Interview Prep</h3>
              <p>Prepare for interviews with personalized AI-driven questions and feedback.</p>
              <button className={styles.cta}>Learn More</button>
            </div>
          </div> */}
          <Grid container spacing={3} justifyContent="center" className={styles.featuresGrid}>
            {/* Job Board Feature */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3} className={styles.feature}>
                <img src="/search.gif" alt="Job Board Feature" style={{ width: '100%', height: 'auto' }} />
                <Typography variant="h3" align="center" gutterBottom>
                  Job Board
                </Typography>
                <Typography align="center" paragraph>
                  Find the perfect job opportunities tailored for women in STEM.
                </Typography>
                <Button variant="contained" className={styles.cta} fullWidth>
                  Learn More
                </Button>
              </Paper>
            </Grid>

            {/* Resume Parser Feature */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3} className={styles.feature}>
                <img src="/resume.gif" alt="Resume Parser Feature" style={{ width: '100%', height: 'auto' }} />
                <Typography variant="h3" align="center" gutterBottom>
                  Resume Parser
                </Typography>
                <Typography align="center" paragraph>
                  Get AI-powered resume analysis to highlight your skills and achievements.
                </Typography>
                <Button variant="contained" className={styles.cta} fullWidth>
                  Learn More
                </Button>
              </Paper>
            </Grid>

            {/* AI Interview Prep Feature */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3} className={styles.feature}>
                <img src="/chat.gif" alt="AI Interview Prep Feature" style={{ width: '100%', height: 'auto' }} />
                <Typography variant="h3" align="center" gutterBottom>
                  AI Interview Prep
                </Typography>
                <Typography align="center" paragraph>
                  Prepare for interviews with personalized AI-driven questions and feedback.
                </Typography>
                <Button variant="contained" className={styles.cta} fullWidth>
                  Learn More
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </section>
        
      </main>

      <footer className={styles.footerContainer} id="contactus">
        <h1>Connect With Us</h1>
        <p>Your feedback is important to us!<br/>
          Please share your thoughts or inquiries below:
        </p>
          <form>
            <div>
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div>
              <label htmlFor="message">Message:</label>
              <textarea id="message" name="message" required></textarea>
            </div>
            <button type="submit">Send Message</button>
          </form>
          <p>© 2024 EmpowHER. All rights reserved.</p>
          <div className={styles.socials}>
            <h3>Our Socials</h3>
            {/* Add your social media links/icons here */}
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
        </footer>

    </div>
  );
}
