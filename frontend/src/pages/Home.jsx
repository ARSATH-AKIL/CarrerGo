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

    if (!searchValue && !locationValue) {
      navigate("/jobs");
      return;
    }

    const params = new URLSearchParams();

    if (searchValue) {
      params.set("search", searchValue);
    }

    if (locationValue) {
      params.set("location", locationValue);
    }

    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h2>
          Find Your <span>Dream Job</span>
        </h2>

        <p>
          Discover the right opportunities and take the next step
          in your career with CareerGo.
        </p>

        <form className="search-box" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Job title, skills or keywords"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <button type="submit">
            Search Jobs
          </button>
        </form>
      </div>
    </section>
  );
}

export default Home;