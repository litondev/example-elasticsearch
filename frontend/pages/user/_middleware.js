import { NextResponse } from 'next/server'

export function middleware(req) {
    if(!req.cookies.token){
        return NextResponse.redirect('/')
    }        
    return NextResponse.next()
}