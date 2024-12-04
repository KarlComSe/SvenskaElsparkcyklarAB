// import React, { useState } from 'react';

const RegisterPage: React.FC = () => {

    return (
        <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Registrera dig</h1>
        <form 
        //   onSubmit={handleSubmit}
        className="space-y-4 text-gray-500">
            <input
            type="text"
            placeholder="Användarnamn"
            //   value={username}
            //   onChange={(e) => setUsername(e.target.value)}
            className="border p-2 rounded w-full"
            />
            <input
            type="email"
            placeholder="E-post"
            //   value={email}
            //   onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded w-full"
            />
            <input
            type="password"
            placeholder="Lösenord"
            //   value={password}
            //   onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full"
            />
            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
            Registrera
            </button>
        </form>
        </div>
    );
    };
    
    export default RegisterPage;