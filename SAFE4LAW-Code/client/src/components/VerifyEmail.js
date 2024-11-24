import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/verify-email/${token}`);
                if (response.data.alreadyVerified) {
                    toast.info('Email already verified');
                } else {
                    toast.success('Email verified successfully');
                }
                setLoading(false);
                setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
            } catch (error) {
                console.error('Verification error:', error);
                toast.error(error.response?.data?.message || 'Verification failed');
                setLoading(false);
                setTimeout(() => navigate('/login'), 2000);
            }
        };

        verifyToken();
    }, [token, navigate]);

    if (loading) {
        return <p>Verifying your email...</p>;
    }

    return (
        <div>
            <ToastContainer position="top-center" autoClose={9000} />
        </div>
    );
};

export default VerifyEmail;
