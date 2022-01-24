import Head from "next/head";
import Link from "next/link";
import Router from "next/router";

import {useState} from "react"
import { getCookies,setCookies,removeCookies } from 'cookies-next';

import {ToastError,ToastSuccess} from "@/librarys/toaster"
import axiosClient from "@/librarys/axiosClient";

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const SigninSchema = Yup.object()
    .shape({      
        // password: Yup.string()
        //     .min(8, 'Too Short!')
        //     .max(50, 'Too Long!')
        //     .required('Required'),
        // email: Yup.string()
        //     .email('Invalid email')
        //     .required('Required'),
    });


const Signin = () => {
 

    const [form] = useState({
        email : '', 
        password : ''
    })

    const onSubmit = (values,{setErrors,setSubmitting}) => {            
        axiosClient.post("/auth/signin",values)
        .then(res => {
            setSubmitting(false)
            setCookies('token',res.data.access_token);        
            Router.push('/')   
        })           
        .catch(err => {         
            console.log(err)     
            setSubmitting(false)     
            ToastError(err,setErrors)                  
        })
    }

    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <div>
                <h1>Login</h1>

                <Formik
                    initialValues={form}
                    validationSchema={SigninSchema}
                    onSubmit={onSubmit}>
                    {({isSubmitting,resetForm}) => (                
                        <Form>
                            <div>
                                <Field 
                                    type="email" 
                                    name="email"
                                    placeholder="Email . . ." />

                                <ErrorMessage  
                                    name="email" 
                                    component="div" />
                            </div>

                            <div>
                                <Field 
                                    type="password" 
                                    name="password" 
                                    placeholder="Password . . ."/>

                                <ErrorMessage  
                                    name="password" 
                                    component="div" />
                            </div>

                            <div>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}>
                                    {isSubmitting ? '...' : 'Submit'}
                                </button>
                                <button type="reset"
                                    onClick={resetForm}>
                                    Reset
                                </button>
                            </div>

                            <div>                                                        
                                <Link href="/auth/register">Daftar</Link>                                                                
                            </div>
                        </Form>
                        )
                    }
                </Formik>
            </div>
        </>
    )
}

export default Signin;