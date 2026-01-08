import React, { useState } from 'react';

const PortfolioPreview = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">

            {/* --- NAVIGATION (Glass Effect) --- */}
            <nav className="fixed w-full z-50 top-0 px-6 py-4 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="text-xl font-bold tracking-tighter text-white">
                        <span className="text-cyan-400">&lt;</span>Dev
                        <span className="text-cyan-400">/&gt;</span>
                    </div>
                    <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
                        <a href="#work" className="hover:text-cyan-400 transition-colors">Work</a>
                        <a href="#stack" className="hover:text-cyan-400 transition-colors">Stack</a>
                        <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left: Text Content */}
                    <div className="space-y-6">
                        <div className="inline-block px-3 py-1 text-xs font-semibold tracking-wide text-cyan-400 bg-cyan-400/10 rounded-full border border-cyan-400/20">
                            AVAILABLE FOR HIRE
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
                            Full Stack <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                                Architect.
                            </span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-lg">
                            I bridge the gap between robust backends and sleek frontends.
                            Currently building scalable web apps with the MERN stack.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <button className="px-6 py-3 bg-cyan-500 text-slate-950 font-bold rounded-lg hover:bg-cyan-400 transition-all hover:scale-105">
                                View Projects
                            </button>
                            <button className="px-6 py-3 border border-slate-700 rounded-lg hover:border-cyan-400/50 hover:bg-slate-900 transition-all">
                                Github
                            </button>
                        </div>
                    </div>

                    {/* Right: The "Code" Visual (Shows Backend Skills) */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                        <div className="relative bg-slate-900 rounded-xl border border-slate-800 p-4 font-mono text-sm shadow-2xl">
                            <div className="flex gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                            </div>
                            <div className="space-y-2 text-slate-300">
                                <p>
                                    <span className="text-purple-400">const</span> <span className="text-yellow-200">developer</span> = <span className="text-purple-400">{`{`}</span>
                                </p>
                                <p className="pl-4">
                                    name: <span className="text-green-400">'Full Stack Dev'</span>,
                                </p>
                                <p className="pl-4">
                                    stack: [<span className="text-green-400">'MongoDB'</span>, <span className="text-green-400">'Express'</span>, <span className="text-green-400">'React'</span>, <span className="text-green-400">'Node'</span>],
                                </p>
                                <p className="pl-4">
                                    hardWorker: <span className="text-cyan-400">true</span>,
                                </p>
                                <p className="pl-4">
                                    solveProblems: <span className="text-blue-400">function</span>() <span className="text-purple-400">{`{`}</span>
                                </p>
                                <p className="pl-8 text-slate-500">// TODO: Build something amazing</p>
                                <p className="pl-8">
                                    <span className="text-purple-400">return</span> <span className="text-green-400">"Solutions"</span>;
                                </p>
                                <p className="pl-4"><span className="text-purple-400">{`}`}</span></p>
                                <p><span className="text-purple-400">{`}`}</span>;</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PROJECTS PREVIEW --- */}
            <section id="work" className="py-20 bg-slate-900/50">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-white mb-12">Featured Projects</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <ProjectCard
                            title="Sleek Mind"
                            tags={['React', 'Tailwind', 'Framer Motion']}
                            desc="A mental health tracking platform featuring a minimalist UI and real-time data visualization."
                        />
                        {/* Card 2 */}
                        <ProjectCard
                            title="E-Commerce API"
                            tags={['Node.js', 'Express', 'MongoDB']}
                            desc="A robust REST API handling authentication, cart logic, and payment gateway integration."
                        />
                        {/* Card 3 */}
                        <ProjectCard
                            title="DevPortfolio"
                            tags={['Three.js', 'React', 'Vite']}
                            desc="Interactive 3D portfolio showcasing web development projects in a virtual space."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

// Simple internal component for the cards
const ProjectCard = ({ title, tags, desc }) => (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 hover:border-cyan-500/30 transition-all hover:-translate-y-1 group">
        <div className="h-40 mb-6 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-800 group-hover:bg-slate-800 transition-colors">
            <span className="text-slate-600 font-medium">Project Preview Image</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-sm mb-4 leading-relaxed">{desc}</p>
        <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
                <span key={i} className="text-xs font-medium text-cyan-300 bg-cyan-950/50 px-2 py-1 rounded">
                    {tag}
                </span>
            ))}
        </div>
    </div>
);

export default PortfolioPreview;