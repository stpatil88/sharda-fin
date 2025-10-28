import { useState } from 'react';
import { QrCode, ExternalLink, Smartphone } from 'lucide-react';

export default function DematAccountQR({ className = '' }) {
  const [showQR, setShowQR] = useState(false);
  
  const angelOneLink = 'https://angel-one.onelink.me/Wjgr/3mc0nam3';

  const openDematAccount = () => {
    window.open(angelOneLink, '_blank');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Scan QR Code to Open Demat Account
              </h3>
              
              {/* QR Code Image */}
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4 inline-block">
                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">QR Code</p>
                    <p className="text-xs text-gray-400 mt-1">Scan with your phone</p>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">
                Scan this QR code with your phone camera to open your Demat account with Angel One
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={openDematAccount}
                  className="flex-1 btn-primary flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Link</span>
                </button>
                <button
                  onClick={() => setShowQR(false)}
                  className="flex-1 btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Demat Account Opening Options */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Open Demat Account
        </h3>
        
        <div className="space-y-3">
          <button
            onClick={openDematAccount}
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Account Online</span>
          </button>
          
          <button
            onClick={() => setShowQR(true)}
            className="w-full btn-secondary flex items-center justify-center space-x-2"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan QR Code</span>
          </button>
        </div>
        
        <div className="mt-4 p-3 bg-primary-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <Smartphone className="w-5 h-5 text-primary-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-primary-800 mb-1">
                Quick & Easy Process
              </p>
              <ul className="text-primary-700 space-y-1">
                <li>• Minimum documents required</li>
                <li>• PAN Card sufficient to start</li>
                <li>• 2+ crore downloads</li>
                <li>• Trusted by millions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
