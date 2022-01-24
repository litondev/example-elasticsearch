import { useContext,useEffect } from "react";
import AppContext from "@/contexts/state"
import Link from "next/link";

export default function Home() {
  const auth = useContext(AppContext);

  useEffect(() => {
    console.log(auth);
  }, [])

  return (
    <>
     Hello Guest
     {
      auth.auth && (
        <ul>
          <li>
            <Link href="/">Home</Link>                                                                
          </li>                    
          <li>
            <Link href="/product">Product</Link>
          </li>
          <li>
              <Link href="/user">User</Link>
          </li>
        </ul> 
      )}
    </>
  )
}
