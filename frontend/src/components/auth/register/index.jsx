import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/authContext';
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth';
import { motion } from 'framer-motion';
import { FaUserPlus, FaClipboardList, FaUserShield, FaLock } from 'react-icons/fa';

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { userLoggedIn } = useAuth();

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isRegistering) {
            setIsRegistering(true);
            await doCreateUserWithEmailAndPassword(email, password);
        }
    };

    return (
        <>
            {userLoggedIn && <Navigate to={'/dashboard'} replace={true} />}

            <div className="relative w-full h-screen overflow-hidden bg-teal-700" style={{ background: '#0f766e' }}>
    {/* Floating Registration Icons */}
    <motion.div className="absolute top-1/4 left-10 text-teal-200 text-4xl" animate={{ y: [0, 10, 0], transition: { repeat: Infinity, duration: 3, ease: "easeInOut" } }}>
        <FaUserPlus />
    </motion.div>
    <motion.div className="absolute bottom-10 left-5 text-teal-200 text-3xl" animate={{ y: [0, -10, 0], transition: { repeat: Infinity, duration: 3, ease: "easeInOut" } }}>
        <FaClipboardList />
    </motion.div>
    <motion.div className="absolute top-1/4 right-10 text-teal-200 text-4xl" animate={{ y: [0, 10, 0], transition: { repeat: Infinity, duration: 3, ease: "easeInOut" } }}>
        <FaUserShield />
    </motion.div>
    <motion.div className="absolute bottom-10 right-5 text-teal-300 text-3xl" animate={{ y: [0, -10, 0], transition: { repeat: Infinity, duration: 3, ease: "easeInOut" } }}>
        <FaLock />
    </motion.div>

    {/* Registration Form */}
    <main className="w-full h-screen flex items-center justify-center">
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-96 text-gray-200 space-y-5 p-8 shadow-2xl border border-teal-600 rounded-xl bg-teal-800"
        >
            <div className="text-center mb-6">
                <h3 className="text-white text-2xl font-semibold">Create a New Account</h3>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="text-sm text-gray-300 font-bold">Email</label>
                    <input
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mt-2 px-3 py-2 text-gray-900 bg-gray-200 outline-none border focus:border-teal-500 shadow-sm rounded-lg transition duration-300"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-300 font-bold">Password</label>
                    <input
                        disabled={isRegistering}
                        type="password"
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mt-2 px-3 py-2 text-gray-900 bg-gray-200 outline-none border focus:border-teal-500 shadow-sm rounded-lg transition duration-300"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-300 font-bold">Confirm Password</label>
                    <input
                        disabled={isRegistering}
                        type="password"
                        autoComplete="off"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full mt-2 px-3 py-2 text-gray-900 bg-gray-200 outline-none border focus:border-teal-500 shadow-sm rounded-lg transition duration-300"
                    />
                </div>

                {errorMessage && (
                    <span className="text-red-500 font-bold">{errorMessage}</span>
                )}

                <button
                    type="submit"
                    disabled={isRegistering}
                    className={`w-full px-4 py-2 text-white font-medium rounded-lg ${isRegistering ? 'bg-gray-300 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 hover:shadow-xl transition duration-300'}`}
                >
                    {isRegistering ? 'Signing Up...' : 'Sign Up'}
                </button>
                <div className="text-center text-sm">
                    Already have an account?{' '}
                    <Link to={'/login'} className="hover:underline font-bold text-teal-400">Continue</Link>
                </div>
            </form>
        </motion.div>
    </main>
</div>

        </>
    );
};

export default Register;
