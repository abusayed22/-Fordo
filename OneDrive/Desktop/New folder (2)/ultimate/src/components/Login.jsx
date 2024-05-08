"use client"
import React from 'react'
import '../../public/assets/login.css'

function Login() {
    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <div className='w-[300px]'>
                <div className="login_main">
                    <input type="checkbox" id="chk" aria-hidden="true" />
                    <div className="login">
                        <form className="login_form">
                            <label htmlFor="chk" aria-hidden="true">
                                Log in
                            </label>
                            <input
                                className="input"
                                type="email"
                                name="email"
                                placeholder="Email"
                                required=""
                            />
                            <input
                                className="input"
                                type="password"
                                name="pswd"
                                placeholder="Password"
                                required=""
                            />
                            <button>Log in</button>
                        </form>
                    </div>
                    <div className="register ">
                        <form className="form">
                            <div className='flex flex-col items-center'>
                                <label htmlFor="chk" aria-hidden="true">
                                    Register
                                </label>
                                <input
                                    className="input mt-8"
                                    type="text"
                                    name="txt"
                                    placeholder="Username"
                                    required=""
                                />
                                <input
                                    className="input"
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    required=""
                                />
                                <input
                                    className="input"
                                    type="password"
                                    name="pswd"
                                    placeholder="Password"
                                    required=""
                                />
                                <button>Register</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
