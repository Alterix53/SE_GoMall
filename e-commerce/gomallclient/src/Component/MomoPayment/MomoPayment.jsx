import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QRCode from 'qrcode';
import momoPaymentAPI from '../../utils/momoPaymentAPI.js';
import Header from '../Header/Header';
import './MomoPayment.css';

const MomoPayment = ({ orderData, onBack }) => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [paymentData, setPaymentData] = useState(null);
	const [paymentStatus, setPaymentStatus] = useState('pending');
	const [error, setError] = useState(null);
	const [countdown, setCountdown] = useState(300); // 5 minutes countdown
	const [qrCodeUrl, setQrCodeUrl] = useState('');
	const [qrLoading, setQrLoading] = useState(true);

	// Use orderData from props instead of location state

	useEffect(() => {
		if (!orderData.orderID || !orderData.amount) {
			        setError('Invalid order information');
			return;
		}

		createMomoPayment();
	}, []);

	useEffect(() => {
		let interval;
		if (paymentStatus === 'pending' && countdown > 0) {
			interval = setInterval(() => {
				setCountdown(prev => {
					if (prev <= 1) {
						// Timeout - tự động quay về trang chủ
						console.log('Payment timeout - redirecting to home');
						navigate('/');
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [paymentStatus, countdown, navigate]);

	// Tạo giao dịch MoMo
	const createMomoPayment = async () => {
		try {
			setLoading(true);
			setError(null);
			setQrLoading(true);

			const orderInfo = `Thanh toan don hang ${orderData.orderNumber || orderData.orderID}`;
			
			console.log('Creating payment with data:', {
				orderID: orderData.orderID,
				amount: orderData.amount,
				orderInfo
			});
			
			// Thử tạo payment thông thường trước
			let response;
			try {
				response = await momoPaymentAPI.createPayment(
					orderData.orderID,
					orderData.amount,
					orderInfo
				);
			} catch (authError) {
				console.log('Authentication failed, trying test payment:', authError);
				// Nếu authentication thất bại, sử dụng test payment
				response = await momoPaymentAPI.createTestPayment(
					orderData.orderID,
					orderData.amount,
					orderInfo
				);
			}

			console.log('Payment creation response:', response);

			if (response.data && response.data.success && response.data.data) {
				setPaymentData(response.data.data);
				
				console.log('Payment URL for QR:', response.data.data.paymentUrl);
				
				// Tạo QR code từ payment URL
				if (response.data.data.paymentUrl) {
					try {
						const qrCodeDataUrl = await QRCode.toDataURL(response.data.data.paymentUrl, {
							width: 400,
							margin: 0,
							color: {
								dark: '#000000',
								light: '#FFFFFF'
							},
							errorCorrectionLevel: 'M'
						});
						setQrCodeUrl(qrCodeDataUrl);
						console.log('QR Code generated successfully');
					} catch (qrError) {
						console.error('Error generating QR code:', qrError);
						// Fallback to placeholder
						setQrCodeUrl('');
					}
				} else {
					console.error('No payment URL received');
					// Tạo QR code test với URL giả
					try {
						const testUrl = `https://momo.vn/pay?orderId=${response.data.data.orderId || orderData.orderID}&amount=${orderData.amount}`;
						const qrCodeDataUrl = await QRCode.toDataURL(testUrl, {
							width: 400,
							margin: 0,
							color: {
								dark: '#000000',
								light: '#FFFFFF'
							},
							errorCorrectionLevel: 'M'
						});
						setQrCodeUrl(qrCodeDataUrl);
						console.log('Test QR Code generated successfully');
					} catch (qrError) {
						console.error('Error generating test QR code:', qrError);
						setQrCodeUrl('');
					}
				}
				
				setQrLoading(false);
				
				// Bắt đầu polling để kiểm tra trạng thái
				if (response.data.data.requestId) {
					startStatusPolling(response.data.data.requestId);
				}
			} else {
				        setError('Cannot create payment transaction');
				setQrLoading(false);
			}
		} catch (error) {
			console.error('Error creating payment:', error);
			setQrLoading(false);
			
			// Kiểm tra lỗi authentication
			if (error.message && error.message.includes('Access token required')) {
				setError('Login session has expired. Please login again!');
			} else if (error.message && error.message.includes('401')) {
				setError('Login session has expired. Please login again!');
			} else if (error.message && error.message.includes('403')) {
				setError('Access denied. Please login again!');
			} else if (error.response?.status === 500) {
				setError('Server error. Please try again later or contact support!');
			} else if (error.response?.status === 404) {
				setError('API endpoint does not exist. Please check configuration!');
			} else if (error.code === 'NETWORK_ERROR') {
				setError('Cannot connect to server. Please check network connection!');
			} else {
				// Hiển thị lỗi chi tiết để debug
				const errorMessage = error.message || 'Unknown error';
				const statusCode = error.response?.status || 'N/A';
				console.log('Detailed error:', error);
				setError(`Error ${statusCode}: ${errorMessage}. Please try again or contact support!`);
			}
		} finally {
			setLoading(false);
		}
	};

	// Polling để kiểm tra trạng thái giao dịch
	const startStatusPolling = (requestId) => {
		if (!requestId) {
			console.error('No requestId provided for polling');
			return;
		}

		console.log('Starting payment status polling for requestId:', requestId);
		
		const pollInterval = setInterval(async () => {
			try {
				const response = await momoPaymentAPI.checkPaymentStatus(requestId);
				
				console.log('Payment status response:', response);
				
				if (response.data && response.data.success && response.data.data) {
					const status = response.data.data.status || response.data.data.payment?.status;
					if (status) {
						setPaymentStatus(status.toLowerCase());
						
						if (status === 'SUCCESS' || status === 'FAILED' || status === 'CANCELLED') {
							clearInterval(pollInterval);
							
							if (status === 'SUCCESS') {
								// Redirect to success page
								setTimeout(() => {
									navigate('/payment/success', { 
										state: { 
											paymentData: response.data.data,
											orderData 
										} 
									});
								}, 2000);
							} else if (status === 'FAILED') {
								// Redirect to failed page
								setTimeout(() => {
									navigate('/payment/failed', { 
										state: { 
											paymentData: response.data.data,
											orderData 
										} 
									});
								}, 2000);
							}
						}
					}
				}
			} catch (error) {
				console.error('Error checking payment status:', error);
				// Don't stop polling on error, just log it
			}
		}, 5000); // Check every 5 seconds instead of 3

		// Cleanup interval after 5 minutes
		setTimeout(() => {
			clearInterval(pollInterval);
			console.log('Payment status polling stopped after 5 minutes');
		}, 300000);
	};

	// Hủy giao dịch
	const cancelPayment = async () => {
		if (!paymentData?.requestId) {
			// Nếu không có requestId, quay về trang chủ
			navigate('/');
			return;
		}

		try {
			setLoading(true);
			setError(null);
			
			const response = await momoPaymentAPI.cancelPayment(paymentData.requestId);
			console.log('Cancel payment response:', response);
			
			setPaymentStatus('cancelled');
			
			// Chuyển hướng sau 1 giây
			setTimeout(() => {
				navigate('/payment/cancelled', { 
					state: { 
						paymentData: response.data || paymentData,
						orderData 
					} 
				});
			}, 1000);
			
		} catch (error) {
			console.error('Error cancelling payment:', error);
			
			// Kiểm tra loại lỗi
			if (error.message && error.message.includes('401')) {
				setError('Login session has expired. Please login again!');
			} else if (error.message && error.message.includes('404')) {
				setError('Transaction does not exist or has been processed');
			} else if (error.message && error.message.includes('403')) {
				setError('No permission to cancel this transaction');
			} else {
				setError('An error occurred while canceling transaction. Please try again!');
			}
			
			// Fallback: quay về trang chủ sau 3 giây nếu có lỗi
			setTimeout(() => {
				navigate('/');
			}, 3000);
		} finally {
			setLoading(false);
		}
	};





	// Format amount
	const formatAmount = (amount) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND'
		}).format(amount);
	};

	// Format countdown
	const formatCountdown = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	};

	// Error state
	if (error) {
		return (
			<>
				<Header />
				<div className="momo-payment-container">
					<div className="momo-payment-card error">
						<div className="momo-logo">
							<img src="/images/momo-logo.svg" alt="MoMo" />
						</div>
						<h2>Payment Error</h2>
						<p>{error}</p>
						
						{/* Thêm thông tin debug */}
						<div className="error-debug" style={{ 
							marginTop: '15px', 
							padding: '15px', 
							backgroundColor: '#f8f9fa', 
							borderRadius: '8px', 
							fontSize: '12px',
							border: '1px solid #e9ecef'
						}}>
							<strong>Debug Information:</strong>
							<div>Order ID: {orderData?.orderID}</div>
							<div>Amount: {orderData?.amount ? `${orderData.amount.toLocaleString('vi-VN')} VNĐ` : 'N/A'}</div>
							<div>Time: {new Date().toLocaleString('vi-VN')}</div>
						</div>
						
						<div className="error-actions" style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
							<button 
								className="momo-btn primary"
								onClick={onBack}
								style={{ flex: 1, maxWidth: '200px' }}
							>
								Back to Checkout
							</button>
							<button 
								className="momo-btn secondary"
								onClick={() => window.location.reload()}
								style={{ flex: 1, maxWidth: '200px' }}
							>
								Try Again
							</button>
						</div>
					</div>
				</div>
			</>
		);
	}

	// Loading state (initial)
	if (loading && !paymentData) {
		return (
			<>
				<Header />
				<div className="momo-payment-container">
					<div className="momo-payment-card loading">
						<div className="momo-logo">
							<img src="/images/momo-logo.svg" alt="MoMo" />
						</div>
						<div className="loading-spinner"></div>
						<p>Creating payment transaction...</p>
					</div>
				</div>
			</>
		);
	}

	return (
		<>
			<Header />
			<div className="momo-payment-container">
				<div className="momo-payment-card">
					<div className="momo-header">
						<div className="momo-logo">
							<img src="/images/momo-logo.svg" alt="MoMo" />
						</div>
						<h2>MoMo Payment</h2>
					</div>

					<div className="payment-info">
						<div className="info-row">
							<span>Order ID:</span>
							<span>{orderData.orderNumber || orderData.orderID}</span>
						</div>
						<div className="info-row">
							<span>Amount:</span>
							<span className="amount">{formatAmount(orderData.amount)}</span>
						</div>
						<div className="info-row">
							<span>Time:</span>
							<span className="countdown">{formatCountdown(countdown)}</span>
						</div>
					</div>

					<div className="qr-section">
						<div className="qr-code">
							{qrLoading ? (
								<div className="qr-placeholder">
									<div className="loading-spinner" style={{ width: '40px', height: '40px' }}></div>
									<p>Creating QR code...</p>
								</div>
							) : qrCodeUrl ? (
								<img 
									src={qrCodeUrl} 
									alt="MoMo QR Code" 
									className="qr-code-image"
									onError={() => {
										console.error('QR code image failed to load');
									}}
								/>
							) : (
								<div className="qr-placeholder">
									<div className="qr-placeholder-image">
										<svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
											<rect x="40" y="40" width="320" height="320" fill="white" stroke="#e0e0e0" strokeWidth="8"/>
											<rect x="80" y="80" width="60" height="60" fill="#e91e63"/>
											<rect x="160" y="80" width="60" height="60" fill="#e91e63"/>
											<rect x="240" y="80" width="60" height="60" fill="#e91e63"/>
											<rect x="80" y="160" width="60" height="60" fill="#e91e63"/>
											<rect x="160" y="160" width="60" height="60" fill="white"/>
											<rect x="240" y="160" width="60" height="60" fill="#e91e63"/>
											<rect x="80" y="240" width="60" height="60" fill="#e91e63"/>
											<rect x="160" y="240" width="60" height="60" fill="#e91e63"/>
											<rect x="240" y="240" width="60" height="60" fill="#e91e63"/>
											<rect x="110" y="110" width="30" height="30" fill="white"/>
											<rect x="190" y="110" width="30" height="30" fill="white"/>
											<rect x="110" y="190" width="30" height="30" fill="white"/>
											<rect x="190" y="190" width="30" height="30" fill="white"/>
										</svg>
									</div>
									<p>Cannot create QR code</p>
									<button 
										className="momo-btn primary"
										onClick={createMomoPayment}
										style={{ marginTop: '10px', fontSize: '12px', padding: '8px 16px' }}
									>
										Try Again
									</button>
								</div>
							)}
						</div>
						<p className="qr-instruction">
							Open MoMo app and scan QR code to pay
						</p>
					</div>

					<div className="payment-status">
						<div className={`status-indicator ${paymentStatus}`}>
							{paymentStatus === 'pending' && 'Waiting for payment...'}
							{paymentStatus === 'processing' && 'Processing...'}
							{paymentStatus === 'success' && 'Payment successful!'}
							{paymentStatus === 'failed' && 'Payment failed'}
							{paymentStatus === 'cancelled' && 'Transaction cancelled'}
						</div>
					</div>

					<div className="action-buttons">
						<button 
							className="momo-btn secondary"
							onClick={cancelPayment}
							disabled={loading || paymentStatus !== 'pending'}
						>
							Cancel Transaction
						</button>
					</div>

					{/* Quick Test Page Button */}
					<div className="quick-test" style={{ marginTop: '20px', textAlign: 'center' }}>
						<button 
							className="momo-btn primary"
							onClick={() => navigate('/payment/test', { state: { orderData } })}
							style={{ fontSize: '14px', padding: '12px 20px', backgroundColor: '#9c27b0', minWidth: '200px' }}
						>
							🧪 Payment Test Page
						</button>
						<p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
							💡 Go to a separate test page with 2 payment success/failure buttons
						</p>
					</div>



					<div className="payment-note">
						<p>💡 Note: Transaction will be automatically cancelled after 5 minutes if not processed</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default MomoPayment;
