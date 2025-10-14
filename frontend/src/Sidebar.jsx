import "./Sidebar.css";

function Sidebar() {
  return (
    <section className="sidebar">

      <button>
        <img className="logo" src="src/assets/blacklogo.png" alt="logo" />
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>


      <div className="history">
        <ul>
          <li>Thread1: Hello</li>
          <li>Thread2: Hi there!</li>
        </ul>
      </div>

      <div className="sign">
        <p>Made with ❤️ by Amit Mehta</p>
      </div>
    </section>
  );
}
export default Sidebar;
