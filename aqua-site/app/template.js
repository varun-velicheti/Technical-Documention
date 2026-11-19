/** Re-mounts on navigation for a soft, flash-free page transition. */
export default function Template({ children }) {
  return <div className="page-enter">{children}</div>;
}
