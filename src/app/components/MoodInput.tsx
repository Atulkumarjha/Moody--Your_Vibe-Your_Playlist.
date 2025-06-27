'use client'

import { useState } from 'react';

export default function MoodInput ({ onMoodDetected }: (Mood: string) => void }) {
    const [input, setinput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.formEvent) => {
        e.preventDefault();
        setLoading(true);

        try{
            const res = await fetch('/api/mood', {
                method: 'POST',
                body: JSON.stringify({ input }),
                headers: {
                    'content-Type': 'application/json',
                },
            });

            const data = await res.json();
            onMoodDetected(data.mood);
        }catch (err) 
        {
            console.error("Mood Detection failed:", err);
            onMoodDetected('unknown');
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input 
            type='text'
            placeholder='Your mood... 😄'
            value={input}
            onChsnge={(e) => setinput(e.target.value)}
            className='p-2 w-full rounded bg-gray-800 text-white'
            required
            />
            <button type="submit" className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700">
                {loading ? 'Detecting...' : 'Detect Mood'}
      </button>
        </form>
    );
}
