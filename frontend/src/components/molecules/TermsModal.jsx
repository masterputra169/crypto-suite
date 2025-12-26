// src/components/molecules/TermsModal.jsx

import { useState, useRef, useEffect } from 'react';
import { X, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const TermsModal = ({ isOpen, onClose, onAccept }) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setHasScrolledToBottom(false);
    }
  }, [isOpen]);

  const handleScroll = (e) => {
    const element = e.target;
    const scrolledToBottom = 
      element.scrollHeight - element.scrollTop <= element.clientHeight + 10;
    
    if (scrolledToBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  const handleAccept = () => {
    if (hasScrolledToBottom) {
      onAccept();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Terms of Service</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div 
          ref={contentRef}
          onScroll={handleScroll}
          className="px-6 py-6 max-h-[60vh] overflow-y-auto custom-scrollbar"
        >
          <div className="space-y-6 text-gray-300">
            <section>
              <h3 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h3>
              <p>
                By accessing and using Crypto Suite ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use this service.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-3">2. Description of Service</h3>
              <p>
                Crypto Suite is an educational platform designed to teach cryptographic algorithms and techniques. The service provides interactive tools for learning various encryption and decryption methods.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-3">3. User Responsibilities</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You must be at least 13 years old to use this service</li>
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>You must not use the service for any illegal purposes</li>
                <li>You must not attempt to gain unauthorized access to the service</li>
                <li>You must not upload malicious code or content</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-3">4. Educational Use Only</h3>
              <p>
                The cryptographic tools provided are for educational purposes only. Users should not rely on these implementations for securing sensitive or production data. Modern, battle-tested libraries should be used for real-world security applications.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-3">5. Intellectual Property</h3>
              <p>
                All content, features, and functionality of Crypto Suite are owned by the service provider and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-3">6. User Data and Privacy</h3>
              <p>
                We collect and process user data as described in our Privacy Policy. By using the service, you consent to such processing and warrant that all data provided is accurate.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-3">7. Limitation of Liability</h3>
              <p>
                The service is provided "as is" without warranties of any kind. We shall not be liable for any damages arising from the use or inability to use the service, including but not limited to data loss or security breaches.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-3">8. Modifications to Service</h3>
              <p>
                We reserve the right to modify or discontinue the service at any time without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-3">9. Termination</h3>
              <p>
                We may terminate or suspend your account and access to the service immediately, without prior notice, for any reason, including breach of these terms.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-3">10. Governing Law</h3>
              <p>
                These terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-3">11. Contact Information</h3>
              <p>
                For questions about these Terms of Service, please contact us at support@cryptosuite.com
              </p>
            </section>

            <div className="mt-8 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
              <p className="text-sm text-blue-200">
                <strong>Last Updated:</strong> December 25, 2024
              </p>
            </div>
          </div>
        </div>

        {/* Footer - Sticky */}
        <div className="sticky bottom-0 bg-gray-800 px-6 py-4 border-t border-gray-700">
          {!hasScrolledToBottom && (
            <div className="flex items-center gap-2 text-yellow-400 text-sm mb-3">
              <AlertCircle className="w-4 h-4" />
              <span>Please scroll to the bottom to continue</span>
            </div>
          )}
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAccept}
              disabled={!hasScrolledToBottom}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                hasScrolledToBottom
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              I Accept
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default TermsModal;