function InputPage({ goNext }) {
  return (
    <div>
      <h2>Enter Requirement</h2>

      <input placeholder="500 person catering in Bangalore" />

      <button onClick={goNext}>Run Agent</button>
    </div>
  );
}
export default InputPage;