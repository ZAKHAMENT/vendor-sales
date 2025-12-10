import React, {useState, useEffect} from "react";
import styles from "./Layout.module.css"
import { Outlet, Link } from "react-router-dom";
import { UserDataContext } from './UserDataContext.jsx';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
      useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize(); // initial check
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
  return (
    <>
    
    <nav className={styles.nav}>
        <img className={styles.logo} src="https://mir-s3-cdn-cf.behance.net/project_modules/hd/7a3ec529632909.55fc107b84b8c.png" alt="" />
        {!isMobile && (
        <div className={styles.navContentContainer}>
        <span ><Link style={{textDecoration: "none", color: "white"}} to="/home">Home</Link></span>
        <span > <Link style={{textDecoration: "none", color: "white"}} to="/customers">Customers</Link></span>
        <span > <Link style={{textDecoration: "none", color: "white"}} to="/sales">Sales</Link></span>
        <span > <Link style={{textDecoration: "none", color: "white"}} to="/history">History</Link></span>
        </div>
        )}

        <div>
            {isMobile ? (
                <>
                 <svg onClick={() => setSidebarOpen(true)} width={24} height={24} fill="none" stroke="#5400f0" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M3 12h18" />
  <path d="M3 6h18" />
  <path d="M3 18h18" />
</svg>
                </>
            ) : (
              <div className={styles.logAndUserContainer}>
  <svg className={styles.userIcon} width={24} height={24} fill="none" stroke="#5400f0" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
  <path d="M12 3a4 4 0 1 0 0 8 4 4 0 1 0 0-8z" />
</svg>
|
  <button className={styles.logoutBtn}>Logout</button>
        </div>
            )}

        {sidebarOpen && (
          <>
                              <div className={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)}></div>
                    <div className={styles.sidebar}>
                        <button className={styles.closeBtn} onClick={() => setSidebarOpen(false)}>×</button>
                        <span>Home</span>
                        <span>LeaderBoard</span>
                        <span>Activity</span>
                    </div>
                              </>

        )}
        </div>
    </nav>
    <Outlet/>
    </>
  )
}

export default Layout;
