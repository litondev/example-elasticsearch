import Link from "next/link";
import { getCookies,setCookies,removeCookies } from 'cookies-next';
import Router from "next/router";

export default function DefaultLayout({children}){
    const onLogout = () => {
        removeCookies('token')
        Router.push('/')   
    }

    return (
        <>
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

                <li>
                    <a href="#"  
                        onClick={onLogout}>
                        Keluar
                    </a>
                </li>
            </ul>

            <div>
                {children}
            </div>
        </>
        )
}