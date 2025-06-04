import styles from './About.module.css';

function About() {
  return (
    <div className={styles.aboutContainer}>
      <h2>About This Todo App</h2>

      <p>
        Built with React and integrated with Airtable for data persistence. The
        app demonstrates React concepts like hooks, reducers, routing, and
        pagination.
      </p>

      <h3>Features</h3>
      <ul>
        <li>Add, edit, and complete todos</li>
        <li>Real-time synchronization with Airtable</li>
        <li>Search and filter functionality</li>
        <li>Pagination for large todo lists (15 items per page)</li>
        <li>Client-side routing with React Router</li>
      </ul>
    </div>
  );
}
export default About;
