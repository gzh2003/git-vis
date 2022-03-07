function CommandEntry(props) {
  const {handleKeyUp} = props;
  return (
    <div className="command-entry">
      <input
        onKeyUp={handleKeyUp}
        type="text"
        id="command-input"
        name="command-input"
      />
    </div>
  );
}

export default CommandEntry;