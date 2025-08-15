import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import momoPaymentAPI from '../../utils/momoPaymentAPI.js';
import './MomoPayment.css';

const QRTest = () => {
    const [testResults, setTestResults] = useState({});
    const [loading, setLoading] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [testPayment, setTestPayment] = useState(null);
    const [logs, setLogs] = useState([]);

    const addLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, { timestamp, message, type }]);
        console.log(`[${timestamp}] ${message}`);
    };

    const clearLogs = () => {
        setLogs([]);
    };

    // Test 1: Kiểm tra kết nối API
    const testAPIConnection = async () => {
        setLoading(true);
        addLog('🔍 Bắt đầu kiểm tra kết nối API...', 'info');
        
        try {
            const response = await momoPaymentAPI.healthCheck();
            addLog(`✅ Health check thành công: ${JSON.stringify(response)}`, 'success');
            setTestResults(prev => ({ ...prev, apiConnection: 'PASS' }));
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
            addLog(`❌ Health check thất bại: ${errorMessage}`, 'error');
            
            // Log chi tiết lỗi để debug
            if (error.response?.data) {
                addLog(`📋 Chi tiết lỗi: ${JSON.stringify(error.response.data)}`, 'error');
            }
            
            setTestResults(prev => ({ ...prev, apiConnection: 'FAIL' }));
        } finally {
            setLoading(false);
        }
    };

    // Test 2: Tạo giao dịch test
    const testCreatePayment = async () => {
        setLoading(true);
        addLog('🔍 Bắt đầu tạo giao dịch test...', 'info');
        
        try {
            const testOrderData = {
                orderID: `TEST_${Date.now()}`,
                amount: 10000, // 10,000 VND
                orderInfo: 'Test payment for MoMo integration'
            };

            addLog(`📝 Tạo giao dịch với dữ liệu: ${JSON.stringify(testOrderData)}`, 'info');
            
            const response = await momoPaymentAPI.createTestPayment(
                testOrderData.orderID,
                testOrderData.amount,
                testOrderData.orderInfo
            );

            addLog(`✅ Tạo giao dịch thành công: ${JSON.stringify(response)}`, 'success');
            setTestPayment(response.data);
            setTestResults(prev => ({ ...prev, createPayment: 'PASS' }));

            // Tạo QR code
            if (response.data.paymentUrl) {
                await generateQRCode(response.data.paymentUrl);
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
            addLog(`❌ Tạo giao dịch thất bại: ${errorMessage}`, 'error');
            
            // Log chi tiết lỗi để debug
            if (error.response?.data) {
                addLog(`📋 Chi tiết lỗi: ${JSON.stringify(error.response.data)}`, 'error');
            }
            
            setTestResults(prev => ({ ...prev, createPayment: 'FAIL' }));
        } finally {
            setLoading(false);
        }
    };

    // Test 3: Kiểm tra trạng thái giao dịch
    const testCheckStatus = async () => {
        if (!testPayment?.requestId) {
            addLog('⚠️ Chưa có giao dịch test để kiểm tra trạng thái', 'warning');
            return;
        }

        setLoading(true);
        addLog(`🔍 Kiểm tra trạng thái giao dịch: ${testPayment.requestId}`, 'info');
        
        try {
            const response = await momoPaymentAPI.checkPaymentStatus(testPayment.requestId);
            addLog(`✅ Kiểm tra trạng thái thành công: ${JSON.stringify(response)}`, 'success');
            setTestResults(prev => ({ ...prev, checkStatus: 'PASS' }));
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
            addLog(`❌ Kiểm tra trạng thái thất bại: ${errorMessage}`, 'error');
            
            // Log chi tiết lỗi để debug
            if (error.response?.data) {
                addLog(`📋 Chi tiết lỗi: ${JSON.stringify(error.response.data)}`, 'error');
            }
            
            setTestResults(prev => ({ ...prev, checkStatus: 'FAIL' }));
        } finally {
            setLoading(false);
        }
    };

    // Test 4: Hủy giao dịch test
    const testCancelPayment = async () => {
        if (!testPayment?.requestId) {
            addLog('⚠️ Chưa có giao dịch test để hủy', 'warning');
            return;
        }

        setLoading(true);
        addLog(`🔍 Hủy giao dịch test: ${testPayment.requestId}`, 'info');
        
        try {
            const response = await momoPaymentAPI.cancelPayment(testPayment.requestId);
            addLog(`✅ Hủy giao dịch thành công: ${JSON.stringify(response)}`, 'success');
            setTestResults(prev => ({ ...prev, cancelPayment: 'PASS' }));
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
            addLog(`❌ Hủy giao dịch thất bại: ${errorMessage}`, 'error');
            
            // Log chi tiết lỗi để debug
            if (error.response?.data) {
                addLog(`📋 Chi tiết lỗi: ${JSON.stringify(error.response.data)}`, 'error');
            }
            
            setTestResults(prev => ({ ...prev, cancelPayment: 'FAIL' }));
        } finally {
            setLoading(false);
        }
    };

    // Test 5: Simulate payment response
    const testSimulatePayment = async (resultCode = 0) => {
        if (!testPayment?.requestId) {
            addLog('⚠️ Chưa có giao dịch test để simulate', 'warning');
            return;
        }

        setLoading(true);
        addLog(`🔍 Simulate payment response với resultCode: ${resultCode}`, 'info');
        
        try {
            const response = await momoPaymentAPI.simulateResponse(testPayment.requestId, resultCode);
            addLog(`✅ Simulate thành công: ${JSON.stringify(response)}`, 'success');
            setTestResults(prev => ({ ...prev, simulatePayment: 'PASS' }));
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
            addLog(`❌ Simulate thất bại: ${errorMessage}`, 'error');
            
            // Log chi tiết lỗi để debug
            if (error.response?.data) {
                addLog(`📋 Chi tiết lỗi: ${JSON.stringify(error.response.data)}`, 'error');
            }
            
            setTestResults(prev => ({ ...prev, simulatePayment: 'FAIL' }));
        } finally {
            setLoading(false);
        }
    };

    // Tạo QR code
    const generateQRCode = async (url) => {
        try {
            const qrCodeDataUrl = await QRCode.toDataURL(url, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                },
                errorCorrectionLevel: 'M'
            });
            setQrCodeUrl(qrCodeDataUrl);
            addLog('✅ QR Code được tạo thành công', 'success');
        } catch (error) {
            addLog(`❌ Lỗi tạo QR Code: ${error.message}`, 'error');
        }
    };

    // Chạy tất cả test
    const runAllTests = async () => {
        clearLogs();
        addLog('🚀 Bắt đầu chạy tất cả test...', 'info');
        
        await testAPIConnection();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await testCreatePayment();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await testCheckStatus();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await testSimulatePayment(0); // Success
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        addLog('🎉 Hoàn thành tất cả test!', 'success');
    };

    // Reset test
    const resetTest = () => {
        setTestResults({});
        setTestPayment(null);
        setQrCodeUrl('');
        clearLogs();
        addLog('🔄 Đã reset tất cả test', 'info');
    };

    return (
        <div className="momo-payment-container">
            <div className="momo-payment-card" style={{ maxWidth: '800px' }}>
                <div className="momo-header">
                    <h2>🧪 MoMo Payment Integration Test</h2>
                    <p>Kiểm tra tích hợp MoMo Payment Frontend & Backend</p>
                </div>

                {/* Test Controls */}
                <div style={{ marginBottom: '20px' }}>
                    <h3>🎛️ Điều khiển Test</h3>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button 
                            className="momo-btn primary"
                            onClick={runAllTests}
                            disabled={loading}
                        >
                            🚀 Chạy Tất Cả Test
                        </button>
                        <button 
                            className="momo-btn secondary"
                            onClick={testAPIConnection}
                            disabled={loading}
                        >
                            🔍 Test API Connection
                        </button>
                        <button 
                            className="momo-btn secondary"
                            onClick={testCreatePayment}
                            disabled={loading}
                        >
                            💳 Test Create Payment
                        </button>
                        <button 
                            className="momo-btn secondary"
                            onClick={testCheckStatus}
                            disabled={loading}
                        >
                            📊 Test Check Status
                        </button>
                        <button 
                            className="momo-btn secondary"
                            onClick={testCancelPayment}
                            disabled={loading}
                        >
                            ❌ Test Cancel Payment
                        </button>
                        <button 
                            className="momo-btn secondary"
                            onClick={() => testSimulatePayment(0)}
                            disabled={loading}
                        >
                            ✅ Simulate Success
                        </button>
                        <button 
                            className="momo-btn secondary"
                            onClick={() => testSimulatePayment(1000)}
                            disabled={loading}
                        >
                            ❌ Simulate Failed
                        </button>
                        <button 
                            className="momo-btn secondary"
                            onClick={resetTest}
                            disabled={loading}
                        >
                            🔄 Reset Test
                        </button>
                    </div>
                </div>

                {/* Test Results */}
                <div style={{ marginBottom: '20px' }}>
                    <h3>📊 Kết Quả Test</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                        {Object.entries(testResults).map(([test, result]) => (
                            <div key={test} style={{ 
                                padding: '10px', 
                                borderRadius: '8px', 
                                backgroundColor: result === 'PASS' ? '#d4edda' : '#f8d7da',
                                color: result === 'PASS' ? '#155724' : '#721c24',
                                fontWeight: 'bold'
                            }}>
                                {test}: {result}
                            </div>
                        ))}
                    </div>
                </div>

                {/* QR Code Display */}
                {qrCodeUrl && (
                    <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                        <h3>📱 QR Code Test</h3>
                        <img src={qrCodeUrl} alt="Test QR Code" style={{ border: '2px solid #ccc', borderRadius: '8px' }} />
                        <p>Quét mã QR này để test thanh toán</p>
                    </div>
                )}

                {/* Payment Info */}
                {testPayment && (
                    <div style={{ marginBottom: '20px' }}>
                        <h3>💳 Thông Tin Giao Dịch Test</h3>
                        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                            <p><strong>Request ID:</strong> {testPayment.requestId}</p>
                            <p><strong>Order ID:</strong> {testPayment.orderId}</p>
                            <p><strong>Amount:</strong> {testPayment.amount?.toLocaleString('vi-VN')} VND</p>
                            <p><strong>Order Info:</strong> {testPayment.orderInfo}</p>
                            {testPayment.note && (
                                <p style={{ color: '#856404', backgroundColor: '#fff3cd', padding: '8px', borderRadius: '4px', marginTop: '10px' }}>
                                    <strong>Note:</strong> {testPayment.note}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Logs */}
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3>📝 Logs</h3>
                        <button 
                            className="momo-btn secondary"
                            onClick={clearLogs}
                            style={{ fontSize: '12px', padding: '5px 10px' }}
                        >
                            Clear Logs
                        </button>
                    </div>
                    <div style={{ 
                        backgroundColor: '#f8f9fa', 
                        padding: '15px', 
                        borderRadius: '8px', 
                        maxHeight: '300px', 
                        overflowY: 'auto',
                        fontFamily: 'monospace',
                        fontSize: '12px'
                    }}>
                        {logs.map((log, index) => (
                            <div key={index} style={{ 
                                marginBottom: '5px',
                                color: log.type === 'error' ? '#dc3545' : 
                                       log.type === 'success' ? '#28a745' : 
                                       log.type === 'warning' ? '#ffc107' : '#6c757d'
                            }}>
                                [{log.timestamp}] {log.message}
                            </div>
                        ))}
                        {logs.length === 0 && (
                            <div style={{ color: '#6c757d', fontStyle: 'italic' }}>
                                Chưa có logs. Hãy chạy test để xem logs.
                            </div>
                        )}
                    </div>
                </div>

                {/* Loading Indicator */}
                {loading && (
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <div className="loading-spinner"></div>
                        <p>Đang xử lý...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QRTest;
