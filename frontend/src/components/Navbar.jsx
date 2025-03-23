const Navbar = () => {
  return (
    <div>
      <ul className="flex gap-4">
        <li><a href="/">Home</a></li>
        <li><a href="/tasks">Tasks</a></li>        
      </ul>
    </div>
  );
};

export default Navbar;