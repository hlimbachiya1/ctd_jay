import { Link } from 'react-router';
import styles from './NotFound.module.css';

function NotFound() {
  return (
    <div className={styles.notFoundContainer}>
      <h1 className={styles.errorCode}>404</h1>
      <h2 className={styles.errorMessage}>Page Not Found</h2>
      <p className={styles.description}>
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className={styles.homeLink}>
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFound;
