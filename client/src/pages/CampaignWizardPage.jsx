import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const CampaignWizardPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        fundingGoal: 10000,
        durationDays: 30,
    });
    const [campaignId, setCampaignId] = useState(null);
    const [simulationResults, setSimulationResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Step 1: Create Draft
    const handleCreateDraft = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token') || ''}`, // Adjust auth retrieval as needed
                },
                withCredentials: true // Important for cookies
            };
            const res = await axios.post('http://localhost:5000/api/campaigns', formData, config);
            setCampaignId(res.data._id);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create draft');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Run Simulation
    const handleRunSimulation = async () => {
        setLoading(true);
        setError(null);
        try {
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
                withCredentials: true
            };
            const res = await axios.post(`http://localhost:5000/api/campaigns/${campaignId}/analyze`, {}, config);
            setSimulationResults(res.data.results);
        } catch (err) {
            setError(err.response?.data?.message || 'Simulation failed');
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Launch
    const handleLaunch = async () => {
        setLoading(true);
        setError(null);
        try {
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
                withCredentials: true
            };
            await axios.post(`http://localhost:5000/api/campaigns/${campaignId}/launch`, {}, config);
            navigate('/campaigns'); // Redirect to list
        } catch (err) {
            setError(err.response?.data?.message || 'Launch failed');
        } finally {
            setLoading(false);
        }
    };

    const renderSimulationChart = () => {
        if (!simulationResults || !simulationResults.distribution_graph) return null;

        const { labels, values } = simulationResults.distribution_graph;
        const { expectedFunding, confidenceInterval90, fundingGoal } = simulationResults;

        const data = {
            labels: labels.map(l => `$${Math.round(l)}`),
            datasets: [
                {
                    label: 'Probability Density',
                    data: values,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                },
            ],
        };

        const options = {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Funding Probability Distribution (Bell Curve)' },
                tooltip: {
                    callbacks: {
                        label: (context) => `Probability: ${(context.raw * 100).toFixed(4)}%`
                    }
                },
                annotation: { // Note: cleaner to draw vertical lines if plugin available, but using title for now
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Projected Funding ($)' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                y: {
                    display: false
                }
            }
        };

        return (
            <div style={{ height: '350px', margin: '20px 0' }}>
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>Risk Zone (P5): ${confidenceInterval90[0].toFixed(0)}</span>
                    <span>Expected (P50): ${expectedFunding.toFixed(0)}</span>
                    <span>Best Case (P95): ${confidenceInterval90[1].toFixed(0)}</span>
                </div>
                <Bar type='line' data={data} options={options} />
                <p className="text-sm mt-2 text-center text-gray-400">
                    This curve shows the range of possible outcomes. The peak is the most likely result.
                </p>
            </div>
        );
    };

    return (
        <div className="container mx-auto p-6 text-white bg-gray-900 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-yellow-400">Campaign Launch Wizard</h1>

            {error && <div className="bg-red-600 p-3 rounded mb-4">{error}</div>}

            {step === 1 && (
                <form onSubmit={handleCreateDraft} className="max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl mb-4">Step 1: Campaign Details</h2>
                    <div className="mb-4">
                        <label className="block mb-2">Title</label>
                        <input name="title" value={formData.title} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" required />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Funding Goal ($)</label>
                        <input type="number" name="fundingGoal" value={formData.fundingGoal} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" required />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Duration (Days)</label>
                        <input type="number" name="durationDays" value={formData.durationDays} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" required />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" required />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded font-bold">
                        {loading ? 'Creating Draft...' : 'Create Draft & Proceed'}
                    </button>
                </form>
            )}

            {step === 2 && (
                <div className="max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl mb-4 text-purple-400">Step 2: Simulation & Governance</h2>
                    <p className="mb-4 text-gray-300">
                        Per platform rules, we must run a Monte Carlo simulation to validate your funding goal against historical traffic and conversion benchmarks.
                    </p>

                    {!simulationResults ? (
                        <button onClick={handleRunSimulation} disabled={loading} className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded font-bold text-lg">
                            {loading ? 'Running 10,000 Simulations...' : 'RUN SIMULATION'}
                        </button>
                    ) : (
                        <div className="animation-fade-in">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-700 p-4 rounded text-center">
                                    <div className="text-sm text-gray-400">Success Probability</div>
                                    <div className={`text-3xl font-bold ${simulationResults.successProbability > 0.8 ? 'text-green-400' : simulationResults.successProbability > 0.5 ? 'text-yellow-400' : 'text-red-400'}`}>
                                        {(simulationResults.successProbability * 100).toFixed(1)}%
                                    </div>
                                </div>
                                <div className="bg-gray-700 p-4 rounded text-center">
                                    <div className="text-sm text-gray-400">Risk Level</div>
                                    <div className="text-3xl font-bold text-white">{simulationResults.riskLevel}</div>
                                </div>
                            </div>

                            {renderSimulationChart()}

                            <div className="p-4 bg-gray-900 rounded border border-gray-700 mb-6">
                                <h3 className="font-bold text-lg mb-2">Simulation Engine Output:</h3>
                                <p>Expected Funding: <span className="text-blue-400">${simulationResults.expectedFunding.toFixed(2)}</span></p>
                                <p>90% Confidence Interval: <span className="text-gray-400">[ ${simulationResults.confidenceInterval90[0].toFixed(0)} - ${simulationResults.confidenceInterval90[1].toFixed(0)} ]</span></p>
                            </div>

                            {['LOW', 'MODERATE'].includes(simulationResults.riskLevel) ? (
                                <button onClick={handleLaunch} disabled={loading} className="w-full bg-green-600 hover:bg-green-500 py-3 rounded font-bold text-lg">
                                    {loading ? 'Launching...' : 'APPROVE & LAUNCH CAMPAIGN'}
                                </button>
                            ) : (
                                <div className="text-center">
                                    <div className="text-red-500 font-bold mb-2">RISK TOO HIGH - LAUNCH BLOCKED</div>
                                    <p className="text-sm text-gray-400">Please adjust your goal or duration and try again (Edit function pending).</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CampaignWizardPage;
