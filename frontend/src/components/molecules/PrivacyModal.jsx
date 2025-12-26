// src/components/modals/PrivacyModal.jsx

import { useState, useRef, useEffect } from 'react';
import { X, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

const PrivacyModal = ({ isOpen, onClose, onAccept }) => {
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
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Privacy Policy</h2>
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
              <h3 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h3>
              <p className="mb-3">We collect several types of information from and about users of our service:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Account Information:</strong> Username, email address, password (hashed), and full name</li>
                <li><strong>Usage Data:</strong> Cipher operations, encryption/decryption history, time spent on platform</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information, access times</li>
                <li><strong>Analytics Data:</strong> Performance metrics, feature usage, user interactions</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h3>
              <p className="mb-3">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Personalize your learning experience</li>
                <li>Track your progress and generate statistics</li>
                <li>Communicate with you about updates and features</li>
                <li>Ensure security and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-3">3. Data Storage and Security</h3>
              <p className="mb-3">
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Passwords are hashed using bcrypt with salt rounds</li>
                <li>HTTPS encryption for all data transmission</li>
                <li>Secure database with access controls</li>
                <li>Regular security audits and updates</li>
                <li>Data backup and recovery procedures</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-3">4. Data Sharing and Disclosure</h3>
              <p className="mb-3">We do NOT sell your personal information. We may share your data only in these limited circumstances:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Public Leaderboard:</strong> Username and statistics (opt-in)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect rights</li>
                <li><strong>Service Providers:</strong> Trusted third parties who assist in operations</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-3">5. Your Data Rights</h3>
              <p className="mb-3">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Export:</strong> Download your data in JSON/CSV format</li>
                <li><strong>Opt-out:</strong> Decline optional data collection</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-3">6. Cookies and Tracking</h3>
              <p>
                We use cookies and similar technologies to maintain your session, remember preferences, and analyze usage patterns. You can control cookie settings through your browser, though this may limit some functionality.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-3">7. Third-Party Services</h3>
              <p>
                Our service may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to read their privacy policies.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-3">8. Children's Privacy</h3>
              <p>
                Our service is not intended for children under 13. We do not knowingly collect personal information from children. If you believe we have collected data from a child, please contact us immediately.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-3">9. Data Retention</h3>
              <p>
                We retain your personal information for as long as your account is active or as needed to provide services. You may request deletion at any time, though some data may be retained for legal compliance.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-3">10. International Users</h3>
              <p>
                Your information may be transferred to and processed in countries other than your own. By using our service, you consent to such transfers in accordance with this Privacy Policy.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-3">11. Changes to This Policy</h3>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of significant changes via email or through the service. Continued use after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-3">12. Contact Us</h3>
              <p>
                If you have questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="mt-3 p-4 bg-purple-500/20 border border-purple-500/50 rounded-lg">
                <p className="text-white">Email: privacy@cryptosuite.com</p>
                <p className="text-white">Address: Crypto Suite Privacy Team</p>
              </div>
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
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
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

export default PrivacyModal;