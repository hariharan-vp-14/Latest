import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { Card, Button, Alert, Loading } from '../components/UI';
import { CheckCircle, XCircle } from 'lucide-react';

export const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await apiService.verifyEmail(token);
        setStatus('success');
        setMessage(response.message);
      } catch (error) {
        setStatus('error');
        setMessage(error.message || 'Verification failed');
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <div className="text-center">
          {status === 'success' ? (
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          ) : (
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          )}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {status === 'success' ? 'Email Verified!' : 'Verification Failed'}
          </h1>
          <p className="text-gray-600 mb-6">{message}</p>
          <Button
            onClick={() => navigate('/login')}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Go to Login
          </Button>
        </div>
      </Card>
    </div>
  );
};