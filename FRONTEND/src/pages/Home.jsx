import { Link } from "react-router-dom";
function Home() {
    return (
      <div>
        <h1>This is the home page</h1>
        <Link to="about">about</Link>
        <Link to="login">login</Link>
        <Link to="signup">signup</Link>

      </div>
    );
  }
  
  export default Home;