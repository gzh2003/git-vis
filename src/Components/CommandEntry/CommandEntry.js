import "./CommandEntry.css";

function CommandEntry(props) {
  const { handleKeyUp } = props;
  return (
    <div className="command-entry-container">
      <input
        size="1"
        className="command-entry"
        onKeyUp={handleKeyUp}
        type="text"
        id="command-input"
        name="command-input"
      />
      <p className="command-symbol">&gt;</p>
    </div>
  );
}

export default CommandEntry;
