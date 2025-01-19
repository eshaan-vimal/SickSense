import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../../../firebase/auth';
import { useAuth } from '../../../contexts/authContext';
import { motion } from 'framer-motion';
import { FaUserMd, FaPills, FaHeartbeat, FaStethoscope } from 'react-icons/fa';

const Login = () => {
    const { userLoggedIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            await doSignInWithEmailAndPassword(email, password);
        }
    };

    const onGoogleSignIn = (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            doSignInWithGoogle().catch(err => {
                setIsSigningIn(false);
                setErrorMessage("Google Sign-In failed.");
            });
        }
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
<div className="relative w-full h-screen overflow-hidden bg-teal-700" style={{ background: '#0f766e' }}>
    {userLoggedIn && (<Navigate to={'/dashboard'} replace={true} />)}

    {/* Dynamic Grid Overlay */}
    <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, row) =>
            [...Array(30)].map((_, col) => {
                const distance = Math.sqrt(
                    Math.pow(mousePosition.x - (col * 50 + 25), 2) +
                    Math.pow(mousePosition.y - (row * 50 + 25), 2)
                );
                const opacity = distance < 200 ? 1 - distance / 200 : 0;

                return (
                    <motion.div
                        key={`${row}-${col}`}
                        className="absolute w-1 h-1 bg-teal-400 rounded-full"
                        style={{
                            left: col * 50 + 'px',
                            top: row * 50 + 'px',
                            opacity,
                        }}
                    />
                );
            })
        )}
    </div>

    {/* Floating Medical Icons */}
    <motion.div className="absolute top-1/4 left-10 text-teal-200 text-4xl" animate={{ y: [0, 10, 0], transition: { repeat: Infinity, duration: 3, ease: "easeInOut" } }}>
        <FaHeartbeat />
    </motion.div>
    <motion.div className="absolute bottom-10 left-5 text-teal-200 text-3xl" animate={{ y: [0, -10, 0], transition: { repeat: Infinity, duration: 3, ease: "easeInOut" } }}>
        <FaPills />
    </motion.div>
    <motion.div className="absolute top-1/4 right-10 text-teal-200 text-4xl" animate={{ y: [0, 10, 0], transition: { repeat: Infinity, duration: 3, ease: "easeInOut" } }}>
        <FaStethoscope />
    </motion.div>
    <motion.div className="absolute bottom-10 right-5 text-teal-300 text-3xl" animate={{ y: [0, -10, 0], transition: { repeat: Infinity, duration: 3, ease: "easeInOut" } }}>
        <FaUserMd />
    </motion.div>

    {/* Login Form */}
    <main className="relative flex justify-center items-center z-10 h-screen">
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-96 text-gray-200 space-y-5 p-8 shadow-2xl border border-teal-600 rounded-xl bg-teal-800"
        >
            <div className="text-center flex flex-col items-center space-y-2">
                <FaUserMd className="text-teal-400 text-5xl" />
                <h3 className="text-white text-2xl font-semibold">Welcome Back</h3>
                <p className="text-sm text-gray-300">Please sign in to access your health dashboard</p>
            </div>
            <form onSubmit={onSubmit} className="space-y-5">
                <motion.div whileFocus={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                    <label className="text-sm text-gray-300 font-bold">Email</label>
                    <input
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); }}
                        className="w-full mt-2 px-3 py-2 text-gray-900 bg-gray-200 outline-none border focus:border-teal-500 shadow-sm rounded-lg transition duration-300"
                    />
                </motion.div>
                
                <motion.div whileFocus={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                    <label className="text-sm text-gray-300 font-bold">Password</label>
                    <input
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); }}
                        className="w-full mt-2 px-3 py-2 text-gray-900 bg-gray-200 outline-none border focus:border-teal-500 shadow-sm rounded-lg transition duration-300"
                    />
                </motion.div>

                {errorMessage && (
                    <motion.span 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="text-red-500 font-bold"
                    >
                        {errorMessage}
                    </motion.span>
                )}

                <motion.button
                    type="submit"
                    disabled={isSigningIn}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full px-4 py-2 text-white font-medium rounded-lg flex items-center justify-center gap-x-2 ${isSigningIn ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 transition duration-200'}`}
                >
                    <FaPills />
                    {isSigningIn ? 'Signing In...' : 'Sign In'}
                </motion.button>
            </form>

            <p className="text-center text-sm">Don't have an account? <Link to={'/register'} className="hover:underline font-bold text-teal-400">Sign up</Link></p>

            <div className="flex items-center my-3">
                <div className="flex-grow border-t border-gray-600"></div>
                <span className="mx-2 text-gray-500 font-bold">OR</span>
                <div className="flex-grow border-t border-gray-600"></div>
            </div>

            <motion.button
                disabled={isSigningIn}
                onClick={(e) => { onGoogleSignIn(e); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full flex items-center justify-center gap-x-3 py-2.5 border rounded-lg text-sm font-medium ${isSigningIn ? 'cursor-not-allowed' : 'hover:bg-teal-600 transition duration-300'}`}
            >
                <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* SVG paths for Google logo */}
                </svg>
                {isSigningIn ? 'Signing In...' : 'Continue with Google'}
            </motion.button>
        </motion.div>
    </main>
</div>
    );
};

export default Login;
