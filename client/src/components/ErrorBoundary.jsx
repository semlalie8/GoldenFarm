import React from 'react';
import { Container, Button, Card } from 'react-bootstrap';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("System Protocol Violation Detected:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light" style={{ background: 'radial-gradient(circle at center, #f8fafc 0%, #e2e8f0 100%)' }}>
                    <Container>
                        <Card className="border-0 shadow-lg p-5 rounded-5 text-center mx-auto" style={{ maxWidth: '600px' }}>
                            <div className="d-inline-flex p-4 rounded-circle bg-danger bg-opacity-10 mb-4">
                                <AlertTriangle size={64} className="text-danger" />
                            </div>
                            <h1 className="fw-black text-dark text-uppercase mb-3 ls-1">Critical Fault Detected</h1>
                            <p className="text-secondary mb-4 fs-5 fw-medium">
                                The system encountered a runtime exception during protocol execution. Safe-mode has been engaged.
                            </p>

                            <div className="bg-light rounded-4 p-3 mb-4 text-start font-monospace small border border-secondary border-opacity-10 overflow-auto" style={{ maxHeight: '150px' }}>
                                <span className="text-danger fw-bold">ERROR:</span> {this.state.error?.toString()}
                            </div>

                            <div className="d-grid gap-3">
                                <Button
                                    onClick={() => window.location.reload()}
                                    variant="primary"
                                    className="rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                                >
                                    <RefreshCw size={20} />
                                    REBOOT SYSTEM
                                </Button>
                                <Button
                                    href="/"
                                    variant="outline-secondary"
                                    className="rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                                >
                                    <Home size={20} />
                                    RETURN TO COMMAND CENTER
                                </Button>
                            </div>
                        </Card>
                    </Container>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
