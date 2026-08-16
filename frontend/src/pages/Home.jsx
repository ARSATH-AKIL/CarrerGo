import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    const searchValue = search.trim();
    const locationValue = location.trim();

    // No search entered
    if (!searchValue && !locationValue) {
      navigate("/jobs");
      return;
    }

    // Create query parameters
    const params = new URLSearchParams();

    if (searchValue) {
      params.set("search", searchValue);
    }

    if (locationValue) {
      params.set("location", locationValue);
    }

    // Go to Jobs page
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <section className="hero">

      <h1>
        Find Your <span>Dream Job</span>
      </h1>

      <p>
        Discover the right opportunities and take
        the next step in your career with CareerGo.
      </p>

      <form
        className="search-box"
        onSubmit={handleSearch}
      >

        {/* Job Search */}

        <input
          type="text"
          placeholder="Job title, skills or keywords"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Location */}

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {/* Search Button */}

        <button type="submit">
          Search Jobs
        </button>

      </form>

    </section>
  );
}

export default Home;