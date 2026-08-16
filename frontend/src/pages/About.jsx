function About() {
  return (
    <div className="about-page">

      <section className="about-hero">
        <h1>About CareerGo</h1>

        <p>
         Making Job Searching Simple
        CareerGo was created to make finding the right job easier. We bring job seekers and companies together through a simple and accessible platform.
        </p>
      </section>

      <section className="about-content">

        <div className="about-section">
          <h2>Who We Are</h2>

          <p>

            CareerGo is a job portal designed to help job seekers
            discover opportunities and connect with companies.
            Our goal is to make the job search process simple,
            fast and accessible.
            
          </p>
        </div>

        <div className="about-section">
          <h2>Our Mission</h2>

          <p>
            Our mission is to connect the right talent with the
            right opportunities and help people take the next
            step in their careers.
          </p>
        </div>

        <div className="about-section">
          <h2>What CareerGo Offers</h2>

          <div className="about-cards">

            <div className="about-card">
              <h3>🔎 Find Jobs</h3>
              <p>
                Search and discover jobs based on skills,
                location and career interests.
              </p>
            </div>

            <div className="about-card">
              <h3>🏢 Explore Companies</h3>
              <p>
                Discover companies and explore available
                job opportunities.
              </p>
            </div>

            <div className="about-card">
              <h3>🚀 Build Your Career</h3>
              <p>
                Apply for jobs and take the next step
                towards your career goals.
              </p>
            </div>

          </div>
        </div>
        <div className="about-section">
          <h3>🏢 For Companies</h3>
          <p>Find Talent That Fits Your Team. CareerGo helps companies reach talented job seekers and showcase their opportunities to people looking for their next career move.</p>
        </div>
        <div className="about-section">
          <h3>🛣️ How CareerGo Works</h3>
          <div className="about-cards">
          <div className="about-card">
            <h3>Create Your Profile</h3>
              <p>Tell us about your skills and experience.</p>
          </div>

          <div className="about-card">
            <h3>Discover Opportunities</h3>
              <p>Search for jobs that match your interests.</p>
          </div>
           <div className="about-card">
            <h3>Explore Companies</h3>
              <p>Learn about companies and their available roles.</p>
          </div>
          
          <div className="about-card">
            <h3>Apply & Grow</h3>
              <p>Learn about companies and their available roles.</p>
          </div>
          </div>

        </div>
      
      </section>

    </div>
  );
}

export default About;